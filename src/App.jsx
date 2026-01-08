import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastManager from './components/ToastManager';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import StaticPage from './pages/StaticPage';

// Admin imports
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SectionManagement from './pages/admin/SectionManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import { isAdminDomain } from './config/admin.config';
import { useAdminAuthStore } from './stores/adminAuthStore';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import { useWishlistStore } from './stores/wishlistStore';

// Clear old localStorage data
import './utils/clearOldData';

function App() {
  const checkAuth = useAdminAuthStore((state) => state.checkAuth);
  const isAdmin = isAdminDomain();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const clearLocalCart = useCartStore((state) => state.clearLocalCart);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    if (isAdmin) {
      checkAuth();
    }
  }, [isAdmin, checkAuth]);

  // Fetch cart and wishlist when user is logged in, clear when logged out
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      fetchCart();
      fetchWishlist();
    } else if (!isLoggedIn && !isAdmin) {
      // Clear cart and wishlist when user logs out
      clearLocalCart();
      clearWishlist();
    }
  }, [isLoggedIn, isAdmin, fetchCart, fetchWishlist, clearLocalCart, clearWishlist]);

  return (
    <Router>
      <ScrollToTop />
      {isAdmin ? (
        // Admin Routes
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="sections" element={<SectionManagement />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      ) : (
        // Customer Routes
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/about" element={<StaticPage />} />
              <Route path="/contact" element={<StaticPage />} />
              <Route path="/shipping" element={<StaticPage />} />
              <Route path="/refund-policy" element={<StaticPage />} />
              <Route path="/terms" element={<StaticPage />} />
              <Route path="/privacy" element={<StaticPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastManager />
        </div>
      )}
    </Router>
  );
}

export default App;
