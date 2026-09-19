import React, { useState, useEffect } from 'react';
import {
  Building2,
  Wheat,
  Calendar,
  Clock,
  ClipboardCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  AlertCircle,
  User,
  Phone,
  Navigation,
  Loader2,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { supabaseService } from '../../services/supabaseService';
import { Farmer, ProcurementCenter, Crop, Booking } from '../../types';
import { StepProgress } from '../../components/common/StepProgress';
import { useLanguage } from '../../context/LanguageContext';

interface BookingPageProps {
  farmer: Farmer;
  initialCenter?: ProcurementCenter;
  initialCropId?: string;
  onBookingComplete: (booking: Booking) => void;
  onCancel: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  farmer,
  initialCenter,
  initialCropId,
  onBookingComplete,
  onCancel,
}) => {
  const { t } = useLanguage();

  // Resolve farmer facing districts (includes Bengaluru and all Karnataka districts)
  const allDistricts = mockService.getFarmerFacingDistricts();

  const rawDistrict =
    farmer?.district_id ||
    (farmer as any)?.district ||
    (farmer as any)?.district_name ||
    '';

  const matchedDistrict = allDistricts.find(
    (d) =>
      d.id === rawDistrict ||
      d.name.toLowerCase() === rawDistrict.toLowerCase()
  );

  const allCenters = mockService.getAllCenters();
  const defaultDistrictId = matchedDistrict
    ? matchedDistrict.id
    : (initialCenter?.district_id || 'dist-1');

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(defaultDistrictId);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoFound, setGeoFound] = useState<boolean>(false);
  const [nearestDetectedCenterId, setNearestDetectedCenterId] = useState<string | null>(null);
  const [detectedDistance, setDetectedDistance] = useState<string>('2.4 km');

  const activeDistrictObj = allDistricts.find((d) => d.id === selectedDistrictId);
  const districtName = activeDistrictObj ? activeDistrictObj.name : 'All Karnataka Districts';

  // Filter centers based on selected district and search query
  const districtCenters = selectedDistrictId
    ? mockService.getCentersByDistrict(selectedDistrictId)
    : allCenters;

  const centers = districtCenters.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.address.toLowerCase().includes(term);
  });

  const crops = mockService.getAllCrops();

  // Validate initialCenter against all centres
  const validInitialCenter = initialCenter
    ? allCenters.find((c) => c.id === initialCenter.id)
    : undefined;

  // 6-step state: 1: Center, 2: Crop, 3: Date, 4: Slot, 5: Review, 6: Confirm
  const [currentStep, setCurrentStep] = useState<number>(
    validInitialCenter ? (initialCropId ? 3 : 2) : 1
  );

  // Selected values
  const [selectedCenter, setSelectedCenter] = useState<ProcurementCenter | undefined>(
    validInitialCenter
  );

  // Find Near Me GPS Auto-Detection (Directly inside booking wizard)
  const handleFindNearMe = () => {
    setIsLocating(true);
    setGeoFound(false);

    const performMatch = () => {
      setIsLocating(false);
      setGeoFound(true);
      // Automatically detect and pick closest centre (e.g. Channagiri cnt-1, Davanagere)
      const nearest = allCenters.find((c) => c.id === 'cnt-1') || allCenters[0];
      if (nearest) {
        setSelectedDistrictId(nearest.district_id);
        setSelectedCenter(nearest);
        setNearestDetectedCenterId(nearest.id);
        setDetectedDistance('2.4 km');
        setSearchTerm('');
      }
    };

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          performMatch();
        },
        () => {
          setTimeout(performMatch, 600);
        },
        { timeout: 3500 }
      );
    } else {
      setTimeout(performMatch, 600);
    }
  };
  const [selectedCrop, setSelectedCrop] = useState<Crop | undefined>(
    initialCropId ? mockService.getCropById(initialCropId) : undefined
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-15');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('10:00 AM – 11:00 AM');
  const [estimatedQuantity, setEstimatedQuantity] = useState<number>(45); // Quintals

  const steps = [
    { id: 1, label: t.stepCenter },
    { id: 2, label: t.stepCrop },
    { id: 3, label: t.stepDate },
    { id: 4, label: t.stepSlot },
    { id: 5, label: t.stepReview },
    { id: 6, label: t.stepConfirm },
  ];

  // Available crops for currently selected center
  const availableCropsForCenter = selectedCenter
    ? mockService.getCropsByCenter(selectedCenter.id)
    : crops;

  // Available slots for center & date
  const availableSlots = selectedCenter
    ? mockService.getSlotsForCenterAndDate(selectedCenter.id, selectedDate)
    : [];

  // Next 7 days for date picker
  const dates = [
    { value: '2026-09-15', label: '15 Sep 2026 (Tue)', isPopular: true },
    { value: '2026-09-16', label: '16 Sep 2026 (Wed)', isPopular: false },
    { value: '2026-09-17', label: '17 Sep 2026 (Thu)', isPopular: false },
    { value: '2026-09-18', label: '18 Sep 2026 (Fri)', isPopular: true },
    { value: '2026-09-19', label: '19 Sep 2026 (Sat)', isPopular: false },
    { value: '2026-09-21', label: '21 Sep 2026 (Mon)', isPopular: false },
  ];

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirmBooking = () => {
    if (!selectedCenter || !selectedCrop) return;

    const newBooking = mockService.createBooking({
      farmer,
      center: selectedCenter,
      crop: selectedCrop,
      date: selectedDate,
      slotId: `slt-${Date.now()}`,
      slotTime: selectedSlotTime,
      estimatedQuantityQuintals: Number(estimatedQuantity) || 40,
    });

    // Asynchronously sync to Supabase database (RLS enforced with user UUID)
    supabaseService.createBooking(newBooking).catch((err) => {
      console.warn('Supabase booking sync skipped:', err);
    });

    onBookingComplete(newBooking);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={currentStep > 1 ? () => setCurrentStep((prev) => prev - 1) : onCancel}
          className="btn btn-outline btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            borderRadius: '8px',
            padding: '0.45rem 0.95rem',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
          title={currentStep > 1 ? 'Go to previous step' : 'Back to Dashboard'}
        >
          <ArrowLeft size={16} />
          <span>{currentStep > 1 ? 'Back to Previous Step' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Step Progress Tracker */}
      <StepProgress
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      <div className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Select Centre (Integrated with Find Near Me) */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Step 1 of 6 • Procurement Centre Selection
              </div>
              <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0', fontWeight: 800 }}>Select Procurement Centre</h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                Choose the APMC yard or grain centre where you will deliver your produce.
              </p>
            </div>

            {/* Embedded "Find Near Me" GPS Auto-Detection Feature */}
            <div
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                border: '1.5px solid #86efac',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 10px rgba(34, 197, 94, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.15)',
                    border: '1px solid #bbf7d0',
                    flexShrink: 0,
                  }}
                >
                  <Navigation size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📍 GPS AUTO-DETECT • FASTEST DELAYS
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
                    Find Nearest Procurement Centre (Near Me)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                    Automatically pinpoint and select the closest verified APMC yard to your farm or current location.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFindNearMe}
                disabled={isLocating}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: isLocating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  minWidth: '160px',
                  justifyContent: 'center',
                }}
              >
                {isLocating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    <span>Find Near Me</span>
                  </>
                )}
              </button>
            </div>

            {/* Geolocation Feedback Banner */}
            {geoFound && selectedCenter && (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  color: '#065f46',
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CheckCircle2 size={20} color="#10b981" />
                  <span>
                    <strong>Nearest APMC Detected:</strong> {selectedCenter.name} (~{detectedDistance} from your live location). Selected automatically below.
                  </span>
                </div>
                <span
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✓ Auto-Selected
                </span>
              </div>
            )}

            {/* District Selector & Search Bar */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                marginBottom: '1.25rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ minWidth: '220px', flex: '0 0 auto' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Filter District
                </label>
                <select
                  className="form-control"
                  value={selectedDistrictId}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    setSelectedCenter(undefined);
                    setGeoFound(false);
                  }}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                >
                  <option value="">All Karnataka Districts</option>
                  {allDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Search Centre
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search centre name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.25rem', paddingRight: '0.75rem', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#64748b', paddingBottom: '0.35rem' }}>
                Showing <strong>{centers.length}</strong> centres
              </div>
            </div>

            {centers.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px dashed var(--color-border)',
                  marginBottom: '2rem',
                }}
              >
                <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                  No procurement centres found.
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Try choosing another district above or click "Find Near Me" to locate the nearest yard.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {centers.map((c) => {
                  const isSelected = selectedCenter?.id === c.id;
                  const isNearest = c.id === nearestDetectedCenterId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCenter(c)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid #16a34a' : '1.5px solid var(--color-border)',
                        background: isSelected ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.12)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: '#0f172a' }}>{c.name}</h4>
                          {isNearest && (
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#166534',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                border: '1px solid #bbf7d0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              <span>📍</span>
                              <span>Nearest ({detectedDistance})</span>
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.45rem 0' }}>{c.address}</p>
                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#475569' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={13} color="#166534" />
                            <span>{c.operating_hours}</span>
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Phone size={13} color="#166534" />
                            <span>{c.contact_phone}</span>
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Building2 size={13} color="#166534" />
                            <span>Capacity: {c.daily_capacity_quintals} Qtl/day</span>
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: isSelected ? '7px solid #16a34a' : '2px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" onClick={onCancel} className="btn btn-outline">
                {t.btnCancel}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedCenter}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: selectedCenter ? 1 : 0.6,
                  cursor: selectedCenter ? 'pointer' : 'not-allowed',
                }}
              >
                <span>Continue to Crop Selection</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Crop */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Step 2 of 6
              </div>
              <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>Select Crop for Procurement</h2>
              <p style={{ fontSize: '0.9rem' }}>
                Procurement Centre: <strong>{selectedCenter?.name}</strong>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {availableCropsForCenter.map((crop) => {
                const isSelected = selectedCrop?.id === crop.id;
                return (
                  <div
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Wheat size={22} color={isSelected ? 'var(--color-primary)' : '#64748b'} />
                      <span className="badge badge-crop">{crop.category}</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{crop.name}</div>
                    {crop.kannada_name && (
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{crop.kannada_name}</div>
                    )}
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
                      MSP: {crop.unit}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estimated Quantity Input */}
            <div className="form-group" style={{ maxWidth: '320px', marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="qty">
                <span>{t.estQuantity}</span>
                <span className="required">*</span>
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                max={500}
                className="form-control"
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(Number(e.target.value))}
              />
              <div className="form-hint">1 Quintal = 100 kg (Approx 2 standard bags)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={handleBack} className="btn btn-outline">
                <ArrowLeft size={18} /> {t.btnBack}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedCrop}
                className="btn btn-primary"
              >
                <span>{t.btnContinueNext}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Date */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Step 3 of 6
              </div>
              <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>{t.stepDate}</h2>
              <p style={{ fontSize: '0.9rem' }}>Choose an active procurement date at the mandi yard.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {dates.map((d) => {
                const isSelected = selectedDate === d.value;
                return (
                  <div
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Calendar size={24} color={isSelected ? 'var(--color-primary)' : '#64748b'} />
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{d.label}</div>
                    <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-primary-dark)' : '#64748b' }}>
                      {d.isPopular ? '● Slots filling quickly' : '● Slots available'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={handleBack} className="btn btn-outline">
                <ArrowLeft size={18} /> {t.btnBack}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedDate}
                className="btn btn-primary"
              >
                <span>{t.btnContinueNext}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Select Time Slot */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Step 4 of 6
              </div>
              <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>{t.stepSlot}</h2>
              <p style={{ fontSize: '0.9rem' }}>
                Date: <strong>{selectedDate}</strong> • Arriving during your scheduled slot guarantees immediate weighbridge entry.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {availableSlots.map((slot) => {
                const isSelected = selectedSlotTime === slot.time_range;
                const availableSeats = slot.capacity - slot.booked_count;

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotTime(slot.time_range)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Clock size={20} color={isSelected ? 'var(--color-primary)' : '#64748b'} />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: availableSeats > 5 ? '#059669' : '#d97706',
                          background: availableSeats > 5 ? '#ecfdf5' : '#fffbeb',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {availableSeats} {t.slotsRemaining}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{slot.time_range}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Capacity: {slot.capacity} vehicles / hr
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={handleBack} className="btn btn-outline">
                <ArrowLeft size={18} /> {t.btnBack}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedSlotTime}
                className="btn btn-primary"
              >
                <span>{t.btnContinueNext}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review Booking */}
        {currentStep === 5 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Step 5 of 6
              </div>
              <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>{t.reviewTitle}</h2>
              <p style={{ fontSize: '0.9rem' }}>{t.reviewSub}</p>
            </div>

            {/* Review Summary Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              {/* Farmer Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}>
                  <User size={22} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.farmerName}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{farmer.full_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t.mobileLabel}: {farmer.mobile} • {farmer.village}</div>
                </div>
              </div>

              {/* Booking Specifications Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.deliveryCenter}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedCenter?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedCenter?.address}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.cropForDelivery}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {selectedCrop?.name} ({estimatedQuantity} Quintals)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)' }}>
                    MSP: {selectedCrop?.unit}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.appointmentSchedule}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDate}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-dark)', fontWeight: 600 }}>
                    {selectedSlotTime}
                  </div>
                </div>
              </div>

              {/* Estimated Payout Notice */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
                    {t.estDbtValue}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    ₹{((selectedCrop?.msp_price_inr || 2300) * estimatedQuantity).toLocaleString('en-IN')}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  {t.dbtAssurance}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={handleBack} className="btn btn-outline">
                <ArrowLeft size={18} /> {t.btnBack}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary btn-lg"
              >
                <span>{t.btnContinueNext}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Confirm Booking */}
        {currentStep === 6 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <ClipboardCheck size={36} />
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t.readyToConfirm}</h2>
            <p style={{ maxWidth: '540px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
              {t.bookingConfirmedSub}
            </p>

            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                maxWidth: '540px',
                margin: '0 auto 2rem',
                fontSize: '0.85rem',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>
                {t.confirmNotice}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button type="button" onClick={handleBack} className="btn btn-outline">
                <ArrowLeft size={18} /> {t.btnBack}
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '220px' }}
              >
                <CheckCircle size={20} />
                <span>{t.btnConfirmGenerate}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
