import { useState } from 'react';
import { X, CreditCard, DollarSign, Banknote } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  onPaymentComplete: (method: string, amount: number) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function PaymentModal({
  amount,
  onPaymentComplete,
  onClose,
  isLoading,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [enteredAmount, setEnteredAmount] = useState(amount.toString());
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const change = Math.max(0, parseFloat(enteredAmount) - amount);
  const isValidAmount = parseFloat(enteredAmount) >= amount;

  const handlePayment = () => {
    if (paymentMethod === 'cash') {
      if (!isValidAmount) {
        alert('Amount must be at least ' + amount.toFixed(2));
        return;
      }
      onPaymentComplete('cash', parseFloat(enteredAmount));
    } else if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        alert('Please fill in all card details');
        return;
      }
      onPaymentComplete('card', amount);
    } else {
      onPaymentComplete('online', amount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Payment</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-600 mb-1">Total Amount Due</p>
            <p className="text-3xl font-bold text-red-600">${amount.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                className="w-4 h-4"
              />
              <Banknote size={20} className="text-green-600" />
              <span className="font-semibold text-gray-800">Cash</span>
            </label>

            {paymentMethod === 'cash' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-3">
                <input
                  type="number"
                  value={enteredAmount}
                  onChange={(e) => setEnteredAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {change > 0 && (
                  <div className="bg-white p-3 rounded-lg border border-green-300">
                    <p className="text-sm text-gray-600">Change Due</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${change.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="w-4 h-4"
              />
              <CreditCard size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-800">Credit/Debit Card</span>
            </label>

            {paymentMethod === 'card' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.slice(0, 16))}
                  placeholder="Card Number (16 digits)"
                  maxLength={16}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                    placeholder="MM/YY"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.slice(0, 3))}
                    placeholder="CVV"
                    maxLength={3}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                className="w-4 h-4"
              />
              <DollarSign size={20} className="text-purple-600" />
              <span className="font-semibold text-gray-800">Online Payment</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
