import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BannerCarousel = () => {
  // Featured product banners with actual products
  const promotionalBanners = [
    {
      id: 1,
      title: 'L\'Oréal Paris',
      subtitle: 'Hair Care Collection',
      description: 'Professional salon quality at home. Total Repair 5 for damaged hair.',
      image: '/lorealrepairshampoo.jpg',
      link: '/product/loreal-paris-total-repair-5-shampoo-340ml',
      buttonText: 'Shop Collection',
      badge: 'BESTSELLER',
      badgeColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 via-pink-50 to-white',
      textColor: 'text-gray-900',
    },
    {
      id: 2,
      title: 'Dove Body Care',
      subtitle: 'Nourishing Body Wash',
      description: 'Deep moisture technology for soft, smooth skin. Trusted by millions.',
      image: '/dove.jpeg',
      link: '/product/dove-nourishing-body-wash-500ml',
      buttonText: 'Discover Now',
      badge: 'TOP RATED',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-white',
      textColor: 'text-gray-900',
    },
    {
      id: 3,
      title: 'Mamaearth Onion',
      subtitle: 'Hair Growth Oil',
      description: 'Natural ingredients for stronger, healthier hair. Toxin-free formula.',
      image: '/mamaearth.jpeg',
      link: '/product/mamaearth-onion-hair-oil-250ml',
      buttonText: 'Try Natural',
      badge: 'NATURAL',
      badgeColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 via-emerald-50 to-white',
      textColor: 'text-gray-900',
    },
    {
      id: 4,
      title: 'Lakmé Beauty',
      subtitle: 'Makeup Essentials',
      description: 'Complete your look with premium cosmetics. Long-lasting formulas.',
      image: '/lakmelipstick.jpg',
      link: '/product/lakme-absolute-matte-lipstick',
      buttonText: 'Explore Beauty',
      badge: 'TRENDING',
      badgeColor: 'bg-gradient-to-r from-rose-600 to-red-600',
      bgColor: 'bg-gradient-to-br from-rose-50 via-red-50 to-white',
      textColor: 'text-gray-900',
    },
    {
      id: 5,
      title: 'SUGAR Cosmetics',
      subtitle: 'Makeup Kits',
      description: 'All-in-one beauty solutions. Professional quality, affordable prices.',
      image: '/sugarmakeupkit.jpg',
      link: '/product/sugar-ultimate-makeup-trio-kit',
      buttonText: 'Shop Kits',
      badge: 'NEW ARRIVAL',
      badgeColor: 'bg-gradient-to-r from-orange-600 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 via-amber-50 to-white',
      textColor: 'text-gray-900',
    },
  ];

  const banners = promotionalBanners;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-2xl shadow-2xl mb-8 md:mb-12">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className={`w-full h-full ${banner.bgColor} relative overflow-hidden`}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left Content */}
                  <div className="text-left space-y-4 md:space-y-6">
                    {banner.badge && (
                      <div className="inline-block">
                        <span className={`${banner.badgeColor} text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg`}>
                          {banner.badge}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className={`text-sm md:text-base lg:text-lg font-semibold ${banner.textColor} opacity-80 mb-2`}>
                        {banner.subtitle}
                      </p>
                      <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${banner.textColor} mb-4 leading-tight`}>
                        {banner.title}
                      </h2>
                      <p className={`text-sm md:text-base lg:text-lg ${banner.textColor} opacity-75 max-w-lg leading-relaxed`}>
                        {banner.description}
                      </p>
                    </div>
                    <Link
                      to={banner.link}
                      className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span>{banner.buttonText}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Right Product Image */}
                  <div className="hidden md:flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/40 rounded-3xl blur-2xl transform rotate-6"></div>
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="relative w-full max-w-md h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=500';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full p-3 transition-all hover:scale-110 shadow-xl"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full p-3 transition-all hover:scale-110 shadow-xl"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-gray-900 w-10'
                : 'bg-gray-400 w-2 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;

