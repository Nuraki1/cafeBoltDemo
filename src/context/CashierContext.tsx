import { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem, Chef, CartItem, CashierOrder } from '../types/cashier';
import * as cashierApi from '../services/cashierApi';

interface CashierContextType {
  menuItems: MenuItem[];
  chefs: Chef[];
  cart: CartItem[];
  orders: CashierOrder[];
  loading: boolean;
  error: string | null;

  addToCart: (item: MenuItem, quantity: number, notes?: string) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartItem: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartQuantity: () => number;

  loadMenuItems: () => Promise<void>;
  loadChefs: () => Promise<void>;
  loadOrders: () => Promise<void>;

  createOrder: (customerName: string) => Promise<CashierOrder | null>;
  assignOrderToChef: (orderId: string, chefId: string) => Promise<void>;
  processPayment: (orderId: string, amount: number, method: string) => Promise<void>;
}

const CashierContext = createContext<CashierContextType | undefined>(undefined);

export function CashierProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<CashierOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await cashierApi.getMenuItems();
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const loadChefs = async () => {
    try {
      const chefsList = await cashierApi.getChefs();
      setChefs(chefsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chefs');
    }
  };

  const loadOrders = async () => {
    try {
      const ordersList = await cashierApi.getCashierOrders();
      setOrders(ordersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    }
  };

  const addToCart = (item: MenuItem, quantity: number, notes?: string) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.menu_item_id === item.id);
      if (existing) {
        return prevCart.map(c =>
          c.menu_item_id === item.id
            ? { ...c, quantity: c.quantity + quantity }
            : c
        );
      }
      return [
        ...prevCart,
        {
          menu_item_id: item.id,
          quantity,
          price: item.price,
          name: item.name,
          special_notes: notes,
        },
      ];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prevCart => prevCart.filter(c => c.menu_item_id !== menuItemId));
  };

  const updateCartItem = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(prevCart =>
        prevCart.map(c =>
          c.menu_item_id === menuItemId ? { ...c, quantity } : c
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const createOrder = async (customerName: string): Promise<CashierOrder | null> => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return null;
    }

    try {
      setLoading(true);
      const items = cart.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
        special_notes: item.special_notes,
      }));

      const order = await cashierApi.createCashierOrder(
        customerName,
        items,
        getCartTotal()
      );

      clearCart();
      await loadOrders();
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignOrderToChef = async (orderId: string, chefId: string) => {
    try {
      await cashierApi.assignOrderToChef(orderId, chefId);
      await loadOrders();
      await loadChefs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign order');
    }
  };

  const processPayment = async (orderId: string, amount: number, method: string) => {
    try {
      setLoading(true);
      await cashierApi.processPayment(orderId, amount, method);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CashierContext.Provider
      value={{
        menuItems,
        chefs,
        cart,
        orders,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartTotal,
        getCartQuantity,
        loadMenuItems,
        loadChefs,
        loadOrders,
        createOrder,
        assignOrderToChef,
        processPayment,
      }}
    >
      {children}
    </CashierContext.Provider>
  );
}

export function useCashier() {
  const context = useContext(CashierContext);
  if (context === undefined) {
    throw new Error('useCashier must be used within a CashierProvider');
  }
  return context;
}
