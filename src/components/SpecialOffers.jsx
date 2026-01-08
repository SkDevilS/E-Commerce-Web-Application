import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SpecialOffers = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: 1,
      title: 'Flash Sale',
      subtitle: 'Up to 50% OFF',
      description: 'Limited time offer on selected beauty and personal care items',
      link: '/category/personal-care',
      gradient: 'from-slate-600 via-gray-700 to-zinc-800',
      bgGradient: 'from-blue-100 via-blue-200 to-blue-300',
      showTimer: true,
      badge: 'HOT DEAL',
      icon: ''
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh Collection',
      description: 'Discover our latest premium products and trending items',
      link: '/category/home-appliances',
      gradient: 'from-slate-600 via-gray-700 to-zinc-800',
      bgGradient: 'from-blue-100 via-blue-200 to-blue-300',
      showTimer: false,
      badge: 'NEW',
      icon: ''
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8 mb-12">
      <div className="text-center mb-8">
        <div className="inline-block mb-3">
          <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            Special Offers
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent mb-3">Don't Miss Out</h2>
        <p className="text-gray-600 max-w-xl mx-auto">Exclusive deals and limited-time offers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {offers.map((offer) => (
          <Link
            key={offer.id}
            to={offer.link}
            className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative p-6 h-full flex flex-col">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-6">
                {/* Badge */}
                <div className="flex items-center space-x-2">
                  <span className={`bg-gradient-to-r ${offer.gradient} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
                    {offer.badge}
                  </span>
                </div>

                {/* Timer */}
                {offer.showTimer && (
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <div className="text-gray-700 text-xs font-semibold mb-1 text-center">Ends in</div>
                    <div className="flex items-center space-x-1">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-600">HRS</div>
                      </div>
                      <span className="text-gray-600 font-bold">:</span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-600">MIN</div>
                      </div>
                      <span className="text-gray-600 font-bold">:</span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-600">SEC</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content - Flex grow to fill space */}
              <div className="space-y-4 flex-grow flex flex-col justify-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-1">{offer.title}</h3>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                    {offer.subtitle}
                  </h2>
                  <p className="text-gray-600 leading-relaxed max-w-md">
                    {offer.description}
                  </p>
                </div>
              </div>

              {/* CTA Button - Always at bottom */}
              <div className="flex items-center space-x-3 mt-4">
                <button className={`bg-gradient-to-r ${offer.gradient} text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2`}>
                  <span>Shop Now</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                {/* Floating Action Indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;

