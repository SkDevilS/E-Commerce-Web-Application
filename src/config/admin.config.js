// Admin configuration
const isDevelopment = import.meta.env.DEV;
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Check if current domain is admin domain
export const isAdminDomain = () => {
  return hostname === 'admin.localhost' || 
         hostname === 'admin.truaxisventures.com' ||
         hostname.startsWith('admin.');
};

// API Base URL
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'
  : 'https://api.truaxisventures.com/api';

// Admin domains
export const ADMIN_DOMAINS = {
  development: 'admin.localhost',
  production: 'admin.truaxisventures.com'
};

// Customer domains
export const CUSTOMER_DOMAINS = {
  development: 'localhost',
  production: 'truaxisventures.com'
};

// Get current domain type
export const getDomainType = () => {
  if (isAdminDomain()) return 'admin';
  return 'customer';
};

// Redirect to appropriate domain
export const redirectToCustomerSite = () => {
  const domain = isDevelopment ? CUSTOMER_DOMAINS.development : CUSTOMER_DOMAINS.production;
  const port = isDevelopment ? ':5173' : '';
  window.location.href = `http://${domain}${port}`;
};

export const redirectToAdminSite = () => {
  const domain = isDevelopment ? ADMIN_DOMAINS.development : ADMIN_DOMAINS.production;
  const port = isDevelopment ? ':5173' : '';
  window.location.href = `http://${domain}${port}`;
};
