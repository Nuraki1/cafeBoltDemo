import { Users, ShoppingCart, Utensils, Truck, LayoutDashboard } from 'lucide-react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'admin' | 'cashier' | 'chef' | 'waiter') => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const modes = [
    {
      id: 'admin',
      name: 'Admin Dashboard',
      description: 'Manage users, products, and view analytics',
      icon: LayoutDashboard,
      color: 'from-red-600 to-red-700',
    },
    {
      id: 'cashier',
      name: 'Cashier / POS',
      description: 'Register orders and process payments',
      icon: ShoppingCart,
      color: 'from-yellow-500 to-orange-600',
    },
    {
      id: 'chef',
      name: 'Kitchen / Chef',
      description: 'Manage cooking orders and items',
      icon: Utensils,
      color: 'from-orange-600 to-red-600',
    },
    {
      id: 'waiter',
      name: 'Waiter / Delivery',
      description: 'Deliver orders and manage service',
      icon: Truck,
      color: 'from-green-600 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Restaurant Management System</h1>
          <p className="text-xl text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id as 'admin' | 'cashier' | 'chef' | 'waiter')}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color}`} />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />

                <div className="relative p-8 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-4 group-hover:bg-opacity-30 transition-all">
                      <Icon size={32} />
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-left">{mode.name}</h3>
                    <p className="text-sm text-white text-opacity-90 text-left leading-relaxed">
                      {mode.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                    <span>Continue</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold text-red-600 mb-2">Admin Dashboard</h3>
              <p className="text-gray-600 text-sm">View analytics, manage menu items, users, and system settings</p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-600 mb-2">Cashier POS</h3>
              <p className="text-gray-600 text-sm">Take customer orders, manage cart, process payments, and assign to chefs</p>
            </div>
            <div>
              <h3 className="font-bold text-orange-600 mb-2">Kitchen Chef</h3>
              <p className="text-gray-600 text-sm">View orders, update cooking status, mark items ready for pickup</p>
            </div>
            <div>
              <h3 className="font-bold text-green-600 mb-2">Waiter Service</h3>
              <p className="text-gray-600 text-sm">Deliver ready orders to customers, track all orders in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
