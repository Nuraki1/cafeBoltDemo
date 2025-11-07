import { useState } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { CashierProvider } from './context/CashierContext';
import { ChefProvider } from './context/ChefContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import CashierSidebar from './components/Cashier/CashierSidebar';
import ModeSelector from './components/Layout/ModeSelector';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Cashier from './pages/Cashier';
import Chef from './pages/Chef';
import Waiter from './pages/Waiter';

function App() {
  const [mode, setMode] = useState<'admin' | 'cashier' | 'chef' | 'waiter' | 'select'>('select');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const adminPageConfig = {
    dashboard: { title: 'Dashboard', component: Dashboard },
    users: { title: 'Users Management', component: Users },
    products: { title: 'Products Management', component: Products },
    orders: { title: 'Orders Management', component: Orders },
    analytics: { title: 'Analytics', component: Analytics },
  };

  if (mode === 'select') {
    return <ModeSelector onSelectMode={setMode} />;
  }

  if (mode === 'cashier') {
    return (
      <CashierProvider>
        <div className="flex min-h-screen bg-gray-50">
          <CashierSidebar onSwitchMode={() => setMode('select')} />
          <div className="flex-1 flex flex-col">
            <Header title="POS - Point of Sale" />
            <main className="flex-1 overflow-hidden">
              <Cashier />
            </main>
          </div>
        </div>
      </CashierProvider>
    );
  }

  if (mode === 'chef') {
    return (
      <ChefProvider>
        <div className="flex min-h-screen bg-gray-50">
          <div className="flex-1 flex flex-col">
            <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Kitchen - Chef Interface</h1>
              <button
                onClick={() => setMode('select')}
                className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Switch Mode
              </button>
            </div>
            <main className="flex-1 overflow-hidden">
              <Chef />
            </main>
          </div>
        </div>
      </ChefProvider>
    );
  }

  if (mode === 'waiter') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Waiter - Order Delivery</h1>
            <button
              onClick={() => setMode('select')}
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Switch Mode
            </button>
          </div>
          <main className="flex-1 overflow-hidden">
            <Waiter />
          </main>
        </div>
      </div>
    );
  }

  const CurrentPageComponent = adminPageConfig[currentPage as keyof typeof adminPageConfig].component;
  const pageTitle = adminPageConfig[currentPage as keyof typeof adminPageConfig].title;

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSwitchMode={() => setMode('select')}
        />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header title={pageTitle} />
          <main className="flex-1 p-6">
            <CurrentPageComponent />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

export default App;
