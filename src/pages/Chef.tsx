import { useState, useEffect } from 'react';
import { useChef } from '../context/ChefContext';
import { supabase } from '../lib/supabase';
import { Chef } from '../types/cashier';
import { Clock, CheckCircle, AlertCircle, Utensils } from 'lucide-react';

export default function ChefPage() {
  const { orders, loading, chefId, setChefId, updateItemStatus, markOrderReady } = useChef();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [showChefSelection, setShowChefSelection] = useState(!chefId);

  useEffect(() => {
    loadChefs();
  }, []);

  const loadChefs = async () => {
    try {
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .order('name');

      if (error) throw error;
      setChefs(data || []);
    } catch (err) {
      console.error('Failed to load chefs:', err);
    }
  };

  const handleSelectChef = (id: string) => {
    setChefId(id);
    setShowChefSelection(false);
  };

  if (showChefSelection) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full mb-4">
              <Utensils size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Chef Station</h1>
            <p className="text-gray-600 mt-2">Select your chef profile to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chefs.map(chef => (
              <button
                key={chef.id}
                onClick={() => handleSelectChef(chef.id)}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                  {chef.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{chef.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {chef.current_orders_count} active orders
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowChefSelection(false)}
            className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Modes
          </button>
        </div>
      </div>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status === 'assigned' || o.status === 'in_preparation');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-120px)] overflow-hidden">
      <div className="lg:col-span-2 flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Kitchen Orders</h2>
          <p className="text-sm text-gray-600">{activeOrders.length} orders to prepare</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md border-l-4 border-yellow-400 p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Order #{order.order_number.split('-')[1]}</h3>
                    <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'in_preparation'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'in_preparation' ? 'Cooking' : 'Assigned'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {item.quantity}x Item #{item.menu_item_id.slice(0, 8)}
                          </p>
                          {item.special_notes && (
                            <p className="text-sm text-gray-600 italic">Notes: {item.special_notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => updateItemStatus(item.id, 'pending')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            item.status === 'pending'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <AlertCircle size={14} className="inline mr-1" />
                          Pending
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'cooking')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            item.status === 'cooking'
                              ? 'bg-orange-200 text-orange-800'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <Clock size={14} className="inline mr-1" />
                          Cooking
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'ready')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            item.status === 'ready'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <CheckCircle size={14} className="inline mr-1" />
                          Ready
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Status: {item.status}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => markOrderReady(order.id)}
                  disabled={order.items.some(i => i.status !== 'ready')}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-2 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark Entire Order as Ready
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-center">
              <p className="text-gray-500">No orders to prepare</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Ready for Pickup</h2>
          <p className="text-sm text-gray-600">{readyOrders.length} orders ready</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {readyOrders.length > 0 ? (
            readyOrders.map(order => (
              <div
                key={order.id}
                className="bg-green-50 rounded-lg shadow-md border-l-4 border-green-500 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <h3 className="font-bold text-gray-800">Order #{order.order_number.split('-')[1]}</h3>
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  {order.customer_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.items.length} items
                </p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-center">
              <p className="text-gray-500">No ready orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
