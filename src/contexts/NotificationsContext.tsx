import { createContext } from 'preact';
import { useContext, useState, useEffect, useMemo } from 'preact/hooks';
import { useAuth } from './AuthContext';
import { usePermisos } from '@/hooks/usePermisos';
import { Permiso, UserRole } from '@/types';
import { getViewedNotifications, markNotificationAsViewed } from '@/utils/notificationsStorage';

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

// Helper para verificar si un usuario tiene un rol específico
const hasRole = (userRole: UserRole, userRoles: UserRole[] | undefined, targetRole: UserRole): boolean => {
  // Si tiene roles múltiples, verificar en el array
  if (userRoles && Array.isArray(userRoles) && userRoles.length > 0) {
    if (userRoles.includes(targetRole)) return true;
  }
  // Verificar el rol principal
  return userRole === targetRole;
};

const canSign = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined, userId?: string): boolean => {
  const nextPendingApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
  if (!nextPendingApproval) return false;
  
  // Si la próxima aprobación es SOLICITANTE, solo el solicitante específico puede firmar
  if (nextPendingApproval.rolFirmante === 'SOLICITANTE') {
    return hasRole(userRole, userRoles, 'SOLICITANTE') && userId === permiso.solicitanteId;
  }
  
  // Para otros roles, verificar que el SOLICITANTE ya haya firmado
  const solicitanteAprobacion = permiso.aprobaciones.find(a => a.rolFirmante === 'SOLICITANTE');
  if (!solicitanteAprobacion || solicitanteAprobacion.estado !== 'FIRMADO') {
    return false;
  }
  
  // Verificar si el usuario tiene el rol necesario
  return hasRole(userRole, userRoles, nextPendingApproval.rolFirmante);
};

const canSignMedico = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined): boolean => {
  return hasRole(userRole, userRoles, 'DOCTORA') &&
         !!permiso.aprobacionMedica &&
         permiso.aprobacionMedica.estado === 'PENDIENTE';
};

const canMonitor = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined): boolean => {
  const allMainApprovalsDone = permiso.aprobaciones
    .filter(a => a.rolFirmante !== 'LIDER')
    .every(a => a.estado === 'FIRMADO');

  return hasRole(userRole, userRoles, 'INSPECTOR') &&
         !!permiso.monitoreo &&
         permiso.monitoreo.estado === 'PENDIENTE' &&
         allMainApprovalsDone;
};

const canClose = (permiso: Permiso, userRole: UserRole, userRoles: UserRole[] | undefined): boolean => {
  return hasRole(userRole, userRoles, 'LIDER') &&
         permiso.estado === 'ACTIVO' &&
         !permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER' && a.estado === 'FIRMADO');
};

export function NotificationsProvider({ children }: { children: preact.ComponentChildren | preact.ComponentChildren[] }) {
  const { user, isAuthenticated } = useAuth();
  const { data: permisos, loading, refetch } = usePermisos({});
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  // Cargar notificaciones vistas cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      setViewedIds(getViewedNotifications(user.id));
    } else {
      setViewedIds(new Set());
    }
  }, [user?.id]);

  // Escuchar eventos de actualización de permisos para refrescar las notificaciones
  useEffect(() => {
    const handlePermisoUpdated = () => {
      refetch();
    };
    
    window.addEventListener('permiso-updated', handlePermisoUpdated);
    return () => {
      window.removeEventListener('permiso-updated', handlePermisoUpdated);
    };
  }, [refetch]);

  const notifications = useMemo<Notification[]>(() => {
    if (!isAuthenticated || !user || !permisos || permisos.length === 0) {
      return [];
    }

    const userRole = user.role as UserRole;
    // Asegurar que userRoles sea un array válido o undefined
    const userRoles = (user.roles && Array.isArray(user.roles) && user.roles.length > 0) ? user.roles : undefined;
    const userId = user.id;
    const notifs: Notification[] = [];

    permisos.forEach(permiso => {
      // Verificar si puede firmar aprobaciones principales
      if (canSign(permiso, userRole, userRoles, userId)) {
        const nextApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
        notifs.push({
          id: `sign-${permiso.id}`,
          type: 'sign',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Tienes una firma pendiente como ${nextApproval?.rolFirmante} en el permiso ${permiso.numero}`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'high',
        });
      }

      // Verificar si puede firmar aprobación médica
      if (canSignMedico(permiso, userRole, userRoles)) {
        notifs.push({
          id: `medico-${permiso.id}`,
          type: 'sign_medico',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Tienes una aprobación médica pendiente para el permiso ${permiso.numero}`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'high',
        });
      }

      // Verificar si puede monitorear
      if (canMonitor(permiso, userRole, userRoles)) {
        notifs.push({
          id: `monitor-${permiso.id}`,
          type: 'monitor',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Tienes un monitoreo pendiente para el permiso ${permiso.numero}`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'medium',
        });
      }

      // Verificar si puede cerrar
      if (canClose(permiso, userRole, userRoles)) {
        notifs.push({
          id: `close-${permiso.id}`,
          type: 'close',
          permisoId: permiso.id,
          permisoNumero: permiso.numero,
          message: `Puedes cerrar el permiso ${permiso.numero}`,
          fechaSolicitud: permiso.fechaSolicitud,
          priority: 'low',
        });
      }
    });

    // Filtrar notificaciones ya vistas
    const unviewedNotifs = notifs.filter(notif => !viewedIds.has(notif.id));

    return unviewedNotifs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime();
    });
  }, [isAuthenticated, user, permisos, viewedIds]);

  const unreadCount = notifications.length;

  const markAsViewed = (notificationId: string) => {
    if (!user?.id) return;
    setViewedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      markNotificationAsViewed(notificationId, user.id);
      return newSet;
    });
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, loading: !isAuthenticated ? false : loading, markAsViewed }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    // Fallback si no hay provider (para compatibilidad)
    return { notifications: [], unreadCount: 0, loading: false, markAsViewed: () => {} };
  }
  return context;
}

