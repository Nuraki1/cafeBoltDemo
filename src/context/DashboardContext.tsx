import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, DashboardStats } from '../types';
import * as api from '../services/api';

interface DashboardContextType {
  users: User[];
  products: Product[];
  orders: Order[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, productsData, ordersData, statsData] = await Promise.all([
        api.getUsers(),
        api.getProducts(),
        api.getOrders(),
        api.getDashboardStats(),
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    const newUser = await api.createUser(user);
    setUsers([...users, newUser]);
    await refreshData();
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    await api.updateUser(id, user);
    setUsers(users.map(u => u.id === id ? { ...u, ...user } : u));
    await refreshData();
  };

  const deleteUser = async (id: string) => {
    await api.deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
    await refreshData();
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct = await api.createProduct(product);
    setProducts([...products, newProduct]);
    await refreshData();
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    await api.updateProduct(id, product);
    setProducts(products.map(p => p.id === id ? { ...p, ...product } : p));
    await refreshData();
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
    await refreshData();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await api.updateOrderStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    await refreshData();
  };

  return (
    <DashboardContext.Provider
      value={{
        users,
        products,
        orders,
        stats,
        loading,
        error,
        refreshData,
        addUser,
        updateUser,
        deleteUser,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
