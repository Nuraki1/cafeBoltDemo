import { useState, useEffect } from 'react';
import { useCashier } from '../context/CashierContext';
import MenuGrid from '../components/Cashier/MenuGrid';
import Cart from '../components/Cashier/Cart';
import PaymentModal from '../components/Cashier/PaymentModal';
import AssignChefModal from '../components/Cashier/AssignChefModal';

export default function Cashier() {
  const {
    menuItems,
    cart,
    chefs,
    loading,
    getCartTotal,
    addToCart,
    removeFromCart,
    updateCartItem,
    createOrder,
    processPayment,
    assignOrderToChef,
    loadMenuItems,
    loadChefs,
  } = useCashier();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>();

  useEffect(() => {
    loadMenuItems();
    loadChefs();
  }, []);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    const order = await createOrder(customerName);
    if (order) {
      setCurrentOrderId(order.id);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = async (method: string, amount: number) => {
    if (currentOrderId) {
      await processPayment(currentOrderId, amount, method);
      setShowPaymentModal(false);
      setShowAssignModal(true);
    }
  };

  const handleChefAssignment = async (chefId: string) => {
    if (currentOrderId) {
      await assignOrderToChef(currentOrderId, chefId);
      setShowAssignModal(false);
      setCustomerName('');
      setCurrentOrderId(null);
      alert('Order assigned to chef successfully!');
    }
  };

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
      <div className="lg:col-span-3 overflow-y-auto">
        <MenuGrid
          items={menuItems}
          onAddToCart={addToCart}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <Cart
            items={cart}
            onUpdateQuantity={updateCartItem}
            onRemove={removeFromCart}
            total={getCartTotal()}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          amount={getCartTotal()}
          onPaymentComplete={handlePaymentComplete}
          onClose={() => {
            setShowPaymentModal(false);
            setCurrentOrderId(null);
          }}
          isLoading={loading}
        />
      )}

      {showAssignModal && (
        <AssignChefModal
          chefs={chefs}
          onAssign={handleChefAssignment}
          onClose={() => {
            setShowAssignModal(false);
            setCurrentOrderId(null);
          }}
          isLoading={loading}
        />
      )}
    </div>
  );
}
