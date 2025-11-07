import { LayoutDashboard, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

interface CashierSidebarProps {
  onSwitchMode: () => void;
}

export default function CashierSidebar({ onSwitchMode }: CashierSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

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
            <ShoppingCart size={28} />
            POS System
          </h1>
          <p className="text-xs text-red-100 mt-1">Cashier Interface</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="bg-yellow-400 text-red-900 px-4 py-3 rounded-lg shadow-lg">
            <p className="font-bold text-sm">Order Registration</p>
            <p className="text-xs mt-1">Select items and process payments</p>
          </div>
        </nav>

        <div className="p-4 space-y-3 border-t border-red-500">
          <button
            onClick={onSwitchMode}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-lg transition-colors font-semibold text-sm"
          >
            <LogOut size={18} />
            Back to Admin
          </button>
          <div className="text-sm text-red-100">
            <p className="font-semibold">Cashier</p>
            <p className="text-xs opacity-75">cashier@example.com</p>
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
