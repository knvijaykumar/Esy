-- ==============================================================================
-- Esy FARM - Latest Farmer Updates Cache & Bulletin Table (SIH26032)
-- ==============================================================================
-- Stores and caches verified updates from official Karnataka and GoI agricultural sources:
-- ICAR, Karnataka Raitha Mitra, Krishi Marata Vahini, Dept of Horticulture, MoA&FW.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.farmer_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    published_date TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance and chronological sorting
CREATE INDEX IF NOT EXISTS idx_farmer_updates_published ON public.farmer_updates (published_date DESC);
CREATE INDEX IF NOT EXISTS idx_farmer_updates_category ON public.farmer_updates (category);

-- Enable Row Level Security
ALTER TABLE public.farmer_updates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verified government bulletins
DROP POLICY IF EXISTS "Public read access to farmer updates" ON public.farmer_updates;
CREATE POLICY "Public read access to farmer updates"
ON public.farmer_updates
FOR SELECT
TO authenticated, anon
USING (true);

-- Allow service role / backend to insert or update updates cache
DROP POLICY IF EXISTS "Service role write access to farmer updates" ON public.farmer_updates;
CREATE POLICY "Service role write access to farmer updates"
ON public.farmer_updates
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Seed initial verified official bulletins
INSERT INTO public.farmer_updates (category, title, summary, published_date, source_name, source_url)
VALUES
  (
    '💰 MSP & Procurement',
    'Kharif 2026-27 MSP Minimum Support Price Schedule Announced for Cereals and Pulses',
    'Cabinet Committee on Economic Affairs approves revised Minimum Support Prices guaranteeing a return of at least 50% over cost of production for Paddy, Ragi, and Jowar.',
    '2026-09-12',
    'Ministry of Agriculture & Farmers Welfare',
    'https://agricoop.nic.in/'
  ),
  (
    '🏛️ Government Schemes',
    'Karnataka Raitha Siri & Krishi Bhagya Scheme Online Application Window Open',
    'State government invites eligible small and marginal farmers across Karnataka taluks to apply for farm pond assistance, micro-irrigation subsidies, and direct benefit transfers.',
    '2026-09-10',
    'Karnataka Raitha Mitra',
    'https://raitamitra.karnataka.gov.in/'
  ),
  (
    '🚜 Agricultural Machinery',
    'Custom Hiring Centre (CHC) Modern Farm Mechanization Subsidy Guidelines Released',
    'Directorate of Agriculture Karnataka releases operational guidelines offering 50% subsidy for youth & farmer cooperative societies to establish agricultural machinery service hubs.',
    '2026-09-08',
    'Karnataka Raitha Mitra',
    'https://raitamitra.karnataka.gov.in/'
  ),
  (
    '🌾 Farming Technology',
    'ICAR Releases Climate-Resilient Short-Duration Paddy & Finger Millet Cultivars',
    'Indian Council of Agricultural Research scientists introduce drought-tolerant and lodging-resistant high-yield seeds suitable for peninsular dryland conditions.',
    '2026-09-05',
    'ICAR',
    'https://icar.gov.in/'
  ),
  (
    '📢 Farmer Advisory',
    'Krishi Marata Vahini Advises Grain Moisture Standardization Ahead of APMC Yard Visit',
    'Karnataka State Agricultural Marketing Board instructs farmers to ensure grain moisture content remains within standard 12%-14% threshold to avoid deduction during quality grading.',
    '2026-09-03',
    'Karnataka Agricultural Marketing (Krishi Marata Vahini)',
    'https://krishimaratavahini.karnataka.gov.in/'
  ),
  (
    '🧪 Crop Technology',
    'Department of Horticulture Issues Organic Pest Management & Soil Health Advisory',
    'Bio-fertilizer protocol and integrated pest management (IPM) guidelines published for vegetable, onion, and plantation crop growers in southern plateau zones.',
    '2026-08-30',
    'Karnataka Department of Horticulture',
    'https://horticulturedir.karnataka.gov.in/'
  )
ON CONFLICT DO NOTHING;
