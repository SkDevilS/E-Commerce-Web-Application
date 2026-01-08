import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      synced: false, // Track if cart is synced with backend
      
      // Fetch cart from backend
      fetchCart: async () => {
        set({ loading: true });
        try {
          const response = await api.get('/cart');
          set({ 
            items: response.data.items || [], 
            loading: false,
            synced: true 
          });
          return { success: true };
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ loading: false });
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Clear local cart (for migration from old format)
      clearLocalCart: () => {
        set({ items: [], synced: false });
      },
      
      // Add item to cart
      addItem: async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
        try {
          const response = await api.post('/cart', {
            product_id: product.id,
            quantity,
            size: selectedSize,
            color: selectedColor
          });
          
          // Update local state
          set((state) => {
            const existingItem = state.items.find(
              (item) =>
                item.product?.id === product.id &&
                item.size === selectedSize &&
                item.color === selectedColor
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.id === existingItem.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            }

            return {
              items: [...state.items, response.data.item],
            };
          });
          
          return { success: true };
        } catch (error) {
          console.error('Failed to add to cart:', error);
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Remove item from cart
      removeItem: async (itemId) => {
        try {
          await api.delete(`/cart/${itemId}`);
          
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }));
          
          return { success: true };
        } catch (error) {
          console.error('Failed to remove from cart:', error);
          // If item doesn't exist in backend, remove from local state anyway
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }));
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Update item quantity
      updateQuantity: async (itemId, quantity) => {
        try {
          if (quantity <= 0) {
            return get().removeItem(itemId);
          }
          
          await api.put(`/cart/${itemId}`, { quantity });
          
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
            ),
          }));
          
          return { success: true };
        } catch (error) {
          console.error('Failed to update quantity:', error);
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Clear cart
      clearCart: async () => {
        try {
          await api.delete('/cart/clear');
          set({ items: [] });
          return { success: true };
        } catch (error) {
          console.error('Failed to clear cart:', error);
          // Clear local state anyway
          set({ items: [] });
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Get cart total
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const product = item.product;
          if (!product) return total;
          const price = product.is_on_sale ? product.price : product.original_price || product.price;
          return total + price * item.quantity;
        }, 0);
      },
      
      // Get item count
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        synced: state.synced
      }),
      // Migration function to clear old format
      migrate: (persistedState, version) => {
        // Check if items have old format (no 'product' property)
        if (persistedState?.items?.length > 0) {
          const hasOldFormat = persistedState.items.some(item => !item.product && item.id);
          if (hasOldFormat) {
            console.log('Migrating cart from old format...');
            return { items: [], loading: false, synced: false };
          }
        }
        return persistedState;
      }
    }
  )
);

