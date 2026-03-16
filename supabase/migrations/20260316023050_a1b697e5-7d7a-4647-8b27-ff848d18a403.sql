ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_promo boolean NOT NULL DEFAULT false;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS promo_price text DEFAULT NULL;