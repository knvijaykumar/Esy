import {
  District,
  Taluk,
  ProcurementCenter,
  Crop,
  TimeSlot,
  Farmer,
  Booking,
  ProcurementRecord,
  ProcurementStatus,
  CropAssessmentReport,
} from '../types';
import {
  MOCK_DISTRICTS,
  MOCK_TALUKS,
  MOCK_CENTRES,
  MOCK_CROPS,
  MOCK_CENTER_CROPS,
  STANDARD_TIME_SLOTS,
  MOCK_FARMERS,
  MOCK_BOOKINGS,
  MOCK_PROCUREMENT_RECORDS,
  MOCK_CROP_REPORTS,
} from '../data/mockData';

const STORAGE_KEYS = {
  FARMER: 'sih_current_farmer',
  BOOKINGS: 'sih_mock_bookings',
  FARMERS: 'sih_mock_farmers',
  PROCUREMENT: 'sih_mock_procurements',
  CROP_REPORTS: 'sih_crop_reports',
};

// Initialize localStorage with mock data if not present
const initStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FARMERS)) {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(MOCK_FARMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROCUREMENT)) {
    localStorage.setItem(
      STORAGE_KEYS.PROCUREMENT,
      JSON.stringify(MOCK_PROCUREMENT_RECORDS)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.CROP_REPORTS)) {
    localStorage.setItem(
      STORAGE_KEYS.CROP_REPORTS,
      JSON.stringify(MOCK_CROP_REPORTS)
    );
  }
};

initStorage();

