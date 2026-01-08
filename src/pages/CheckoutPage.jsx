import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useAddressStore } from '../stores/addressStore';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/priceFormatter';
import api from '../utils/api';
import Breadcrumbs from '../components/Breadcrumbs';
import AddressManager from '../components/AddressManager';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal());
  const { isLoggedIn } = useAuthStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const { showSuccess, showError } = useToast();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({
    // Card details
    card_number: '',
    card_holder_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    // UPI details
    upi_id: '',
    upi_name: ''
  });
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    }
  }, [isLoggedIn, fetchAddresses]);

  // Prevent modal from closing accidentally
  useEffect(() => {
    if (showReceiptModal) {
      console.log('Receipt modal opened with order data:', orderData);
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Prevent accidental navigation
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        console.log('Receipt modal cleanup');
        document.body.style.overflow = 'unset';
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [showReceiptModal, orderData]);

  useEffect(() => {
    // Set default address if available
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(addr => addr.is_default) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePaymentDetails = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!paymentDetails.card_number) newErrors.card_number = 'Card number is required';
      else if (paymentDetails.card_number.replace(/\s/g, '').length !== 16) newErrors.card_number = 'Card number must be 16 digits';
      
      if (!paymentDetails.card_holder_name) newErrors.card_holder_name = 'Cardholder name is required';
      if (!paymentDetails.expiry_month) newErrors.expiry_month = 'Expiry month is required';
      if (!paymentDetails.expiry_year) newErrors.expiry_year = 'Expiry year is required';
      if (!paymentDetails.cvv) newErrors.cvv = 'CVV is required';
      else if (paymentDetails.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails.upi_id) newErrors.upi_id = 'UPI ID is required';
      if (!paymentDetails.upi_name) newErrors.upi_name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentDetails(prev => ({ ...prev, card_number: formatted }));
  };

  const downloadReceipt = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${orderData?.receipt_number || 'order'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError('Failed to download receipt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showError('Please login to place an order');
      navigate('/account');
      return;
    }

    if (!selectedAddress) {
      showError('Please select a delivery address');
      return;
    }

    if (paymentMethod !== 'cod' && !validatePaymentDetails()) {
      showError('Please fill in all payment details correctly');
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        address_id: selectedAddress.id,
        payment_method: paymentMethod,
        payment_details: paymentMethod !== 'cod' ? paymentDetails : undefined
      };

      const response = await api.post('/orders', orderPayload);
      
      // Clear cart and show modal
      clearCart();
      setOrderData(response.data.order);
      setShowReceiptModal(true);
      // Don't show toast notification - the modal itself indicates success
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !showReceiptModal) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Checkout' }]} />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Checkout' }]} />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Please login to continue with checkout</p>
          <button
            onClick={() => navigate('/account')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const shipping = 0;
  const total = getTotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Checkout' }]} />

      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Address & Payment Form */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold">Delivery Address</h2>
              <button
                type="button"
                onClick={() => setShowAddressManager(true)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Manage Addresses
              </button>
            </div>
            
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No addresses found</p>
                <button
                  type="button"
                  onClick={() => setShowAddressManager(true)}
                  className="btn-primary"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress?.id === address.id}
                      onChange={() => setSelectedAddress(address)}
                      className="w-5 h-5 text-primary-600 mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{address.full_name}</div>
                      <div className="text-sm text-gray-600">
                        {address.address_line1}
                        {address.address_line2 && <>, {address.address_line2}</>}
                      </div>
                      <div className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.pincode}
                      </div>
                      <div className="text-sm text-gray-600">Phone: {address.phone}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-gray-700">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-gray-700">Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-gray-700">UPI</span>
              </label>
            </div>

            {/* Card Payment Details */}
            {paymentMethod === 'card' && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-900">Card Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="card_number"
                      value={paymentDetails.card_number}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.card_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.card_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="card_holder_name"
                      value={paymentDetails.card_holder_name}
                      onChange={handlePaymentChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.card_holder_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.card_holder_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.card_holder_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Month *
                    </label>
                    <select
                      name="expiry_month"
                      value={paymentDetails.expiry_month}
                      onChange={handlePaymentChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.expiry_month ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expiry_month && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiry_month}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Year *
                    </label>
                    <select
                      name="expiry_year"
                      value={paymentDetails.expiry_year}
                      onChange={handlePaymentChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.expiry_year ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    {errors.expiry_year && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiry_year}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength="3"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Payment Details */}
            {paymentMethod === 'upi' && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-900">UPI Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    name="upi_id"
                    value={paymentDetails.upi_id}
                    onChange={handlePaymentChange}
                    placeholder="yourname@paytm"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.upi_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.upi_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.upi_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="upi_name"
                    value={paymentDetails.upi_name}
                    onChange={handlePaymentChange}
                    placeholder="Your Name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.upi_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.upi_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.upi_name}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const product = item.product || item; // Support both old and new format
                const price = product.is_on_sale ? product.price : product.original_price || product.price;
                return (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                    <span>{product.title} x {item.quantity}</span>
                    <span>{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(getTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isProcessing || !selectedAddress}
              className="w-full bg-primary-400 text-white py-3 rounded-lg hover:bg-primary-500 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>

      {/* Address Manager Modal */}
      {showAddressManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Addresses</h2>
                <button
                  onClick={() => setShowAddressManager(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddressManager onClose={() => setShowAddressManager(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Receipt Download Modal */}
      {showReceiptModal && orderData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            // Prevent closing when clicking on backdrop
            e.stopPropagation();
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowReceiptModal(false);
                setOrderData(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Order Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Your order <span className="font-semibold">#{orderData.order_number}</span> has been placed successfully.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Receipt Number: <span className="font-medium">{orderData.receipt_number}</span>
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => downloadReceipt(orderData.id)}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setOrderData(null);
                    navigate('/account?tab=orders');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setOrderData(null);
                    navigate('/');
                  }}
                  className="w-full text-primary-600 py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

