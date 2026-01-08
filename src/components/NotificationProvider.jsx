import { useNotificationStore } from '../stores/notificationStore';
import NotificationModal from './NotificationModal';

const NotificationProvider = () => {
  const { notification, isOpen, closeNotification } = useNotificationStore();

  if (!notification) return null;

  return (
    <NotificationModal
      isOpen={isOpen}
      onClose={closeNotification}
      onConfirm={notification.onConfirm}
      type={notification.type}
      title={notification.title}
      message={notification.message}
      confirmText={notification.confirmText}
      cancelText={notification.cancelText}
      showCancel={notification.showCancel}
      details={notification.details}
    />
  );
};

export default NotificationProvider;