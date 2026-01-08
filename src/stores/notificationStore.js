import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notification: null,
  isOpen: false,

  // Show notification
  showNotification: (config) => {
    set({
      notification: {
        id: Date.now(),
        type: 'info',
        title: 'Notification',
        message: '',
        confirmText: 'OK',
        cancelText: 'Cancel',
        showCancel: false,
        details: null,
        onConfirm: null,
        ...config
      },
      isOpen: true
    });
  },

  // Show success notification
  showSuccess: (title, message, details = null) => {
    get().showNotification({
      type: 'success',
      title,
      message,
      details,
      confirmText: 'Great!'
    });
  },

  // Show error notification
  showError: (title, message, details = null) => {
    get().showNotification({
      type: 'error',
      title,
      message,
      details,
      confirmText: 'OK'
    });
  },

  // Show warning notification
  showWarning: (title, message, details = null) => {
    get().showNotification({
      type: 'warning',
      title,
      message,
      details,
      confirmText: 'Understood'
    });
  },

  // Show confirmation dialog
  showConfirm: (title, message, onConfirm, details = null, confirmText = 'Confirm', cancelText = 'Cancel') => {
    get().showNotification({
      type: 'confirm',
      title,
      message,
      details,
      confirmText,
      cancelText,
      showCancel: true,
      onConfirm
    });
  },

  // Close notification
  closeNotification: () => {
    set({ isOpen: false });
    // Clear notification after animation
    setTimeout(() => {
      set({ notification: null });
    }, 300);
  },

  // Utility methods for common scenarios
  confirmDelete: (itemName, onConfirm, productCount = 0) => {
    const details = productCount > 0 ? [
      'Move all products to another section, OR',
      'Delete all products in this section first'
    ] : null;

    const message = productCount > 0 
      ? `Cannot delete "${itemName}" because it contains ${productCount} product(s).`
      : `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;

    const title = productCount > 0 ? 'Cannot Delete Section' : 'Confirm Deletion';

    if (productCount > 0) {
      get().showNotification({
        type: 'warning',
        title,
        message: message + '\n\nWould you like to proceed anyway? (This will move products to "Miscellaneous" section)',
        details,
        confirmText: 'Delete Anyway',
        cancelText: 'Cancel',
        showCancel: true,
        onConfirm
      });
    } else {
      get().showConfirm(title, message, onConfirm, null, 'Delete', 'Cancel');
    }
  }
}));