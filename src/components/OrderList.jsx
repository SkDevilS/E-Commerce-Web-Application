import { useState, useEffect } from 'react';
import { useOrderStore } from '../stores/orderStore';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/priceFormatter';
import api from '../utils/api';

export default function OrderList() {
  const { orders, loading, fetchOrders, cancelOrder } = useOrderStore();
  const { showSuccess, showError } = useToast();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const result = await cancelOrder(orderId);
    if (result.success) {
      showSuccess('Order cancelled successfully');
    } else {
      showError(result.error || 'Failed to cancel order');
    }
  };

  const downloadReceipt = async (orderId, receiptNumber) => {
    try {
      const response = await api.get(`/orders/${orderId}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${receiptNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Receipt downloaded successfully');
    } catch (error) {
      showError('Failed to download receipt');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && orders.length === 0) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Order #{order.order_number}</h3>
                    {order.receipt_number && (
                      <p className="text-sm text-gray-500 mb-1">Receipt: {order.receipt_number}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {order.payment_method && (
                      <p className="text-sm text-gray-600">
                        Payment: {order.payment_method.toUpperCase()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold mt-2">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {order.items?.length || 0} item(s)
                  </p>
                  
                  {expandedOrder === order.id && order.items && (
                    <div className="space-y-3 mt-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product?.title || 'Product'}</h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                              {item.color && ` • Color: ${item.color}`}
                            </p>
                          </div>
                          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                {order.address && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-700">{order.address.full_name}</p>
                    <p className="text-sm text-gray-700">{order.address.address_line1}</p>
                    {order.address.address_line2 && (
                      <p className="text-sm text-gray-700">{order.address.address_line2}</p>
                    )}
                    <p className="text-sm text-gray-700">
                      {order.address.city}, {order.address.state} {order.address.pincode}
                    </p>
                    <p className="text-sm text-gray-700">Phone: {order.address.phone}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                    
                    {order.receipt_number && (
                      <button
                        onClick={() => downloadReceipt(order.id, order.receipt_number)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Receipt</span>
                      </button>
                    )}
                  </div>
                  
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
