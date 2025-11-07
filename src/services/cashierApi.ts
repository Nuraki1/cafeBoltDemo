import { supabase } from '../lib/supabase';
import { MenuItem, Chef, CashierOrder, OrderItem, Payment } from '../types/cashier';

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getChefs(): Promise<Chef[]> {
  const { data, error } = await supabase
    .from('chefs')
    .select('*')
    .order('current_orders_count', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createCashierOrder(
  customerName: string,
  items: Array<{ menu_item_id: string; quantity: number; price: number; special_notes?: string }>,
  totalAmount: number
): Promise<CashierOrder> {
  const orderNumber = `ORD-${Date.now()}`;

  const { data: order, error: orderError } = await supabase
    .from('cashier_orders')
    .insert([
      {
        order_number: orderNumber,
        customer_name: customerName,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
      },
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map(item => ({
    cashier_order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price: item.price,
    special_notes: item.special_notes,
    status: 'pending',
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

export async function processPayment(
  orderId: string,
  amount: number,
  method: string
): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        cashier_order_id: orderId,
        amount,
        method,
        status: 'completed',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('cashier_orders')
    .update({ payment_status: 'completed' })
    .eq('id', orderId);

  return data;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('cashier_order_id', orderId);

  if (error) throw error;
  return data || [];
}

export async function assignOrderToChef(orderId: string, chefId: string): Promise<void> {
  const { error } = await supabase
    .from('cashier_orders')
    .update({ status: 'assigned', assigned_chef_id: chefId })
    .eq('id', orderId);

  if (error) throw error;

  const { error: chefError } = await supabase
    .rpc('increment_chef_orders', { chef_id: chefId });

  if (chefError) throw chefError;
}

export async function getCashierOrders(): Promise<CashierOrder[]> {
  const { data, error } = await supabase
    .from('cashier_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('cashier_orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
}
