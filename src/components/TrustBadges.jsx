const TrustBadges = () => {
  const badges = [
    {
      id: 1,
      title: 'Premium Quality',
      description: 'We source only the best quality products from trusted manufacturers and brands.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your products delivered to your doorstep fast.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Easy Returns',
      description: 'Hassle-free return policy. If you\'re not satisfied, return within 7 days for a full refund.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: 'bg-orange-500',
    },
    {
      id: 4,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected with industry-standard security measures.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'bg-red-500',
    },
    {
      id: 5,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you with any queries.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-teal-500',
    },
  ];

  return (
    <section className="py-8 mb-12 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Why Choose Truaxis?</h2>
          <p className="text-gray-600 text-sm">We're committed to providing you with the best shopping experience</p>
        </div>
        
        {/* Fixed grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-100 group"
            >
              <div className={`${badge.color} rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform text-white`}>
                {badge.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;