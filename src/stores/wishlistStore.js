import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      
      // Fetch wishlist from backend
      fetchWishlist: async () => {
        set({ loading: true });
        try {
          const response = await api.get('/wishlist');
          set({ items: response.data.items || [], loading: false });
          return { success: true };
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          set({ loading: false });
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Add item to wishlist
      addItem: async (product) => {
        try {
          const response = await api.post('/wishlist', { product_id: product.id });
          
          // Update local state
          set((state) => {
            if (state.items.find((item) => item.product?.id === product.id)) {
              return state;
            }
            return {
              items: [...state.items, response.data.item],
            };
          });
          
          return { success: true };
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Remove item from wishlist
      removeItem: async (productId) => {
        try {
          // Find the wishlist item
          const state = get();
          const wishlistItem = state.items.find((item) => item.product?.id === productId);
          
          if (wishlistItem) {
            await api.delete(`/wishlist/${wishlistItem.id}`);
          }
          
          // Update local state
          set((state) => ({
            items: state.items.filter((item) => item.product?.id !== productId),
          }));
          
          return { success: true };
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Check if product is in wishlist
      isInWishlist: (productId) => {
        const state = get();
        return state.items.some((item) => item.product?.id === productId);
      },
      
      // Clear wishlist (local only)
      clearWishlist: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.items
      }),
      // Migration function to clear old format
      migrate: (persistedState, version) => {
        // Check if items have old format (no 'product' property)
        if (persistedState?.items?.length > 0) {
          const hasOldFormat = persistedState.items.some(item => !item.product && item.id);
          if (hasOldFormat) {
            console.log('Migrating wishlist from old format...');
            return { items: [], loading: false };
          }
        }
        return persistedState;
      }
    }
  )
);

