import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/priceFormatter';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { showSuccess } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addItem(product, 1);
      showSuccess('Product added to cart');
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product);
    showSuccess('Successful Add in Wishlist');
  };

  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    const removeItem = useWishlistStore.getState().removeItem;
    removeItem(product.id);
  };

  return (
    <Link to={`/product/${product.slug}`} className="card block">
      <div className="relative">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=500'}
          alt={product.title}
          className="w-full h-48 md:h-56 lg:h-64 object-cover bg-gray-200"
          loading="lazy"
          onError={(e) => {
            if (e.target.src !== 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=500') {
              e.target.src = 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=500';
            }
          }}
        />
        {product.is_on_sale && (
          <span className="absolute top-1 left-1 md:top-2 md:left-2 bg-accent-500 text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold shadow-md">
            SALE
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
        <button
          onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
          className="absolute top-1 right-1 md:top-2 md:right-2 bg-white rounded-full p-1.5 md:p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-4 h-4 md:w-5 md:h-5 ${isInWishlist ? 'fill-primary-600' : 'fill-none'}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-2 md:p-3 lg:p-4">
        <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2 text-sm md:text-base">{product.title}</h3>
        <div className="flex items-center space-x-1 md:space-x-2 mb-2 md:mb-3">
          <span className="text-base md:text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.is_on_sale && product.original_price && (
            <span className="text-xs md:text-sm text-gray-500 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