export const mockService = {
  // Master Location & Hierarchy Services
  getDistricts(): District[] {
    return MOCK_DISTRICTS;
  },

  getFarmerFacingDistricts(): District[] {
    const districts = MOCK_DISTRICTS.filter(d => d.id !== 'dist-5' && d.id !== 'dist-6');
    districts.push({ id: 'dist-bengaluru', name: 'Bengaluru', state: 'Karnataka' });
    return districts.sort((a, b) => a.name.localeCompare(b.name));
  },

  getTaluksByDistrict(districtId: string): Taluk[] {
    if (districtId === 'dist-bengaluru') {
      return MOCK_TALUKS.filter((t) => t.district_id === 'dist-5' || t.district_id === 'dist-6');
    }
    return MOCK_TALUKS.filter((t) => t.district_id === districtId);
  },

  getCentersByTaluk(talukId: string): ProcurementCenter[] {
    return MOCK_CENTRES.filter((c) => c.taluk_id === talukId);
  },

  getCentersByDistrict(districtId: string): ProcurementCenter[] {
    if (districtId === 'dist-bengaluru') {
      return MOCK_CENTRES.filter((c) => c.district_id === 'dist-5' || c.district_id === 'dist-6');
    }
    return MOCK_CENTRES.filter((c) => c.district_id === districtId);
  },

  getAllCenters(): ProcurementCenter[] {
    return MOCK_CENTRES;
  },

  getCenterById(centerId: string): ProcurementCenter | undefined {
    return MOCK_CENTRES.find((c) => c.id === centerId);
  },

  // Crops Services
  getAllCrops(): Crop[] {
    return MOCK_CROPS;
  },

  getCropsByCenter(centerId: string): Crop[] {
    const cropIds = MOCK_CENTER_CROPS.filter((cc) => cc.center_id === centerId).map(
      (cc) => cc.crop_id
    );
    return MOCK_CROPS.filter((c) => cropIds.includes(c.id));
  },

  getCropById(cropId: string): Crop | undefined {
    return MOCK_CROPS.find((c) => c.id === cropId);
  },

  // Slot Services
  getSlotsForCenterAndDate(centerId: string, date: string): TimeSlot[] {
    const bookings = this.getAllBookings().filter(
      (b) => b.center_id === centerId && b.date === date
    );

    return STANDARD_TIME_SLOTS.map((timeRange, index) => {
      const booked = bookings.filter((b) => b.slot_time === timeRange).length;
      return {
        id: `slt-${centerId}-${date}-${index}`,
        center_id: centerId,
        date,
        time_range: timeRange,
        capacity: 15,
        booked_count: booked + (index % 2 === 0 ? 3 : 1), // Realistic mock occupancy
      };
    });
  },

  // Farmer Authentication & Management
  getCurrentFarmer(): Farmer | null {
    const stored = localStorage.getItem(STORAGE_KEYS.FARMER);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.id || parsed.mobile)) {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  setCurrentFarmer(farmer: Farmer | null): void {
    if (!farmer) {
      localStorage.removeItem(STORAGE_KEYS.FARMER);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
    // Also save to all farmers list
    const farmers = this.getAllFarmers();
    const existingIndex = farmers.findIndex(
      (f) => f.id === farmer.id || f.mobile === farmer.mobile
    );
    if (existingIndex >= 0) {
      farmers[existingIndex] = farmer;
    } else {
      farmers.unshift(farmer);
    }
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  },

  getAllFarmers(): Farmer[] {
    const stored = localStorage.getItem(STORAGE_KEYS.FARMERS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return MOCK_FARMERS;
      }
    }
    return MOCK_FARMERS;
  },

  loginWithMobile(rawMobile: string): Farmer | null {
    const cleaned = rawMobile.replace(/\D/g, '').slice(-10);
    const farmers = this.getAllFarmers();
    const found = farmers.find((f) => f.mobile === cleaned);
    if (found) {
      this.setCurrentFarmer(found);
      return found;
    }
    return null;
  },

  updateFarmerProfile(updated: Farmer): Farmer {
    this.setCurrentFarmer(updated);
    return updated;
  },

  maskMobile(mobile?: string): string {
    if (!mobile) return '******0000';
    const clean = mobile.replace(/\D/g, '');
    const last4 = clean.slice(-4) || '0000';
    return `******${last4}`;
  },

  // Booking & Token Services
  getAllBookings(): Booking[] {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return MOCK_BOOKINGS;
      }
    }
    return MOCK_BOOKINGS;
  },

  getBookingByToken(tokenNumber: string): Booking | undefined {
    const bookings = this.getAllBookings();
    const trimmed = tokenNumber.trim().toUpperCase();
    return bookings.find(
      (b) =>
        b.token_number.toUpperCase() === trimmed ||
        b.id.toUpperCase() === trimmed
    );
  },

  /**
   * Strictly isolates bookings for the authenticated farmer.
   * Returns empty array if no farmerId/farmerMobile is provided or if farmer has no bookings.
   */
  getFarmerBookings(farmerId?: string, farmerMobile?: string): Booking[] {
    if (!farmerId && !farmerMobile) return [];
    const bookings = this.getAllBookings();
    return bookings.filter((b) => {
      if (farmerId && b.farmer_id === farmerId) return true;
      if (farmerMobile && b.farmer_mobile && b.farmer_mobile === farmerMobile) return true;
      return false;
    });
  },

  /**
   * Retrieves the most recent booking belonging strictly to the authenticated farmer.
   * Never falls back to other farmers' bookings.
   */
  getLatestBookingForFarmer(farmerId?: string, farmerMobile?: string): Booking | undefined {
    if (!farmerId && !farmerMobile) return undefined;
    const farmerBookings = this.getFarmerBookings(farmerId, farmerMobile);
    return farmerBookings.length > 0 ? farmerBookings[0] : undefined;
  },

  /**
   * Look up a booking token strictly within the authenticated farmer's own records.
   * Prevents User B from querying User A's token.
   */
  getBookingByTokenForFarmer(tokenNumber: string, farmerId?: string, farmerMobile?: string): Booking | undefined {
    if (!tokenNumber) return undefined;
    const b = this.getBookingByToken(tokenNumber);
    if (!b) return undefined;
    if (farmerId || farmerMobile) {
      const isOwner = (farmerId && b.farmer_id === farmerId) ||
                      (farmerMobile && b.farmer_mobile && b.farmer_mobile === farmerMobile);
      if (!isOwner) return undefined;
    }
    return b;
  },

  createBooking(params: {
    farmer: Farmer;
    center: ProcurementCenter;
    crop: Crop;
    date: string;
    slotId: string;
    slotTime: string;
    estimatedQuantityQuintals: number;
  }): Booking {
    const bookings = this.getAllBookings();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const tokenNumber = `AV-2026-00${randomSuffix}`;
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bkg-${Date.now()}`;

    const newBooking: Booking = {
      id: newId,
      token_number: tokenNumber,
      farmer_id: params.farmer.id,
      farmer_name: params.farmer.full_name,
      farmer_mobile: params.farmer.mobile,
      district_id: params.center.district_id,
      taluk_id: params.center.taluk_id,
      center_id: params.center.id,
      center_name: params.center.name,
      center_address: params.center.address,
      crop_id: params.crop.id,
      crop_name: params.crop.name,
      date: params.date,
      slot_id: params.slotId,
      slot_time: params.slotTime,
      estimated_quantity_quintals: params.estimatedQuantityQuintals,
      status: 'Booking Confirmed',
      created_at: new Date().toISOString(),
      timeline: [
        {
          status: 'Booking Confirmed',
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          completed: true,
          current: true,
          note: 'Slot booked successfully. Token issued.',
        },
        { status: 'Farmer Arrived', completed: false, current: false },
        { status: 'Quality Check', completed: false, current: false },
        { status: 'Procurement Processing', completed: false, current: false },
        { status: 'Procurement Completed', completed: false, current: false },
      ],
    };

    const updated = [newBooking, ...bookings];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return newBooking;
  },

  updateBookingStatus(tokenNumber: string, newStatus: ProcurementStatus, note?: string): Booking | null {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(
      (b) => b.token_number.toUpperCase() === tokenNumber.toUpperCase()
    );
    if (index === -1) return null;

    const b = { ...bookings[index] };
    b.status = newStatus;

    const statusOrder: ProcurementStatus[] = [
      'Booking Confirmed',
      'Farmer Arrived',
      'Quality Check',
      'Procurement Processing',
      'Procurement Completed',
    ];

    const targetIndex = statusOrder.indexOf(newStatus);

    b.timeline = statusOrder.map((st, idx) => {
      const isCompleted = idx < targetIndex || (idx === targetIndex && newStatus === 'Procurement Completed');
      const isCurrent = idx === targetIndex && newStatus !== 'Procurement Completed';
      const existingTimeline = b.timeline.find((t) => t.status === st);
      return {
        status: st,
        timestamp:
          existingTimeline?.timestamp ||
          (idx <= targetIndex
            ? new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : undefined),
        completed: isCompleted,
        current: isCurrent,
        note: idx === targetIndex && note ? note : existingTimeline?.note,
      };
    });

    bookings[index] = b;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // If completed, record procurement
    if (newStatus === 'Procurement Completed') {
      const records = this.getAllProcurementRecords();
      const crop = MOCK_CROPS.find((c) => c.id === b.crop_id);
      const mspRate = crop?.msp_price_inr || 2200;
      const total = Math.round(b.estimated_quantity_quintals * mspRate);

      if (!records.find((r) => r.token_number === b.token_number)) {
        const newRecord: ProcurementRecord = {
          id: `rec-${Date.now()}`,
          booking_id: b.id,
          token_number: b.token_number,
          farmer_name: b.farmer_name,
          crop_name: b.crop_name,
          center_name: b.center_name,
          date: b.date,
          quantity_quintals: b.estimated_quantity_quintals,
          quality_grade: 'Grade A',
          total_amount_inr: total,
          status: 'Completed',
        };
        records.unshift(newRecord);
        localStorage.setItem(STORAGE_KEYS.PROCUREMENT, JSON.stringify(records));
      }
    }

    return b;
  },

  acceptAllTokensAutomatically(): number {
    const bookings = this.getAllBookings();
    let count = 0;
    for (const b of bookings) {
      if (b.status !== 'Procurement Completed' && b.status !== 'Cancelled') {
        const nextStatus: ProcurementStatus =
          b.status === 'Booking Confirmed'
            ? 'Farmer Arrived'
            : b.status === 'Farmer Arrived'
            ? 'Quality Check'
            : b.status === 'Quality Check'
            ? 'Procurement Processing'
            : 'Procurement Completed';
        this.updateBookingStatus(b.token_number, nextStatus);
        count++;
      }
    }
    return count;
  },

  // Procurement Records
  getAllProcurementRecords(): ProcurementRecord[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PROCUREMENT);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return MOCK_PROCUREMENT_RECORDS;
      }
    }
    return MOCK_PROCUREMENT_RECORDS;
  },

  // Staff Dashboard Statistics
  getStaffStats() {
    const farmers = this.getAllFarmers();
    const centers = MOCK_CENTRES;
    const bookings = this.getAllBookings();
    const records = this.getAllProcurementRecords();

    const todayStr = '2026-09-15'; // Default mock today or current
    const todaysBookings = bookings.filter((b) => b.date === todayStr || b.date === '2026-09-12').length;
    const pendingProcurement = bookings.filter(
      (b) => b.status !== 'Procurement Completed' && b.status !== 'Cancelled'
    ).length;
    const completedProcurement = bookings.filter(
      (b) => b.status === 'Procurement Completed'
    ).length;

    const totalQuintals = records.reduce((acc, r) => acc + r.quantity_quintals, 0);
    const totalPayoutInr = records.reduce((acc, r) => acc + r.total_amount_inr, 0);

    return {
      registeredFarmers: farmers.length,
      procurementCentres: centers.length,
      todaysBookings: todaysBookings || 8,
      pendingProcurement: pendingProcurement || 14,
      completedProcurement: completedProcurement || 29,
      totalProcuredQuintals: totalQuintals,
      totalPayoutInr: totalPayoutInr,
    };
  },

  // Crop Assessment Report Storage
  saveCropAssessmentReport(report: CropAssessmentReport): void {
    if (typeof window === 'undefined') return;
    const reports = this.getCropAssessmentReports();
    const existingIndex = reports.findIndex((r) => r.id === report.id);
    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.unshift(report);
    }
    localStorage.setItem(STORAGE_KEYS.CROP_REPORTS, JSON.stringify(reports));
  },

  getCropAssessmentReports(farmerId?: string): CropAssessmentReport[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.CROP_REPORTS);
    if (!stored) return [];
    try {
      const reports: CropAssessmentReport[] = JSON.parse(stored);
      if (farmerId) {
        return reports.filter((r) => r.farmer_id === farmerId);
      }
      return reports;
    } catch (e) {
      return [];
    }
  },

  /**
   * Retrieve all farmer crop assessment reports sent to a specific procurement centre
   */
  getCropAssessmentReportsByCenter(centerIdentifier?: string): CropAssessmentReport[] {
    const all = this.getCropAssessmentReports();
    if (!centerIdentifier) return all;
    const term = centerIdentifier.toLowerCase().trim();
    return all.filter((r) => {
      const matchId = r.center_id && r.center_id.toLowerCase() === term;
      const matchName = r.center_name && (
        r.center_name.toLowerCase().includes(term) ||
        term.includes(r.center_name.toLowerCase())
      );
      return matchId || matchName;
    });
  },

  /**
   * Retrieve all bookings scheduled for a specific procurement centre
   */
  getBookingsByCenter(centerIdentifier?: string): Booking[] {
    const all = this.getAllBookings();
    if (!centerIdentifier) return all;
    const term = centerIdentifier.toLowerCase().trim();
    return all.filter((b) => {
      const matchId = b.center_id && b.center_id.toLowerCase() === term;
      const matchName = b.center_name && (
        b.center_name.toLowerCase().includes(term) ||
        term.includes(b.center_name.toLowerCase())
      );
      return matchId || matchName;
    });
  },
};

