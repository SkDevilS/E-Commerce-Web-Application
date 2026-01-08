import axios from 'axios';
import { getProductsByCategory, getProductBySlug, getProductById } from './productData';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for fallback to local data
api.interceptors.response.use(
  (response) => {
    const url = response.config?.url || '';
    
    // Check if response is HTML (MSW not working) or empty/null
    if (import.meta.env.DEV && url.includes('/products')) {
      const isHtml = response.data && typeof response.data === 'string' && response.data.includes('<!DOCTYPE');
      const isEmpty = !response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0);
      
      if (isHtml || isEmpty) {
        const searchParams = new URLSearchParams(url.split('?')[1] || '');
        const category = searchParams.get('category');
        const slug = url.match(/\/products\/slug\/(.+)/)?.[1];
        const id = url.match(/\/products\/([^\/]+)$/)?.[1];
        
        if (slug) {
          const product = getProductBySlug(slug);
          if (product) {
            return { ...response, data: product, status: 200 };
          }
        } else if (id && !id.includes('slug')) {
          const product = getProductById(id);
          if (product) {
            return { ...response, data: product, status: 200 };
          }
        } else if (category) {
          const filteredProducts = getProductsByCategory(category);
          return { ...response, data: filteredProducts, status: 200 };
        } else {
          const allProducts = getProductsByCategory(null);
          return { ...response, data: allProducts, status: 200 };
        }
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('customer_refresh_token');
        
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` }
            }
          );

          const { access_token } = response.data;
          localStorage.setItem('customer_token', access_token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_refresh_token');
        localStorage.removeItem('auth-storage');
        // Don't redirect, let component handle it
      }
    }
    
    // If API call fails and we're in dev mode, try to use local data as fallback
    if (import.meta.env.DEV && error.config) {
      const url = error.config.url || '';
      
      // Fallback for products endpoints
      if (url.includes('/products')) {
        const searchParams = new URLSearchParams(url.split('?')[1] || '');
        const category = searchParams.get('category');
        const slug = url.match(/\/products\/slug\/(.+)/)?.[1];
        const id = url.match(/\/products\/([^\/]+)$/)?.[1];
        
        if (slug) {
          const product = getProductBySlug(slug);
          if (product) {
            return Promise.resolve({ data: product, status: 200, config: error.config });
          }
        } else if (id && !id.includes('slug')) {
          const product = getProductById(id);
          if (product) {
            return Promise.resolve({ data: product, status: 200, config: error.config });
          }
        } else if (category) {
          const filteredProducts = getProductsByCategory(category);
          return Promise.resolve({ data: filteredProducts, status: 200, config: error.config });
        } else {
          const allProducts = getProductsByCategory(null);
          return Promise.resolve({ data: allProducts, status: 200, config: error.config });
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

