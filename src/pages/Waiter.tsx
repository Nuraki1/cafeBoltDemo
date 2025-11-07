import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock, Utensils, TrendingUp } from 'lucide-react';
import * as waiterApi from '../services/waiterApi';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: any[];
}

export default function Waiter() {
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ready' | 'all'>('ready');

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ready = await waiterApi.getReadyOrders();
      const all = await waiterApi.getAllOrders();
      setReadyOrders(ready);
      setAllOrders(all);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await waiterApi.markOrderDelivered(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Failed to mark order delivered:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'in_preparation':
        return 'bg-orange-100 text-orange-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={16} />;
      case 'in_preparation':
        return <Utensils size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Waiter Station</h1>
          <p className="text-gray-600">Manage order deliveries</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-100 text-green-800 rounded-lg px-4 py-2 font-semibold flex items-center gap-2">
            <CheckCircle size={20} />
            {readyOrders.length} Ready
          </div>
          <div className="bg-orange-100 text-orange-800 rounded-lg px-4 py-2 font-semibold flex items-center gap-2">
            <Utensils size={20} />
            {allOrders.filter(o => o.status === 'in_preparation').length} Cooking
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ready')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'ready'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <CheckCircle size={18} className="inline mr-2" />
          Ready to Serve ({readyOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'all'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <TrendingUp size={18} className="inline mr-2" />
          All Orders ({allOrders.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'ready' ? (
          <div className="space-y-4">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md border-l-4 border-green-500 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        #{order.order_number.split('-')[1]}
                      </h3>
                      <p className="text-lg text-gray-700 font-semibold">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                        <CheckCircle size={16} />
                        Ready
                      </span>
                      <p className="text-xs text-gray-600 mt-2">{formatTime(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{order.order_items.length}</span> items
                    </p>
                  </div>

                  <button
                    onClick={() => handleMarkDelivered(order.id)}
                    className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold text-lg"
                  >
                    Delivered
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 text-center">
                <p className="text-gray-500 text-lg">No orders ready for delivery</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {allOrders.length > 0 ? (
              allOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        #{order.order_number.split('-')[1]} - {order.customer_name}
                      </h4>
                      <p className="text-xs text-gray-600">{formatTime(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.payment_status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 text-center">
                <p className="text-gray-500 text-lg">No orders</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
