import { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useNotifications, Notification } from '@/hooks/useNotifications';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDropdown: FunctionalComponent<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, loading, markAsViewed } = useNotifications();

  if (!isOpen) return null;

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como vista antes de navegar
    markAsViewed(notification.id);
    // Pequeño delay para asegurar que el estado se actualice antes de navegar
    setTimeout(() => {
      route(`/permisos/${notification.permisoId}`);
      onClose();
    }, 50);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getNotificationIcon = (type: Notification['type']): string => {
    switch (type) {
      case 'sign':
        return '✍️';
      case 'sign_medico':
        return '🏥';
      case 'monitor':
        return '📊';
      case 'close':
        return '✅';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']): string => {
    switch (type) {
      case 'sign':
        return 'border-blue-500 bg-blue-500/10';
      case 'sign_medico':
        return 'border-purple-500 bg-purple-500/10';
      case 'monitor':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'close':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">🔔</div>
              <p>No tienes notificaciones pendientes</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 hover:bg-gray-700 transition-colors border-l-4 ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        Permiso {notification.permisoNumero} • {formatDate(notification.fechaSolicitud)}
                      </p>
                    </div>
                    {notification.priority === 'high' && (
                      <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-700 bg-gray-900/50">
            <button
              onClick={() => {
                route('/permisos');
                onClose();
              }}
              className="w-full text-sm text-center text-rojo-moderna hover:text-rojo-moderna-dark transition-colors"
            >
              Ver todos los permisos
            </button>
          </div>
        )}
      </div>
    </>
  );
};

