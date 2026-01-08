import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/priceFormatter';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import AddressManager from '../components/AddressManager';
import OrderList from '../components/OrderList';

const AccountPage = () => {
  const [searchParams] = useSearchParams();
  const { isLoggedIn, login, register, user } = useAuthStore();
  const defaultTab = isLoggedIn ? 'profile' : 'login';
  const tab = searchParams.get('tab') || defaultTab;
  const [isLogin, setIsLogin] = useState(tab === 'login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { showSuccess, showError } = useToast();
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
  });

  // Initialize profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const { updateProfile } = useAuthStore.getState();
    const result = await updateProfile(
      profileForm.name,
      profileForm.email,
      profileForm.phone,
      profileForm.date_of_birth,
      profileForm.gender
    );
    
    if (result.success) {
      showSuccess('Profile updated successfully!');
      setIsEditingProfile(false);
    } else {
      showError(result.error || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      date_of_birth: user?.date_of_birth || '',
      gender: user?.gender || '',
    });
    setIsEditingProfile(false);
  };

  // Removed address management state - now handled by AddressManager component

  useEffect(() => {
    if (tab === 'wishlist' || tab === 'orders' || tab === 'profile' || tab === 'addresses') {
      setIsLogin(false);
    } else if (tab === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
    // Reset edit mode when switching tabs
    if (tab !== 'profile') {
      setIsEditingProfile(false);
    }
    // Refresh user data when viewing profile
    if (tab === 'profile' && isLoggedIn) {
      const { checkAuth } = useAuthStore.getState();
      checkAuth();
    }
    // Scroll to top when tab changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [tab]);

  // Fetch wishlist when tab changes to wishlist
  useEffect(() => {
    if (isLoggedIn && tab === 'wishlist') {
      fetchWishlist();
    }
  }, [isLoggedIn, tab, fetchWishlist]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      showSuccess('Successfully logged in!');
      setLoginForm({ email: '', password: '' });
    } else {
      showError(result.error || 'Invalid credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    // Validate password length (backend requires 8 chars with uppercase, lowercase, number)
    if (registerForm.password.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }
    
    const result = await register(registerForm.name, registerForm.email, registerForm.password);
    
    if (result.success) {
      showSuccess('Successfully registered and logged in!');
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      showError(result.error || 'Registration failed. Please try again.');
    }
  };

  // Removed mockOrders - now handled by OrderList component

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'My Account' }]} />
        <div className="max-w-md mx-auto">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium ${
                isLogin
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium ${
                !isLogin
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-md p-8 space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-600">Login to your account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Login
              </button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="bg-white rounded-lg shadow-md p-8 space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-600">Sign up to get started</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                  placeholder="At least 8 characters with uppercase, lowercase, and number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Create Account
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'My Account' }]} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Welcome, {user?.name || 'User'}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <nav className="space-y-2">
              <Link
                to="/account?tab=profile"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  tab === 'profile'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Profile
              </Link>
              <Link
                to="/account?tab=addresses"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  tab === 'addresses'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Addresses
              </Link>
              <Link
                to="/account?tab=wishlist"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  tab === 'wishlist'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Wishlist
              </Link>
              <Link
                to="/account?tab=orders"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  tab === 'orders'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Orders
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {tab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Profile</h1>
                {!isEditingProfile ? (
                  <button 
                    onClick={handleEditProfile}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-md hover:shadow-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary-600">
                        {profileForm.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-1">{profileForm.name}</h2>
                      <p className="text-gray-600">{profileForm.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {profileForm.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {profileForm.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {profileForm.phone || 'Not provided'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.date_of_birth}
                          onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="e.g., January 15, 1990"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {profileForm.date_of_birth || 'Not provided'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          {profileForm.gender || 'Not provided'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Account Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email Notifications</span>
                        <span className="text-sm text-gray-500">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">SMS Notifications</span>
                        <span className="text-sm text-gray-500">Disabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Newsletter Subscription</span>
                        <span className="text-sm text-gray-500">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'addresses' && <AddressManager />}

          {tab === 'wishlist' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
                  <Link to="/" className="btn-primary inline-block">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlistItems.map((item) => (
                    <ProductCard key={item.id} product={item.product || item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && <OrderList />}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;

