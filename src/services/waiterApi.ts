import { supabase } from '../lib/supabase';

export async function getReadyOrders() {
  const { data, error } = await supabase
    .from('cashier_orders')
    .select(`
      id,
      order_number,
      customer_name,
      status,
      created_at,
      order_items:order_items(id, menu_item_id, quantity)
    `)
    .eq('status', 'ready')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('cashier_orders')
    .select(`
      id,
      order_number,
      customer_name,
      status,
      payment_status,
      created_at,
      order_items:order_items(id, menu_item_id, quantity)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function markOrderDelivered(orderId: string) {
  const { error } = await supabase
    .from('cashier_orders')
    .update({ status: 'completed' })
    .eq('id', orderId);

  if (error) throw error;
}
