import { create } from 'zustand';
import api from '../utils/api';

export const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  
  // Fetch all addresses
  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/addresses');
      set({ addresses: response.data.addresses || [], loading: false });
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      set({ loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Add new address
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      
      set((state) => ({
        addresses: [...state.addresses, response.data.address]
      }));
      
      return { success: true, address: response.data.address };
    } catch (error) {
      console.error('Failed to add address:', error);
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      
      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === addressId ? response.data.address : addr
        )
      }));
      
      return { success: true, address: response.data.address };
    } catch (error) {
      console.error('Failed to update address:', error);
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Delete address
  deleteAddress: async (addressId) => {
    try {
      await api.delete(`/addresses/${addressId}`);
      
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== addressId)
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete address:', error);
      return { success: false, error: error.response?.data?.error };
    }
  },
  
  // Get default address
  getDefaultAddress: () => {
    const state = get();
    return state.addresses.find((addr) => addr.is_default);
  }
}));
