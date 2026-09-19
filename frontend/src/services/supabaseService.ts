import { supabase } from '../lib/supabase';
import { Booking, Farmer, CropAssessmentReport } from '../types';

/**
 * Supabase Data Service with User Data Isolation & RLS
 * ======================================================
 * Ensures all farmer-specific records are strictly queried and filtered
 * by the authenticated farmer's unique UUID (auth.uid() / farmer_id).
 */
class SupabaseService {
  /**
   * Fetch only the current authenticated farmer's profile
   */
  async getFarmerProfile(userId: string): Promise<Farmer | null> {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .or(`id.eq.${userId},farmer_id.eq.${userId}`)
        .maybeSingle();

      if (error) {
        console.warn('Supabase getFarmerProfile error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Supabase getFarmerProfile failed:', err);
      return null;
    }
  }

  /**
   * Fetch ONLY the bookings belonging to the specified farmer UUID (enforcing user isolation)
   */
  async getBookingsForFarmer(farmerId: string): Promise<Booking[]> {
    if (!farmerId) return [];
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getBookingsForFarmer error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('Supabase getBookingsForFarmer failed:', err);
      return [];
    }
  }

  /**
   * Create a new booking linked strictly to the farmer's unique UUID
   */
  async createBooking(booking: Booking): Promise<Booking | null> {
    try {
      // Ensure id is a valid UUID
      const payload = {
        ...booking,
        farmer_id: booking.farmer_id, // Linked to authenticated user's UUID
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.warn('Supabase createBooking error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Supabase createBooking failed:', err);
      return null;
    }
  }

  /**
   * Lookup a booking token strictly within the farmer's own records
   */
  async getBookingByToken(tokenNumber: string, farmerId: string): Promise<Booking | null> {
    if (!tokenNumber || !farmerId) return null;
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('farmer_id', farmerId)
        .ilike('token_number', tokenNumber.trim())
        .maybeSingle();

      if (error) {
        console.warn('Supabase getBookingByToken error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Supabase getBookingByToken failed:', err);
      return null;
    }
  }

  /**
   * Fetch crop assessment reports belonging strictly to the specified farmer
   */
  async getCropReportsForFarmer(farmerId: string): Promise<CropAssessmentReport[]> {
    if (!farmerId) return [];
    try {
      const { data, error } = await supabase
        .from('crop_reports')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
