/**
 * Utility to clear old localStorage data from mock implementation
 * Run this once to migrate users from old cart format to new backend format
 */

export const clearOldCartData = () => {
  try {
    const cartStorage = localStorage.getItem('cart-storage');
    
    if (cartStorage) {
      const parsed = JSON.parse(cartStorage);
      
      // Check if cart has old format (items without 'product' property)
      if (parsed.state?.items?.length > 0) {
        const hasOldFormat = parsed.state.items.some(item => !item.product && item.id);
        
        if (hasOldFormat) {
          console.log('🧹 Clearing old cart format...');
          localStorage.removeItem('cart-storage');
          console.log('✅ Old cart data cleared');
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error clearing old cart data:', error);
    return false;
  }
};

export const clearOldWishlistData = () => {
  try {
    const wishlistStorage = localStorage.getItem('wishlist-storage');
    
    if (wishlistStorage) {
      const parsed = JSON.parse(wishlistStorage);
      
      // Check if wishlist has old format (items without 'product' property)
      if (parsed.state?.items?.length > 0) {
        const hasOldFormat = parsed.state.items.some(item => !item.product && item.id);
        
        if (hasOldFormat) {
          console.log('🧹 Clearing old wishlist format...');
          localStorage.removeItem('wishlist-storage');
          console.log('✅ Old wishlist data cleared');
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error clearing old wishlist data:', error);
    return false;
  }
};

export const clearAllOldData = () => {
  console.log('🧹 Clearing all old localStorage data...');
  
  // Clear old cart
  localStorage.removeItem('cart-storage');
  
  // Clear old wishlist
  localStorage.removeItem('wishlist-storage');
  
  // Clear old auth (will require re-login)
  // localStorage.removeItem('auth-storage');
  
  console.log('✅ All old data cleared. Please refresh the page.');
};

// Auto-clear on import (runs once when app loads)
if (typeof window !== 'undefined') {
  clearOldCartData();
  clearOldWishlistData();
}
