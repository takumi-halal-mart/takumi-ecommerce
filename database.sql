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



-- 1. Create the 'promotional_banners' table
CREATE TABLE promotional_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url TEXT NOT NULL,
  heading TEXT,
  subtext TEXT,
  redirect_url TEXT, -- Where the user goes when they click the banner
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- 2. Create the 'promotions' table (The Offer Customization Matrix)
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  offer_name TEXT NOT NULL,
  target_product_id UUID REFERENCES products(id) ON DELETE CASCADE, -- Nullable if it applies to cart
  discount_type TEXT NOT NULL CHECK (discount_type IN ('Percentage Off', 'Flat Discount', 'Buy 1 Get 1')),
  discount_value DECIMAL(10, 2) NOT NULL, -- e.g., 20 (for 20%), or 500 (for $500 off)
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 4. Security Policies: Public can view, Admins can edit
CREATE POLICY "Public banners viewable by everyone" 
ON promotional_banners FOR SELECT USING (true);
CREATE POLICY "Admins manage banners" 
ON promotional_banners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public promotions viewable by everyone" 
ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins manage promotions" 
ON promotions FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE products 
ADD COLUMN unit_type TEXT DEFAULT 'piece' NOT NULL;

ALTER TABLE products ALTER COLUMN retail_price DROP NOT NULL;

-- Create a secure database view for our Automated CRM
CREATE OR REPLACE VIEW customer_crm AS
SELECT 
  -- Grabs the most recent name used for this phone number
  (array_agg(customer_name ORDER BY created_at DESC))[1] AS customer_name,
  customer_phone,
  COUNT(id) AS total_orders,
  SUM(total_amount) AS lifetime_value,
  -- Grabs the most recent delivery address used
  (array_agg(delivery_address ORDER BY created_at DESC))[1] AS primary_address,
  -- Tracks if they have ever placed a wholesale inquiry order
  COUNT(id) FILTER (WHERE payment_method = 'Wholesale Inquiry') AS wholesale_orders_count
FROM orders
GROUP BY customer_phone;

-- Secure the view by granting read access to our backend
GRANT SELECT ON customer_crm TO authenticated;

ALTER TABLE products 
ADD COLUMN category TEXT DEFAULT 'Uncategorized' NOT NULL;

-- 1. Create the Global Settings table
CREATE TABLE store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  delivery_fee DECIMAL(10, 2) DEFAULT 1000 NOT NULL,
  free_shipping_threshold DECIMAL(10, 2) DEFAULT 10000 NOT NULL,
  is_store_open BOOLEAN DEFAULT true NOT NULL,
  whatsapp_number TEXT DEFAULT '+81000000000' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- This constraint guarantees this table can ONLY ever have one row (id = 1)
  CONSTRAINT single_row_only CHECK (id = 1)
);

-- 2. Insert the default configuration
INSERT INTO store_settings (id, delivery_fee, free_shipping_threshold, is_store_open, whatsapp_number) 
VALUES (1, 1000, 10000, true, '+81000000000');

-- 3. Enable Row Level Security (RLS)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- The public storefront needs to read this to calculate cart totals and check if the store is open
CREATE POLICY "Anyone can read store settings" 
ON store_settings FOR SELECT USING (true);

-- Only admins can update the settings
CREATE POLICY "Admins can update store settings" 
ON store_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- 1. Create the master categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert the standard starting categories
INSERT INTO categories (name) VALUES 
  ('Meat & Poultry'), 
  ('Spices & Herbs'), 
  ('Fresh Produce'), 
  ('Rice & Grains'), 
  ('Beverages'), 
  ('Household');

-- 3. Enable RLS and create security policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" 
ON categories FOR ALL USING (auth.role() = 'authenticated');

-- 1. Create the 'coupons' table
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- The core code details
  code TEXT UNIQUE NOT NULL, -- e.g., WELCOME10
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL, -- e.g., 10 (for 10%), or 500 (for ¥500 off)
  
  -- The Usage Constraints
  expiration_date TIMESTAMP WITH TIME ZONE, -- Null means it never expires
  min_spend DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  usage_limit INTEGER, -- Null means unlimited uses
  
  -- Internal Tracking
  times_used INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies
-- Anyone (the customer storefront) needs to be able to read coupons to validate them at checkout
CREATE POLICY "Public can read active coupons to validate at checkout" 
ON coupons FOR SELECT USING (true);

-- Only admins can create, update, or delete the coupons
CREATE POLICY "Admins have full control over coupons" 
ON coupons FOR ALL USING (auth.role() = 'authenticated');