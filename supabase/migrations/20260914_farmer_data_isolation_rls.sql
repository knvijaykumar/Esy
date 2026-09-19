-- ==============================================================================
-- Esy FARM - Supabase Row Level Security (RLS) Policies
-- User Data Isolation for Farmers (SIH26032)
-- ==============================================================================
-- Purpose:
-- Enforces strict database-level data isolation so that authenticated farmers
-- can ONLY view, insert, and update their own personal records.
-- User A cannot read or access User B's bookings, tokens, timeline, or history.
-- ==============================================================================

-- 1. Enable Row Level Security on all farmer-specific tables
ALTER TABLE IF EXISTS public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

-- Create crop_reports table if not already created
CREATE TABLE IF NOT EXISTS public.crop_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id TEXT NOT NULL,
    crop TEXT NOT NULL,
    disease_or_issue TEXT,
    condition TEXT NOT NULL,
    quality_warning TEXT,
    recommendation TEXT,
    analysis_date TEXT NOT NULL,
    center_id TEXT,
    center_name TEXT,
    token_number TEXT,
    booking_date TEXT,
    submitted_to_center BOOLEAN DEFAULT FALSE,
    submitted_at TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE IF EXISTS public.crop_reports ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing permissive policies to prevent data leaks
DROP POLICY IF EXISTS "Farmers view own profile" ON public.farmers;
DROP POLICY IF EXISTS "Farmers insert own profile" ON public.farmers;
DROP POLICY IF EXISTS "Farmers update own profile" ON public.farmers;

DROP POLICY IF EXISTS "Farmers view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Farmers insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Farmers update own bookings" ON public.bookings;

DROP POLICY IF EXISTS "Farmers view own crop reports" ON public.crop_reports;
DROP POLICY IF EXISTS "Farmers insert own crop reports" ON public.crop_reports;

-- 3. Row Level Security Policies for 'farmers' (Profile isolation)
-- Farmer can only read their own profile row
CREATE POLICY "Farmers view own profile"
ON public.farmers
FOR SELECT
TO authenticated, anon
USING (
    id = auth.uid()
    OR farmer_id = auth.uid()::text
);

-- Farmer can only insert their own profile matching auth.uid()
CREATE POLICY "Farmers insert own profile"
ON public.farmers
FOR INSERT
TO authenticated, anon
WITH CHECK (
    id = auth.uid()
    OR farmer_id = auth.uid()::text
);

-- Farmer can only update their own profile
CREATE POLICY "Farmers update own profile"
ON public.farmers
FOR UPDATE
TO authenticated, anon
USING (
    id = auth.uid()
    OR farmer_id = auth.uid()::text
);

-- 4. Row Level Security Policies for 'bookings' (Booking, token & history isolation)
-- Strictly isolates bookings so User A cannot read User B's bookings
CREATE POLICY "Farmers view own bookings"
ON public.bookings
FOR SELECT
TO authenticated, anon
USING (
    farmer_id = auth.uid()::text
    OR farmer_id IN (
        SELECT id::text FROM public.farmers WHERE id = auth.uid() OR farmer_id = auth.uid()::text
    )
);

-- Farmer can only insert bookings linked to their own identity
CREATE POLICY "Farmers insert own bookings"
ON public.bookings
FOR INSERT
TO authenticated, anon
WITH CHECK (
    farmer_id = auth.uid()::text
    OR farmer_id IN (
        SELECT id::text FROM public.farmers WHERE id = auth.uid() OR farmer_id = auth.uid()::text
    )
);

-- Farmer can only update their own bookings
CREATE POLICY "Farmers update own bookings"
ON public.bookings
FOR UPDATE
TO authenticated, anon
USING (
    farmer_id = auth.uid()::text
    OR farmer_id IN (
        SELECT id::text FROM public.farmers WHERE id = auth.uid() OR farmer_id = auth.uid()::text
    )
);

-- 5. Row Level Security Policies for 'crop_reports'
CREATE POLICY "Farmers view own crop reports"
ON public.crop_reports
FOR SELECT
TO authenticated, anon
USING (
    farmer_id = auth.uid()::text
);

CREATE POLICY "Farmers insert own crop reports"
ON public.crop_reports
FOR INSERT
TO authenticated, anon
WITH CHECK (
    farmer_id = auth.uid()::text
);
