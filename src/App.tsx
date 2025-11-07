import { useState } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { CashierProvider } from './context/CashierContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import CashierSidebar from './components/Cashier/CashierSidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Cashier from './pages/Cashier';

function App() {
  const [mode, setMode] = useState<'admin' | 'cashier'>('admin');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const adminPageConfig = {
    dashboard: { title: 'Dashboard', component: Dashboard },
    users: { title: 'Users Management', component: Users },
    products: { title: 'Products Management', component: Products },
    orders: { title: 'Orders Management', component: Orders },
    analytics: { title: 'Analytics', component: Analytics },
  };

  if (mode === 'cashier') {
    return (
      <CashierProvider>
        <div className="flex min-h-screen bg-gray-50">
          <CashierSidebar onSwitchMode={() => setMode('admin')} />
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

  const CurrentPageComponent = adminPageConfig[currentPage as keyof typeof adminPageConfig].component;
  const pageTitle = adminPageConfig[currentPage as keyof typeof adminPageConfig].title;

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSwitchMode={() => setMode('cashier')}
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
