import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import { useSectionsStore } from '../stores/sectionsStore';
import MiniCart from './MiniCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState([]);
  const [hiddenSections, setHiddenSections] = useState([]);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { isLoggedIn, logout } = useAuthStore();
  const clearCart = useCartStore((state) => state.clearLocalCart);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  
  // Sections store
  const { sections, fetchSections, getNavigationSections } = useSectionsStore();
  const navigationSections = getNavigationSections();

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Calculate visible and hidden sections based on available space
  useEffect(() => {
    const calculateVisibleSections = () => {
      // Max number of sections to show before "More" dropdown (not including Home)
      // Adjust this number based on your design needs
      const maxVisibleSections = 6; // Show up to 6 sections directly
      
      if (navigationSections.length <= maxVisibleSections) {
        setVisibleSections(navigationSections);
        setHiddenSections([]);
      } else {
        setVisibleSections(navigationSections.slice(0, maxVisibleSections));
        setHiddenSections(navigationSections.slice(maxVisibleSections));
      }
    };

    calculateVisibleSections();
  }, [navigationSections]);

  const handleLogout = async () => {
    // Clear cart and wishlist
    clearCart();
    clearWishlist();
    
    // Logout user
    await logout();
    
    // Navigate to account page
    navigate('/account');
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src="/truaxis1.png" alt="Truaxis" className="relative h-10 w-auto transform group-hover:scale-105 transition-transform" />
              </div>
            </Link>

            <nav ref={navRef} className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors text-sm relative group px-2 py-1 whitespace-nowrap">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {visibleSections.map((section) => (
                <Link 
                  key={section.id}
                  to={`/category/${section.slug}`} 
                  className="text-gray-700 hover:text-primary-600 transition-colors text-sm relative group px-2 py-1 whitespace-nowrap"
                >
                  {section.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
              {hiddenSections.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    className="text-gray-700 hover:text-primary-600 transition-colors text-sm relative group px-2 py-1 flex items-center whitespace-nowrap"
                  >
                    More
                    <svg className={`w-4 h-4 ml-1 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  {isMoreDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsMoreDropdownOpen(false)}
                      ></div>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        {hiddenSections.map((section) => (
                          <Link
                            key={section.id}
                            to={`/category/${section.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            onClick={() => setIsMoreDropdownOpen(false)}
                          >
                            {section.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/account" className="text-gray-700 hover:text-primary-600 transition-all transform hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              <Link to="/account?tab=wishlist" className="text-gray-700 hover:text-primary-600 transition-all transform hover:scale-110 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsCartOpen(true)} className="text-gray-700 hover:text-primary-600 transition-all transform hover:scale-110 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {isLoggedIn && (
                <button onClick={handleLogout} className="hidden md:block text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium">
                  Logout
                </button>
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1 hover:bg-primary-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                {sections.map((section) => (
                  <Link 
                    key={section.id}
                    to={`/category/${section.slug}`} 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1 hover:bg-primary-50 rounded-lg" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {section.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
