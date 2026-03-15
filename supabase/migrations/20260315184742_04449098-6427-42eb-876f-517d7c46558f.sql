
CREATE TABLE public.vehicle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle images" ON public.vehicle_images
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert vehicle images" ON public.vehicle_images
  FOR INSERT TO public WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vehicle images" ON public.vehicle_images
  FOR DELETE TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vehicle images" ON public.vehicle_images
  FOR UPDATE TO public USING (auth.role() = 'authenticated');
