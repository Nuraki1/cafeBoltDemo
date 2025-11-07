import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { CartItem } from '../../types/cashier';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
  total: number;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemove, total, onCheckout }: CartProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-4 sticky top-0 z-10">
        <h3 className="text-xl font-bold">Order Summary</h3>
        <p className="text-sm opacity-90">{items.length} items</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length > 0 ? (
          items.map(item => (
            <div
              key={item.menu_item_id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-yellow-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  {item.special_notes && (
                    <p className="text-xs text-gray-600 italic mt-1">Note: {item.special_notes}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemove(item.menu_item_id)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.menu_item_id, item.quantity - 1)
                    }
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronDown size={16} className="text-gray-600" />
                  </button>
                  <span className="font-bold text-gray-800 min-w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.menu_item_id, item.quantity + 1)
                    }
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronUp size={16} className="text-gray-600" />
                  </button>
                </div>
                <span className="font-bold text-red-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-center">
            <p className="text-gray-500">Cart is empty</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50 sticky bottom-0">
        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
          <span>Total:</span>
          <span className="text-2xl text-red-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
