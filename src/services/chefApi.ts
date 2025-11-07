import { supabase } from '../lib/supabase';
import { OrderItem, CashierOrder } from '../types/cashier';

export async function getChefOrders(chefId: string): Promise<(CashierOrder & { items: OrderItem[] })[]> {
  const { data: orders, error: ordersError } = await supabase
    .from('cashier_orders')
    .select('*')
    .eq('assigned_chef_id', chefId)
    .in('status', ['assigned', 'in_preparation'])
    .order('created_at', { ascending: true });

  if (ordersError) throw ordersError;

  const ordersWithItems = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('cashier_order_id', order.id);

      if (itemsError) throw itemsError;

      return {
        ...order,
        items: items || [],
      };
    })
  );

  return ordersWithItems;
}

export async function updateOrderItemStatus(
  orderItemId: string,
  status: string
): Promise<void> {
  const { error } = await supabase
    .from('order_items')
    .update({ status })
    .eq('id', orderItemId);

  if (error) throw error;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('cashier_orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
}

export async function getMenuItemDetails(menuItemId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', menuItemId)
    .single();

  if (error) throw error;
  return data;
}

export async function markOrderReady(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('cashier_orders')
    .update({ status: 'ready' })
    .eq('id', orderId);

  if (error) throw error;
}
