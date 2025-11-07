import { X, CheckCircle } from 'lucide-react';
import { Chef } from '../../types/cashier';

interface AssignChefModalProps {
  chefs: Chef[];
  onAssign: (chefId: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function AssignChefModal({
  chefs,
  onAssign,
  onClose,
  isLoading,
}: AssignChefModalProps) {
  const availableChefs = chefs.filter(chef => chef.status === 'available');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Assign to Chef</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {availableChefs.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableChefs.map(chef => (
                <button
                  key={chef.id}
                  onClick={() => onAssign(chef.id)}
                  disabled={isLoading}
                  className="w-full p-4 border border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        {chef.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{chef.name}</p>
                        <p className="text-xs text-gray-600">
                          {chef.current_orders_count} active orders
                        </p>
                      </div>
                    </div>
                    {chef.status === 'available' && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No available chefs at the moment</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>All chefs are currently busy</p>
                <p>Please wait or try again later</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
