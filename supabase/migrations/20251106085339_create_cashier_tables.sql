/*
  # Cashier & POS System Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `preparation_time` (integer, minutes)
      - `image_url` (text, nullable)
      - `available` (boolean, default true)
      - `created_at` (timestamptz)
    
    - `chefs`
      - `id` (uuid, primary key)
      - `name` (text)
      - `status` (text, default 'available')
      - `current_orders_count` (integer, default 0)
      - `created_at` (timestamptz)
    
    - `cashier_orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `customer_name` (text)
      - `total_amount` (numeric)
      - `status` (text, default 'pending')
      - `payment_method` (text)
      - `payment_status` (text, default 'pending')
      - `assigned_chef_id` (uuid, foreign key, nullable)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `cashier_order_id` (uuid, foreign key)
      - `menu_item_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (numeric)
      - `special_notes` (text, nullable)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)
    
    - `payments`
      - `id` (uuid, primary key)
      - `cashier_order_id` (uuid, foreign key)
      - `amount` (numeric)
      - `method` (text)
      - `status` (text, default 'completed')
      - `transaction_id` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated cashier users
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL,
  category text NOT NULL,
  preparation_time integer DEFAULT 15,
  image_url text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text DEFAULT 'available' NOT NULL,
  current_orders_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cashier_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  payment_method text,
  payment_status text DEFAULT 'pending' NOT NULL,
  assigned_chef_id uuid REFERENCES chefs(id),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cashier_order_id uuid REFERENCES cashier_orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL,
  price numeric NOT NULL,
  special_notes text,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cashier_order_id uuid REFERENCES cashier_orders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text NOT NULL,
  status text DEFAULT 'completed' NOT NULL,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read chefs"
  ON chefs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON cashier_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read orders"
  ON cashier_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON cashier_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);