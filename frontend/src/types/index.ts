export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'mr';

export interface District {
  id: string;
  name: string;
  state: string;
}

export interface Taluk {
  id: string;
  district_id: string;
  name: string;
}

export interface ProcurementCenter {
  id: string;
  district_id: string;
  taluk_id: string;
  name: string;
  address: string;
  contact_phone: string;
  operating_hours: string;
  daily_capacity_quintals: number;
}

export interface Crop {
  id: string;
  name: string;
  kannada_name?: string;
  category: 'Cereal' | 'Millets' | 'Pulses' | 'Oilseeds';
  msp_price_inr: number;
  unit: string;
}

export interface CenterCrop {
  center_id: string;
  crop_id: string;
}

export interface TimeSlot {
  id: string;
  center_id: string;
  date: string; // YYYY-MM-DD
  time_range: string; // e.g. "09:00 AM – 10:00 AM"
  capacity: number;
  booked_count: number;
}

export interface Farmer {
  id: string;
  farmer_id: string; // e.g. "FMR-00125"
  full_name: string;
  mobile: string; // 10 digits
  district_id: string;
  taluk_id: string;
  village: string;
  address?: string;
  preferred_language: Language;
  created_at: string;
  avatar_url?: string;
}

export type ProcurementStatus =
  | 'Booking Confirmed'
  | 'Farmer Arrived'
  | 'Quality Check'
  | 'Procurement Processing'
  | 'Procurement Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  token_number: string;
  farmer_id: string;
  farmer_name: string;
  farmer_mobile: string;
  district_id: string;
  taluk_id: string;
  center_id: string;
  center_name: string;
  center_address: string;
  crop_id: string;
  crop_name: string;
  date: string;
  slot_id: string;
  slot_time: string;
  estimated_quantity_quintals: number;
  status: ProcurementStatus;
  created_at: string;
  timeline: {
    status: ProcurementStatus;
    timestamp?: string;
    completed: boolean;
    current: boolean;
    note?: string;
  }[];
}

export interface ProcurementRecord {
  id: string;
  booking_id: string;
  token_number: string;
  farmer_name: string;
  crop_name: string;
  center_name: string;
  date: string;
  quantity_quintals: number;
  quality_grade: 'Grade A' | 'Grade B' | 'Standard';
  total_amount_inr: number;
  status: 'Accepted' | 'Completed';
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Center Manager' | 'Verification Officer' | 'Admin';
  center_name: string;
}


export interface AuthSession {
  token: string;
  farmer: Farmer;
  authenticatedAt: string;
  expiresAt: string;
}

export type CropCondition = 'Healthy' | 'Moderate' | 'Poor';

export interface CropAssessmentResult {
  crop: string;
  crop_confidence: number;
  disease_or_issue: string;
  disease_confidence: number;
  condition: CropCondition;
  quality_warning: string;
  recommendation: string;
}

export interface CropAssessmentReport {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_mobile: string;
  crop: string;
  disease_or_issue: string;
  condition: CropCondition;
  quality_warning: string;
  recommendation: string;
  analysis_date: string;
  center_id?: string;
  center_name?: string;
  token_number?: string;
  booking_date?: string;
  image_preview?: string;
  submitted_to_center?: boolean;
  submitted_at?: string;
}


