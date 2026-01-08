import { create } from 'zustand';
import api from '../utils/api';

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  currentOrder: null,
  
  // Fetch all orders
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/orders');
      set({ orders: response.data.orders || [], loading: false });
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Fetch single order
  fetchOrder: async (orderId) => {
    set({ loading: true });
    try {
      const response = await api.get(`/orders/${orderId}`);
      set({ currentOrder: response.data.order, loading: false });
      return { success: true, order: response.data.order };
    } catch (error) {
      console.error('Failed to fetch order:', error);
      set({ loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      
      set((state) => ({
        orders: [response.data.order, ...state.orders]
      }));
      
      return { success: true, order: response.data.order };
    } catch (error) {
      console.error('Failed to create order:', error);
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? response.data.order : order
        )
      }));
      
      return { success: true, order: response.data.order };
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return { success: false, error: error.response?.data?.error };
    }
  }
}));
