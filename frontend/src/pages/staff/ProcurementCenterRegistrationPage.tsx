import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Wheat,
  Scale,
  Globe,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  Lock,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { staffAuthService } from '../../services/staffAuthService';
import { Language } from '../../types';

interface ProcurementCenterRegistrationPageProps {
  onGoLogin: () => void;
  onCancel: () => void;
}

const CENTRE_TYPES = [
  'APMC Market Yard (Principal Yard)',
  'APMC Sub-Market Yard',
  'Primary Agricultural Credit Society (PACS)',
  'Farmer Producer Organisation (FPO) Centre',
  'State Warehousing Corporation (SWC) Depot',
  'Cooperative Marketing Society (TAPCMS)',
  'Government Direct Purchase Centre (DPC)',
];

const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English (EN)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
];

export const ProcurementCenterRegistrationPage: React.FC<ProcurementCenterRegistrationPageProps> = ({
  onGoLogin,
  onCancel,
}) => {
  const allDistricts = [...mockService.getDistricts()].sort((a, b) => a.name.localeCompare(b.name));
  const allCrops = mockService.getAllCrops();

  // Form State
  const [centreName, setCentreName] = useState('');
  const [centreType, setCentreType] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [talukId, setTalukId] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [officialMobile, setOfficialMobile] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>(['crop-1', 'crop-2']); // Default Paddy & Ragi
  const [capacity, setCapacity] = useState('1500');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('kn');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');

  // Dependent Taluks based on selected District
  const availableTaluks = districtId
    ? mockService.getTaluksByDistrict(districtId).sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleDistrictChange = (newDistrictId: string) => {
    setDistrictId(newDistrictId);
    setTalukId(''); // Reset dependent Taluk
  };

  const toggleCrop = (cropId: string) => {
    setSelectedCropIds((prev) =>
      prev.includes(cropId) ? prev.filter((id) => id !== cropId) : [...prev, cropId]
    );
  };

  const handleSelectAllCrops = () => {
    setSelectedCropIds(allCrops.map((c) => c.id));
  };

  const handleClearAllCrops = () => {
    setSelectedCropIds([]);
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!centreName.trim()) {
      errs.centreName = 'Please enter the Procurement Centre Name';
    }
    if (!centreType) {
      errs.centreType = 'Please select the Centre Type';
    }
    if (!districtId) {
      errs.districtId = 'Please select a District';
    }
    if (!talukId) {
      errs.talukId = 'Please select a Taluk';
    }
    if (!address.trim()) {
      errs.address = 'Please enter the complete physical address';
    }
    if (!contactPerson.trim()) {
      errs.contactPerson = 'Please enter the Contact Person Name';
    }

    const cleanMobile = officialMobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      errs.officialMobile = 'Please enter a valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!officialEmail.trim() || !emailRegex.test(officialEmail.trim())) {
      errs.officialEmail = 'Please enter a valid official email address';
    }

    if (!password.trim()) {
      errs.password = 'Please create a login password';
    } else if (password.trim().length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (selectedCropIds.length === 0) {
      errs.crops = 'Please select at least one operating crop';
    }

    if (!capacity.trim() || Number(capacity) <= 0) {
      errs.capacity = 'Please enter a valid handling capacity in Quintals';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Mock submission delay
    setTimeout(() => {
      const refId = `REG-KA-APMC-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRefId(refId);

      // Register staff credentials so user can log in with their registered email
      staffAuthService.registerStaff({
        name: contactPerson,
        email: officialEmail,
        password: password,
        mobile: officialMobile,
        centreName: centreName,
        centreType: centreType,
        districtId: districtId,
        talukId: talukId,
        role: 'Center Manager',
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  // -------------------------------------------------------------
  // SUCCESS SCREEN
  // -------------------------------------------------------------
  if (isSubmitted) {
    const districtName = allDistricts.find((d) => d.id === districtId)?.name || districtId;
    const talukName = availableTaluks.find((t) => t.id === talukId)?.name || talukId;

    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
        <div
          className="card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            borderTop: '5px solid var(--color-primary)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '2px solid #bbf7d0',
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem',
            }}
          >
            Karnataka State Agricultural Marketing Board
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Registration Submitted
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#334155',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0 auto 1.75rem',
              fontWeight: 500,
            }}
          >
            Your procurement centre registration has been submitted for verification. Access will be activated after approval.
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Application Reference ID
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {submittedRefId}
                </div>
              </div>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                Under Verification
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Centre Name</div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{centreName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Centre Type</div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{centreType}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Location</div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                  {talukName}, {districtName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>In-Charge Contact</div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                  {contactPerson} • {officialMobile}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>
              ✓ Officer Login Credentials Created
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
              Your procurement centre account has been registered. You can now log in using:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>
              {officialEmail}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onGoLogin}
              className="btn btn-primary btn-lg btn-block"
              style={{ fontWeight: 700 }}
            >
              Proceed to Staff Login →
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setCentreName('');
                setAddress('');
                setContactPerson('');
                setOfficialMobile('');
                setOfficialEmail('');
              }}
              className="btn btn-outline btn-block"
            >
              Register Another Centre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REGISTRATION FORM
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: '820px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Top Breadcrumb / Return Action */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={onGoLogin}
          className="btn btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            fontSize: '0.85rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Officer Login</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="card" style={{ padding: '2.5rem 2rem', borderTop: '4px solid var(--color-primary)' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                border: '1px solid var(--color-primary-border)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Officer Portal
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              New Procurement Centre Onboarding
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.4rem 0' }}>
            Register a Procurement Centre
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Submit your APMC Mandi, Primary Agricultural Credit Society (PACS), or Government Facilitation Centre details for portal onboarding.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* SECTION 1: Centre Identification */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <Building2 size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                1. Centre Identification
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Field 1: Procurement Centre Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="centreName">
                  <span>Procurement Centre Name</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="centreName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Harihara APMC Market Yard Centre"
                  value={centreName}
                  onChange={(e) => setCentreName(e.target.value)}
                />
                {errors.centreName && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.centreName}
                  </div>
                )}
              </div>

              {/* Field 2: Centre Type */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="centreType">
                  <span>Centre Type</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="centreType"
                  className="form-control"
                  value={centreType}
                  onChange={(e) => setCentreType(e.target.value)}
                >
                  <option value="">-- Select Centre Type --</option>
                  {CENTRE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.centreType && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.centreType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Location & Jurisdiction */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <MapPin size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                2. Location & Jurisdiction
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {/* Field 3: District */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="district">
                  <span>District</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="district"
                  className="form-control"
                  value={districtId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">-- Select Karnataka District --</option>
                  {allDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.districtId && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.districtId}
                  </div>
                )}
              </div>

              {/* Field 4: Taluk (Dependent on District) */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="taluk">
                  <span>Taluk</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="taluk"
                  className="form-control"
                  value={talukId}
                  onChange={(e) => setTalukId(e.target.value)}
                  disabled={!districtId}
                  style={!districtId ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : {}}
                >
                  <option value="">
                    {districtId ? '-- Select Taluk --' : '-- Please select District first --'}
                  </option>
                  {availableTaluks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.talukId && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.talukId}
                  </div>
                )}
              </div>
            </div>

            {/* Field 5: Physical Address */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="address">
                <span>Address</span>
                <span className="required">*</span>
              </label>
              <textarea
                id="address"
                className="form-control"
                rows={2}
                placeholder="Enter complete physical address of the APMC market yard / facility..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.address}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Official In-Charge Contact */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <User size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                3. Official In-Charge Contact
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* Field 6: Contact Person Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="contactPerson">
                  <span>Contact Person Name</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Ramesh Patil (Secretary)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
                {errors.contactPerson && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.contactPerson}
                  </div>
                )}
              </div>

              {/* Field 7: Official Mobile Number */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="officialMobile">
                  <span>Official Mobile Number</span>
                  <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#64748b',
                    }}
                  >
                    +91
                  </span>
                  <input
                    id="officialMobile"
                    type="tel"
                    maxLength={10}
                    className="form-control"
                    style={{ paddingLeft: '48px' }}
                    placeholder="9876543210"
                    value={officialMobile}
                    onChange={(e) => setOfficialMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
                {errors.officialMobile && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.officialMobile}
                  </div>
                )}
              </div>

              {/* Field 8: Official Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="officialEmail">
                  <span>Official Email</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="officialEmail"
                  type="email"
                  className="form-control"
                  placeholder=""
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                />
                {errors.officialEmail && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.officialEmail}
                  </div>
                )}
              </div>

              {/* Field 9: Portal Password */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="portalPassword">
                  <span>Portal Login Password</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="portalPassword"
                  type="password"
                  className="form-control"
                  placeholder="Create password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.password}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: Operations & Crops */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <Wheat size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                4. Operations, Capacity & Language
              </h3>
            </div>

            {/* Field 9: Operating Crops */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <span>Operating Crops</span>
                  <span className="required">*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={handleSelectAllCrops}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Select All
                  </button>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <button
                    type="button"
                    onClick={handleClearAllCrops}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '0.65rem',
                  marginTop: '0.4rem',
                }}
              >
                {allCrops.map((crop) => {
                  const isSelected = selectedCropIds.includes(crop.id);
                  return (
                    <div
                      key={crop.id}
                      onClick={() => toggleCrop(crop.id)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                        background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--color-primary-dark)' : '#1e293b' }}>
                          {crop.name}
                        </div>
                        {crop.kannada_name && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {crop.kannada_name.split(' ')[0]}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isSelected ? '1.5px solid var(--color-primary)' : '1.5px solid #cbd5e1',
                          background: isSelected ? 'var(--color-primary)' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <CheckCircle2 size={14} color="#ffffff" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.crops && (
                <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  {errors.crops}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Field 10: Centre Capacity */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="capacity">
                  <Scale size={16} color="var(--color-primary)" />
                  <span>Daily Handling Capacity (Quintals)</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="capacity"
                  type="number"
                  min={50}
                  max={50000}
                  step={50}
                  className="form-control"
                  placeholder="e.g. 1500"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <div className="form-hint">1 Quintal = 100 kg. Enter standard daily throughput.</div>
                {errors.capacity && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.capacity}
                  </div>
                )}
              </div>

              {/* Field 11: Preferred Language */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="preferredLanguage">
                  <Globe size={16} color="var(--color-primary)" />
                  <span>Preferred Communication Language</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="preferredLanguage"
                  className="form-control"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="form-hint">Portal notifications and official correspondence language.</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              style={{ minWidth: '130px' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '240px', fontWeight: 700 }}
            >
              {isSubmitting ? (
                <span>Submitting Registration...</span>
              ) : (
                <>
                  <Building2 size={18} />
                  <span>Submit Centre Registration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
