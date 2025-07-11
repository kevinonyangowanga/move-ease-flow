-- Create enum types
CREATE TYPE public.move_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.move_type AS ENUM ('local', 'long_distance', 'international');
CREATE TYPE public.order_item_category AS ENUM ('furniture', 'boxes', 'appliances', 'fragile', 'other');
CREATE TYPE public.notification_type AS ENUM ('email', 'sms', 'push');
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'failed');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  move_type move_type NOT NULL,
  status move_status NOT NULL DEFAULT 'pending',
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  origin_coordinates POINT,
  destination_coordinates POINT,
  distance_miles DECIMAL(10,2),
  move_date DATE NOT NULL,
  move_time TIME NOT NULL,
  estimated_hours INTEGER,
  base_price DECIMAL(10,2) NOT NULL,
  additional_services_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  assigned_mover_id UUID,
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  category order_item_category NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  weight_lbs DECIMAL(8,2),
  volume_cubic_ft DECIMAL(8,2),
  fragile BOOLEAN DEFAULT false,
  requires_disassembly BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create movers table
CREATE TABLE public.movers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  license_number TEXT,
  insurance_number TEXT,
  phone TEXT,
  email TEXT,
  service_areas TEXT[],
  hourly_rate DECIMAL(8,2),
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_jobs INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pricing_rates table
CREATE TABLE public.pricing_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  move_type move_type NOT NULL,
  base_rate_per_mile DECIMAL(8,4) NOT NULL,
  base_hourly_rate DECIMAL(8,2) NOT NULL,
  fuel_surcharge_rate DECIMAL(5,4) DEFAULT 0.10,
  packing_service_rate DECIMAL(8,2) DEFAULT 50.00,
  fragile_handling_rate DECIMAL(8,2) DEFAULT 25.00,
  disassembly_rate DECIMAL(8,2) DEFAULT 75.00,
  storage_rate_per_day DECIMAL(8,2) DEFAULT 15.00,
  weekend_surcharge_rate DECIMAL(5,4) DEFAULT 0.15,
  rush_service_rate DECIMAL(5,4) DEFAULT 0.25,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status notification_status DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_tracking table
CREATE TABLE public.order_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status move_status NOT NULL,
  message TEXT,
  location TEXT,
  estimated_arrival TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Movers can view assigned orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.movers 
      WHERE movers.user_id = auth.uid() AND movers.id = orders.assigned_mover_id
    )
  );

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Create RLS policies for movers
CREATE POLICY "Movers can view their own profile" ON public.movers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Movers can update their own profile" ON public.movers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view active movers" ON public.movers
  FOR SELECT USING (is_active = true);

-- Create RLS policies for pricing_rates
CREATE POLICY "Everyone can view active pricing rates" ON public.pricing_rates
  FOR SELECT USING (is_active = true);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for order_tracking
CREATE POLICY "Users can view tracking for their orders" ON public.order_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_tracking.order_id AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_move_date ON public.orders(move_date);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_movers_user_id ON public.movers(user_id);
CREATE INDEX idx_movers_active ON public.movers(is_active);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_order_tracking_order_id ON public.order_tracking(order_id);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'MV' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movers_updated_at
  BEFORE UPDATE ON public.movers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rates_updated_at
  BEFORE UPDATE ON public.pricing_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default pricing rates
INSERT INTO public.pricing_rates (move_type, base_rate_per_mile, base_hourly_rate) VALUES
('local', 2.50, 120.00),
('long_distance', 1.25, 150.00),
('international', 3.00, 200.00);