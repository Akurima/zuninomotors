ALTER TABLE public.vehicles ADD COLUMN is_promo boolean NOT NULL DEFAULT false;
ALTER TABLE public.vehicles ADD COLUMN promo_price text DEFAULT NULL;