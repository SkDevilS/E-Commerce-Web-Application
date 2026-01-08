import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getProductsByCategory } from '../utils/productData';
import ProductGrid from '../components/ProductGrid';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedCategories from '../components/FeaturedCategories';
import TrustBadges from '../components/TrustBadges';
import StatsSection from '../components/StatsSection';
import SpecialOffers from '../components/SpecialOffers';
import Testimonials from '../components/Testimonials';
import NewsletterSignup from '../components/NewsletterSignup';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [fmcgProducts, setFmcgProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [personalCareRes, householdRes, miscRes] = await Promise.all([
          api.get('/products?category=personal-care'),
          api.get('/products?category=household-cleaning'),
          api.get('/products?category=miscellaneous'),
        ]);

        // Ensure data is an array before slicing, with fallback
        let personalCareData = Array.isArray(personalCareRes?.data) ? personalCareRes.data : [];
        let householdData = Array.isArray(householdRes?.data) ? householdRes.data : [];
        let miscData = Array.isArray(miscRes?.data) ? miscRes.data : [];

        // Fallback to direct data access if empty
        if (personalCareData.length === 0) personalCareData = getProductsByCategory('personal-care');
        if (householdData.length === 0) householdData = getProductsByCategory('household-cleaning');
        if (miscData.length === 0) miscData = getProductsByCategory('miscellaneous');

        setNewArrivals(personalCareData.slice(0, 8));
        setBestSellers(householdData.slice(0, 8));
        setFmcgProducts(miscData.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products, using fallback:', error);
        // Use direct data access as fallback
        setNewArrivals(getProductsByCategory('personal-care').slice(0, 8));
        setBestSellers(getProductsByCategory('household-cleaning').slice(0, 8));
        setFmcgProducts(getProductsByCategory('miscellaneous').slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* FMCG Banner Carousel */}
      <section className="container mx-auto px-4 mt-8">
        <BannerCarousel />
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Special Offers */}
      <SpecialOffers />

      {/* Personal Care & Hygiene */}
      <section className="container mx-auto px-4 mb-8 md:mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">Personal Care & Hygiene</h2>
            <p className="text-gray-600 text-sm md:text-base">Premium quality products for your daily needs</p>
          </div>
          <Link
            to="/category/personal-care"
            className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} />
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/category/personal-care"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <span>View All Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Household Cleaning Products */}
      <section className="container mx-auto px-4 mb-8 md:mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">Household Cleaning</h2>
            <p className="text-gray-600 text-sm md:text-base">Keep your home spotless and fresh</p>
          </div>
          <Link
            to="/category/household-cleaning"
            className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <ProductGrid products={bestSellers} loading={loading} />
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/category/household-cleaning"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <span>View All Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Miscellaneous Products Section */}
      <section className="container mx-auto px-4 mb-8 md:mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">Miscellaneous</h2>
            <p className="text-gray-600 text-sm md:text-base">Everything else you need</p>
          </div>
          <Link
            to="/category/miscellaneous"
            className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <ProductGrid products={fmcgProducts} loading={loading} />
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/category/miscellaneous"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <span>View All Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
};

export default Home;

