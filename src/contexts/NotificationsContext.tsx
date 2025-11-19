import { createContext } from 'preact';
import { useContext, useState, useEffect, useMemo, useCallback } from 'preact/hooks';
import { useAuth } from './AuthContext';
import { usePermisos } from '@/hooks/usePermisos';
import { Permiso, UserRole } from '@/types';
import { getViewedNotifications, markNotificationAsViewed as saveViewedToStorage } from '@/utils/notificationsStorage';

export interface Notification {
  id: string;
  type: 'sign' | 'sign_medico' | 'monitor' | 'close';
  permisoId: string;
  permisoNumero: string;
  message: string;
  fechaSolicitud: string;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsViewed: (notificationId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const hasRole = (userRole: UserRole, userRoles: UserRole[] | undefined, targetRole: UserRole): boolean => {
  if (userRoles && Array.isArray(userRoles) && userRoles.length > 0) {
    return userRoles.includes(targetRole);
  }
  return userRole === targetRole;
};

const canSign = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined, userId?: string): boolean => {
  const nextPendingApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
  if (!nextPendingApproval) return false;
  if (nextPendingApproval.usuarioAsignado) {
    return nextPendingApproval.usuarioAsignado.id === userId;
  }
  return hasRole(userRole, userRoles, nextPendingApproval.rolFirmante);
};

const canSignMedico = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined): boolean => {
  return hasRole(userRole, userRoles, 'DOCTORA') && !!permiso.aprobacionMedica && permiso.aprobacionMedica.estado === 'PENDIENTE';
};

const canInitiateClose = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined, userId?: string): boolean => {
  return permiso.estado === 'ACTIVO' && permiso.solicitanteId === userId; 
};

const canSignClosing = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined): boolean => {
  if (permiso.estado !== 'EN_CIERRE') return false;
  const pending = permiso.aprobacionesCierre?.find(a => a.estado === 'PENDIENTE');
  if (!pending) return false;
  return hasRole(userRole, userRoles, pending.rolFirmante);
};

export function NotificationsProvider({ children }: { children: preact.ComponentChildren | preact.ComponentChildren[] }) {
  const { user, isAuthenticated } = useAuth();
  const { data: permisos, loading, refetch } = usePermisos({});
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.id) setViewedIds(getViewedNotifications(user.id));
    else setViewedIds(new Set());
  }, [user?.id]);

  useEffect(() => {
    const handlePermisoUpdated = () => { refetch(); };
    window.addEventListener('permiso-updated', handlePermisoUpdated);
    return () => { window.removeEventListener('permiso-updated', handlePermisoUpdated); };
  }, [refetch]);

  // Polling cada 5 segundos para actualizar notificaciones automáticamente
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => { refetch(); }, 5000); 
    return () => clearInterval(interval);
  }, [isAuthenticated, refetch]);

  const notifications = useMemo<Notification[]>(() => {
    if (!isAuthenticated || !user || !permisos || permisos.length === 0) return [];

    const userRole = user.role as UserRole;
    const userRoles = (user.roles && Array.isArray(user.roles) && user.roles.length > 0) ? user.roles : undefined;
    const userId = user.id;
    const notifs: Notification[] = [];

    // Helper para ID único basado en fecha de creación (corrige problema de reinicio de mocks)
    const getUniqueSuffix = (p: Permiso) => new Date(p.fechaSolicitud).getTime();

    permisos.forEach(permiso => {
      // 1. Firma de Apertura
      if (canSign(permiso, userRole, userRoles, userId)) {
        const nextApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
        notifs.push({
          id: `sign-${permiso.id}-${nextApproval?.id}`,
          type: 'sign',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Turno de firma: ${nextApproval?.usuarioAsignado ? nextApproval.usuarioAsignado.nombre : nextApproval?.rolFirmante}`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'high',
        });
      }

      // 2. Firma Médica
      if (canSignMedico(permiso, userRole, userRoles)) {
        notifs.push({ 
          id: `medico-${permiso.id}-${getUniqueSuffix(permiso)}`, 
          type: 'sign_medico', 
          permisoId: permiso.id, 
          permisoNumero: permiso.numero, 
          message: `Aprobación médica pendiente`, 
          fechaSolicitud: permiso.fechaSolicitud, 
          priority: 'high' 
        });
      }
      
      // 3. Iniciar Cierre (Permiso Activo)
      if (canInitiateClose(permiso, userRole, userRoles, userId)) {
        notifs.push({
          // ID ÚNICO: Agregamos timestamp para que siempre se detecte como nueva tras reinicio
          id: `init-close-${permiso.id}-${getUniqueSuffix(permiso)}`,
          type: 'close',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Permiso activo. Puede iniciar el cierre.`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'low',
        });
      }

      // 4. Firmas de Cierre (Inspector, HSEQ, Area)
      if (canSignClosing(permiso, userRole, userRoles)) {
        const pending = permiso.aprobacionesCierre?.find(a => a.estado === 'PENDIENTE');
        notifs.push({
          id: `closing-step-${permiso.id}-${pending?.id}`,
          type: 'close',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Cierre: Se requiere firma de ${pending?.rolFirmante}`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'high',
        });
      }
    });

    return notifs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime();
    });
  }, [isAuthenticated, user, permisos]);

  const unreadCount = useMemo(() => notifications.filter(n => !viewedIds.has(n.id)).length, [notifications, viewedIds]);

  const markAsViewed = useCallback((notificationId: string) => {
    if (!user?.id) return;
    setViewedIds(prev => {
      if (prev.has(notificationId)) return prev;
      const newSet = new Set(prev);
      newSet.add(notificationId);
      saveViewedToStorage(notificationId, user.id);
      return newSet;
    });
  }, [user?.id]);

  const contextValue = useMemo(() => ({ notifications, unreadCount, loading: !isAuthenticated ? false : loading, markAsViewed }), [notifications, unreadCount, loading, isAuthenticated, markAsViewed]);

  return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) return { notifications: [], unreadCount: 0, loading: false, markAsViewed: () => {} };
  return context;
}