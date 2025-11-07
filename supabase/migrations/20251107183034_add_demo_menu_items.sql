/*
  # Add Demo Menu Items

  1. Seed menu_items table with demo products
  - Various restaurant items across multiple categories
  - Real-world pricing
  - Preparation times for kitchen
*/

INSERT INTO menu_items (name, description, price, category, preparation_time, available) VALUES
  ('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'Pizza', 20, true),
  ('Pepperoni Pizza', 'Delicious pizza with pepperoni and mozzarella cheese', 14.99, 'Pizza', 20, true),
  ('Vegetarian Pizza', 'Loaded with fresh vegetables and cheese', 13.99, 'Pizza', 20, true),
  ('Caesar Salad', 'Fresh romaine lettuce with parmesan and croutons', 9.99, 'Salad', 5, true),
  ('Greek Salad', 'Mixed greens with feta cheese, olives, and tomatoes', 10.99, 'Salad', 5, true),
  ('Grilled Chicken Sandwich', 'Juicy grilled chicken on toasted bread with toppings', 11.99, 'Sandwich', 15, true),
  ('Beef Burger', 'Premium beef patty with lettuce, tomato, and special sauce', 12.99, 'Burger', 15, true),
  ('Chicken Burger', 'Crispy fried chicken patty with pickles and mayo', 11.99, 'Burger', 15, true),
  ('Spaghetti Carbonara', 'Traditional pasta with bacon, cream, and parmesan', 13.99, 'Pasta', 18, true),
  ('Fettuccine Alfredo', 'Creamy alfredo sauce with fettuccine pasta', 12.99, 'Pasta', 18, true),
  ('Penne Arrabbiata', 'Spicy tomato sauce with penne pasta', 11.99, 'Pasta', 18, true),
  ('Grilled Salmon', 'Fresh salmon fillet with lemon butter sauce', 18.99, 'Fish', 20, true),
  ('Grilled Shrimp', 'Succulent grilled shrimp with garlic and herbs', 17.99, 'Fish', 15, true),
  ('Chicken Wings', 'Crispy wings with your choice of sauce', 9.99, 'Appetizer', 12, true),
  ('Mozzarella Sticks', 'Golden fried mozzarella sticks with marinara dip', 7.99, 'Appetizer', 8, true),
  ('French Fries', 'Crispy golden fries with sea salt', 4.99, 'Sides', 5, true),
  ('Onion Rings', 'Crispy battered onion rings', 5.99, 'Sides', 8, true),
  ('Garlic Bread', 'Toasted bread with garlic and herbs', 3.99, 'Sides', 5, true),
  ('Chocolate Cake', 'Rich and moist chocolate cake with frosting', 6.99, 'Dessert', 2, true),
  ('Tiramisu', 'Classic Italian dessert with mascarpone and cocoa', 7.99, 'Dessert', 2, true),
  ('Iced Tea', 'Fresh cold iced tea', 2.99, 'Beverage', 1, true),
  ('Soft Drink', 'Assorted soft drinks - Coke, Sprite, Fanta', 2.49, 'Beverage', 1, true),
  ('Coffee', 'Fresh brewed coffee', 3.49, 'Beverage', 3, true),
  ('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'Beverage', 2, true);

INSERT INTO chefs (name, status, current_orders_count) VALUES
  ('Chef Marco', 'available', 0),
  ('Chef Giovanni', 'available', 0),
  ('Chef Sofia', 'available', 0);
