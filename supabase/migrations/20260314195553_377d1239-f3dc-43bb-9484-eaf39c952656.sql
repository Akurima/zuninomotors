-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  km TEXT NOT NULL,
  price TEXT NOT NULL,
  fuel TEXT DEFAULT 'Nafta',
  transmission TEXT DEFAULT 'Manual',
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Public can read active vehicles
CREATE POLICY "Anyone can view active vehicles"
  ON public.vehicles FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage vehicles
CREATE POLICY "Authenticated users can insert vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vehicles"
  ON public.vehicles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vehicles"
  ON public.vehicles FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all vehicles"
  ON public.vehicles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true);

CREATE POLICY "Vehicle images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can upload vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vehicle images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vehicle images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();