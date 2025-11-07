import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { OrderItem, CashierOrder } from '../types/cashier';
import * as chefApi from '../services/chefApi';

interface ChefContextType {
  orders: (CashierOrder & { items: OrderItem[] })[];
  loading: boolean;
  error: string | null;
  chefId: string | null;

  setChefId: (id: string) => void;
  loadOrders: () => Promise<void>;
  updateItemStatus: (itemId: string, status: string) => Promise<void>;
  markOrderReady: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const ChefContext = createContext<ChefContextType | undefined>(undefined);

export function ChefProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<(CashierOrder & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chefId, setChefId] = useState<string | null>(() => {
    const saved = localStorage.getItem('chefId');
    return saved || null;
  });

  const loadOrders = async () => {
    if (!chefId) return;

    try {
      setLoading(true);
      const data = await chefApi.getChefOrders(chefId);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chefId) {
      loadOrders();
      const interval = setInterval(() => loadOrders(), 3000);
      return () => clearInterval(interval);
    }
  }, [chefId]);

  const updateItemStatus = async (itemId: string, status: string) => {
    try {
      await chefApi.updateOrderItemStatus(itemId, status);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const markOrderReady = async (orderId: string) => {
    try {
      await chefApi.markOrderReady(orderId);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark order ready');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await chefApi.updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const handleSetChefId = (id: string) => {
    setChefId(id);
    localStorage.setItem('chefId', id);
  };

  return (
    <ChefContext.Provider
      value={{
        orders,
        loading,
        error,
        chefId,
        setChefId: handleSetChefId,
        loadOrders,
        updateItemStatus,
        markOrderReady,
        updateOrderStatus,
      }}
    >
      {children}
    </ChefContext.Provider>
  );
}

export function useChef() {
  const context = useContext(ChefContext);
  if (context === undefined) {
    throw new Error('useChef must be used within a ChefProvider');
  }
  return context;
}
