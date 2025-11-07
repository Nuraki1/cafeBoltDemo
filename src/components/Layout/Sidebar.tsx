import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3, Menu, X, Coffee } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onSwitchMode?: () => void;
}

export default function Sidebar({ currentPage, onPageChange, onSwitchMode }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-red-600 to-red-700 text-white w-64 flex flex-col shadow-xl transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-red-500">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard size={28} />
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-yellow-400 text-red-900 shadow-lg font-semibold'
                    : 'hover:bg-red-500 hover:translate-x-1'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-3 border-t border-red-500">
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-red-900 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold text-sm"
            >
              <Coffee size={18} />
              Switch to Cashier
            </button>
          )}
          <div className="text-sm text-red-100">
            <p className="font-semibold">Admin User</p>
            <p className="text-xs opacity-75">admin@example.com</p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
