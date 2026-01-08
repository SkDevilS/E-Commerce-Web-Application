import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      refreshToken: null,
      
      // Login user
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { access_token, refresh_token, user } = response.data;
          
          // Store tokens
          localStorage.setItem('customer_token', access_token);
          localStorage.setItem('customer_refresh_token', refresh_token);
          
          set({
            isLoggedIn: true,
            user,
            token: access_token,
            refreshToken: refresh_token
          });
          
          return { success: true, user };
        } catch (error) {
          console.error('Login error:', error);
          return {
            success: false,
            error: error.response?.data?.error || 'Login failed'
          };
        }
      },
      
      // Register new user
      register: async (name, email, password) => {
        try {
          const response = await api.post('/auth/register', { name, email, password });
          const { access_token, refresh_token, user } = response.data;
          
          // Store tokens
          localStorage.setItem('customer_token', access_token);
          localStorage.setItem('customer_refresh_token', refresh_token);
          
          set({
            isLoggedIn: true,
            user,
            token: access_token,
            refreshToken: refresh_token
          });
          
          return { success: true, user };
        } catch (error) {
          console.error('Registration error:', error);
          return {
            success: false,
            error: error.response?.data?.error || 'Registration failed'
          };
        }
      },
      
      // Logout user
      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            await api.post('/auth/logout');
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear auth tokens
          localStorage.removeItem('customer_token');
          localStorage.removeItem('customer_refresh_token');
          localStorage.removeItem('auth-storage');
          
          // Clear cart and wishlist from localStorage
          localStorage.removeItem('cart-storage');
          localStorage.removeItem('wishlist-storage');
          
          set({
            isLoggedIn: false,
            user: null,
            token: null,
            refreshToken: null
          });
        }
      },
      
      // Check authentication status
      checkAuth: async () => {
        const token = localStorage.getItem('customer_token');
        if (!token) {
          set({ isLoggedIn: false, user: null, token: null });
          return false;
        }
        
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const refreshToken = localStorage.getItem('customer_refresh_token');
          
          set({
            isLoggedIn: true,
            user: response.data.user,
            token,
            refreshToken
          });
          
          return true;
        } catch (error) {
          localStorage.removeItem('customer_token');
          localStorage.removeItem('customer_refresh_token');
          set({ isLoggedIn: false, user: null, token: null, refreshToken: null });
          return false;
        }
      },
      
      // Fetch current user profile
      fetchUser: async () => {
        try {
          const response = await api.get('/auth/me');
          const { user } = response.data;
          
          set({ user });
          return { success: true, user };
        } catch (error) {
          if (error.response?.status === 401) {
            get().logout();
          }
          return { success: false, error: error.response?.data?.error };
        }
      },
      
      // Update user profile
      updateProfile: async (name, email, phone, date_of_birth, gender) => {
        try {
          const response = await api.put('/auth/profile', { 
            name, 
            email,
            phone,
            date_of_birth,
            gender
          });
          const { user } = response.data;
          
          set({ user });
          return { success: true, user, message: 'Profile updated successfully' };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Failed to update profile';
          return { success: false, error: errorMessage };
        }
      },
      
      // Change password
      changePassword: async (oldPassword, newPassword) => {
        try {
          await api.post('/auth/change-password', {
            old_password: oldPassword,
            new_password: newPassword
          });
          
          return { success: true, message: 'Password changed successfully' };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Failed to change password';
          return { success: false, error: errorMessage };
        }
      },
      
      // Request password reset
      requestPasswordReset: async (email) => {
        try {
          const response = await api.post('/auth/request-password-reset', { email });
          return { success: true, message: response.data.message };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Failed to send reset email';
          return { success: false, error: errorMessage };
        }
      },
      
      // Refresh access token
      refreshAccessToken: async () => {
        try {
          const refreshToken = get().refreshToken || localStorage.getItem('customer_refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await api.post('/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token } = response.data;
          localStorage.setItem('customer_token', access_token);
          
          set({ token: access_token });
          return { success: true, token: access_token };
        } catch (error) {
          get().logout();
          return { success: false, error: 'Session expired. Please login again.' };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken
      })
    }
  )
);

