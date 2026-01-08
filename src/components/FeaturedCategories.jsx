import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSectionsStore } from '../stores/sectionsStore';

const FeaturedCategories = () => {
  const { sections, fetchSections, getAllSections } = useSectionsStore();
  const allSections = getAllSections();

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Icon mapping for different section types
  const getIconForSection = (slug) => {
    const iconMap = {
      'personal-care': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      'household-cleaning': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      'home-appliances': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      'miscellaneous': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    };
    
    // Default icon for unknown sections
    return iconMap[slug] || (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    );
  };

  // Color mapping for different sections
  const getColorsForSection = (slug, index) => {
    const colorMap = {
      'personal-care': {
        gradient: 'from-pink-400 to-rose-500',
        bgGradient: 'from-pink-50 to-rose-100'
      },
      'household-cleaning': {
        gradient: 'from-blue-400 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-100'
      },
      'home-appliances': {
        gradient: 'from-purple-400 to-indigo-500',
        bgGradient: 'from-purple-50 to-indigo-100'
      },
      'miscellaneous': {
        gradient: 'from-emerald-400 to-teal-500',
        bgGradient: 'from-emerald-50 to-teal-100'
      }
    };

    // Fallback colors for new sections
    const fallbackColors = [
      { gradient: 'from-orange-400 to-red-500', bgGradient: 'from-orange-50 to-red-100' },
      { gradient: 'from-green-400 to-emerald-500', bgGradient: 'from-green-50 to-emerald-100' },
      { gradient: 'from-yellow-400 to-orange-500', bgGradient: 'from-yellow-50 to-orange-100' },
      { gradient: 'from-indigo-400 to-purple-500', bgGradient: 'from-indigo-50 to-purple-100' }
    ];

    return colorMap[slug] || fallbackColors[index % fallbackColors.length];
  };

  return (
    <section className="container mx-auto px-4 py-8 mb-12">
      <div className="text-center mb-8">
        <div className="inline-block mb-3">
          <span className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            Shop by Category
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent mb-3">Explore Our Collections</h2>
        <p className="text-gray-600 max-w-xl mx-auto">Discover premium products across all categories</p>
      </div>
      
      <div className={`grid grid-cols-1 ${allSections.length === 2 ? 'md:grid-cols-2' : allSections.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-4 max-w-4xl mx-auto`}>
        {allSections.map((section, index) => {
          const colors = getColorsForSection(section.slug, index);
          return (
            <Link
              key={section.id}
              to={`/category/${section.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              
              <div className="relative p-6 text-center h-full flex flex-col justify-between">
                {/* Icon Container */}
                <div className="mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    {getIconForSection(section.slug)}
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-2 flex-grow flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                    {section.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {section.description || 'Discover amazing products'}
                  </p>
                  <div className="text-xs font-semibold text-gray-500 bg-white/50 rounded-full px-2 py-1 inline-block">
                    {section.product_count || 0}+ Products
                  </div>
                </div>
                
                {/* Hover Arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedCategories;

