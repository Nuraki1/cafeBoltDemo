export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  preparation_time: number;
  image_url?: string;
  available: boolean;
  created_at: string;
}

export interface Chef {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'unavailable';
  current_orders_count: number;
  created_at: string;
}

export interface CartItem {
  menu_item_id: string;
  quantity: number;
  price: number;
  name: string;
  special_notes?: string;
}

export interface CashierOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'assigned' | 'in_preparation' | 'ready' | 'completed';
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  assigned_chef_id?: string;
  created_at: string;
  completed_at?: string;
}

export interface OrderItem {
  id: string;
  cashier_order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  special_notes?: string;
  status: string;
  created_at: string;
}

export interface Payment {
  id: string;
  cashier_order_id: string;
  amount: number;
  method: string;
  status: 'completed' | 'failed' | 'pending';
  transaction_id?: string;
  created_at: string;
}
