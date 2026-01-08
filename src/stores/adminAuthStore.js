import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import adminApi from '../utils/adminApi';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (email, password) => {
        try {
          const response = await adminApi.post('/auth/login', { email, password });
          
          if (response.data.user.role !== 'admin') {
            // Clear any stored data for non-admin users
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            set({
              isAuthenticated: false,
              user: null,
              token: null
            });
            throw new Error('Access denied. Admin privileges required.');
          }

          const { access_token, user } = response.data;
          
          localStorage.setItem('admin_token', access_token);
          localStorage.setItem('admin_user', JSON.stringify(user));
          
          set({
            isAuthenticated: true,
            user,
            token: access_token
          });

          return { success: true };
        } catch (error) {
          // Clear any stored data on login failure
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          set({
            isAuthenticated: false,
            user: null,
            token: null
          });
          
          return {
            success: false,
            error: error.response?.data?.error || error.message || 'Login failed'
          };
        }
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('admin_token');
        const userStr = localStorage.getItem('admin_user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.role === 'admin') {
              set({
                isAuthenticated: true,
                user,
                token
              });
              return true;
            }
          } catch (error) {
            console.error('Auth check failed:', error);
          }
        }
        
        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
        return false;
      }
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      })
    }
  )
);
