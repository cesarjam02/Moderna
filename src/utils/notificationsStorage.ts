/**
 * Utilidades para gestionar notificaciones vistas en localStorage
 */

const STORAGE_KEY = 'notifications_viewed';

/**
 * Obtiene todas las notificaciones vistas del usuario actual
 */
export function getViewedNotifications(userId?: string): Set<string> {
  if (!userId) return new Set();
  
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (!stored) return new Set();
    
    const data = JSON.parse(stored);
    // Limpiar notificaciones antiguas (más de 7 días)
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    const validIds = new Set<string>();
    for (const [id, timestamp] of Object.entries(data)) {
      if (typeof timestamp === 'number' && timestamp > sevenDaysAgo) {
        validIds.add(id);
      }
    }
    
    // Guardar solo las válidas
    if (validIds.size !== Object.keys(data).length) {
      const cleaned: Record<string, number> = {};
      validIds.forEach(id => {
        cleaned[id] = data[id];
      });
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(cleaned));
    }
    
    return validIds;
  } catch {
    return new Set();
  }
}

/**
 * Marca una notificación como vista
 */
export function markNotificationAsViewed(notificationId: string, userId?: string): void {
  if (!userId) return;
  
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    const data = stored ? JSON.parse(stored) : {};
    data[notificationId] = Date.now();
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error al marcar notificación como vista:', error);
  }
}

/**
 * Limpia todas las notificaciones vistas (útil para testing o reset)
 */
export function clearViewedNotifications(userId?: string): void {
  if (!userId) return;
  localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
}

