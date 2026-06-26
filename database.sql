-- 1. Create the products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  stock_count INTEGER DEFAULT 0 NOT NULL,
  
  -- Retail Pricing
  is_retail BOOLEAN DEFAULT true NOT NULL,
  retail_price DECIMAL(10, 2) NOT NULL,
  
  -- Wholesale / Bulk Pricing Config
  is_wholesale BOOLEAN DEFAULT false NOT NULL,
  wholesale_price DECIMAL(10, 2),
  wholesale_moq INTEGER DEFAULT 10
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Anyone (public storefront) can view products
CREATE POLICY "Public products are viewable by everyone." 
ON products FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete products
CREATE POLICY "Admins can insert products." 
ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update products." 
ON products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete products." 
ON products FOR DELETE USING (auth.role() = 'authenticated');

-- 1. Create the 'orders' table (The Customer Details)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Shipped', 'Completed')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Stripe', 'WhatsApp', 'Wholesale Inquiry')),
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Unpaid', 'Pending'))
);

-- 2. Create the 'order_items' table (The Cart Contents)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Orders
-- ALLOW ANYONE to place an order (Guest Checkout)
CREATE POLICY "Anyone can insert an order" 
ON orders FOR INSERT WITH CHECK (true);

-- ONLY ADMINS can view, update, or delete orders
CREATE POLICY "Admins can view orders" 
ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update orders" 
ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete orders" 
ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Create Security Policies for Order Items
CREATE POLICY "Anyone can insert order items" 
ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view order items" 
ON order_items FOR SELECT USING (auth.role() = 'authenticated');