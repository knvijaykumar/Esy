import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Home,
  Globe,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Language, Farmer } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

interface FarmerRegistrationPageProps {
  onRegistrationSuccess: (farmer: Farmer) => void;
  onCancel: () => void;
  onGoLogin: () => void;
}

export const FarmerRegistrationPage: React.FC<FarmerRegistrationPageProps> = ({
  onRegistrationSuccess,
  onCancel,
  onGoLogin,
}) => {
  const { t } = useLanguage();
  const districts = mockService.getFarmerFacingDistricts();

  // Personal Info
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');

  // Location
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');

  // Preferences
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('kn');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState<Farmer | null>(null);

  // Dynamic taluks based on selected district
  const availableTaluks = selectedDistrict
    ? mockService.getTaluksByDistrict(selectedDistrict)
    : [];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedTaluk(''); // Reset dependent taluk
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your Full Name';

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      errs.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!selectedDistrict) errs.district = 'Please select your District';
    if (!selectedTaluk) errs.taluk = 'Please select your Taluk';
    if (!village.trim()) errs.village = 'Please enter your Village name';
    if (!address.trim()) errs.address = 'Please enter your Address';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Check if mobile already exists
    const existingFarmers = mockService.getAllFarmers();
    const isMobileUsed = existingFarmers.some(f => f.mobile === mobile.replace(/\D/g, ''));
    if (isMobileUsed) {
      setErrors({ mobile: 'This mobile number is already registered. Please login.' });
      setIsSubmitting(false);
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newFarmerId = `FMR-00${randomSuffix}`;
    const newUuid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');

    const newFarmer: Farmer = {
      id: newUuid,
      farmer_id: newFarmerId,
      full_name: fullName.trim(),
      mobile: mobile.replace(/\D/g, ''),
      district_id: selectedDistrict,
      taluk_id: selectedTaluk,
      village: village.trim(),
      address: address.trim(),
      preferred_language: preferredLanguage,
      created_at: new Date().toISOString().split('T')[0],
    };

    // Simulate short network delay
    setTimeout(() => {
      mockService.setCurrentFarmer(newFarmer);
      setRegistrationComplete(newFarmer);
      setIsSubmitting(false);
    }, 600);
  };

  const handleDemoFill = () => {
    setFullName('Basavaraj Gowda');
    setMobile('9845123456');
    setSelectedDistrict('dist-bengaluru'); // Use Bengaluru
    // Using a timeout to wait for the district to update and taluks to be available
    setTimeout(() => {
      setSelectedTaluk('tal-19'); // Bengaluru North
    }, 100);
    setVillage('Yelahanka Village');
    setAddress('Main Road, Near Yelahanka APMC');
    setPreferredLanguage('kn');
    setErrors({});
  };

  if (registrationComplete) {
    return (
      <div style={{ maxWidth: '580px', margin: '2rem auto' }}>
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '2.5rem 2rem',
            border: '2px solid var(--color-primary-border)',
            boxShadow: 'var(--shadow-md)',
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
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 0 8px rgba(21, 128, 61, 0.1)',
            }}
          >
            <CheckCircle2 size={42} />
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Registration Complete
          </div>
          <h2 style={{ fontSize: '1.85rem', margin: '0.35rem 0' }}>{t.regSuccessTitle}</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            {t.welcomeFarmer}, <strong>{registrationComplete.full_name}</strong>! {t.regSuccessSubtitle}
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1.5px dashed var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>{t.assignedFarmerId}:</span>
              <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.1rem' }}>
                {registrationComplete.farmer_id}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.labelMobile}:</span>
              <strong>{registrationComplete.mobile}</strong>
            </div>
          </div>

          <button
            onClick={() => onRegistrationSuccess(registrationComplete)}
            className="btn btn-primary btn-lg btn-block"
          >
            <span>{t.btnProceedDashboard}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '1rem auto' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={onCancel}
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
          title="Return to previous page or home"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <img
              src="/bks-logo.png"
              alt="Bharat Krishi Seva"
              style={{
                height: '84px',
                width: '84px',
                objectFit: 'contain',
                borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(21, 128, 61, 0.15)',
              }}
            />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>{t.regTitle}</h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
            {t.regSubtitle}
          </p>

          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              background: 'none',
              border: '1px dashed var(--color-primary)',
              color: 'var(--color-primary-dark)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '0.75rem',
            }}
          >
            {t.autoFillDemo}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Personal Information */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.2rem' }}>
              {t.personalInfoTitle}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
              Provide your details to register on the platform.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regFullName">
              <User size={16} color="var(--color-primary)" />
              <span>{t.labelFullName}</span>
              <span className="required">*</span>
            </label>
            <input
              id="regFullName"
              type="text"
              className="form-control"
              placeholder="e.g. Basavaraj Gowda"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regMobile">
              <Phone size={16} color="var(--color-primary)" />
              <span>{t.labelMobile}</span>
              <span className="required">*</span>
            </label>
            <input
              id="regMobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="form-control"
              placeholder="e.g. 9845123456"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            <div className="form-hint">{t.hintMobile}</div>
            {errors.mobile && <div className="form-error">{errors.mobile}</div>}
          </div>

          {/* Section 2: Location */}
          <div style={{ margin: '1.75rem 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.2rem' }}>
              {t.locationTitle}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
              Helps locate your designated APMC procurement centre.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regDistrict">
              <MapPin size={16} color="var(--color-primary)" />
              <span>{t.labelDistrict}</span>
              <span className="required">*</span>
            </label>
            <select
              id="regDistrict"
              className="form-control"
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="">-- Select District --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
            {errors.district && <div className="form-error">{errors.district}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regTaluk">
              <MapPin size={16} color="var(--color-primary)" />
              <span>{t.labelTaluk}</span>
              <span className="required">*</span>
            </label>
            <select
              id="regTaluk"
              className="form-control"
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">
                {selectedDistrict ? '-- Select Taluk --' : '-- First Select District --'}
              </option>
              {availableTaluks.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  {tItem.name}
                </option>
              ))}
            </select>
            {errors.taluk && <div className="form-error">{errors.taluk}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regVillage">
              <span>{t.labelVillage}</span>
              <span className="required">*</span>
            </label>
            <input
              id="regVillage"
              type="text"
              className="form-control"
              placeholder="e.g. Santhebennur"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
            {errors.village && <div className="form-error">{errors.village}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regAddress">
              <Home size={16} color="var(--color-primary)" />
              <span>{t.labelAddress}</span>
              <span className="required">*</span>
            </label>
            <input
              id="regAddress"
              type="text"
              className="form-control"
              placeholder="e.g. Main Road, Near APMC Sub-Yard"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          {/* Section 3: Preferences */}
          <div style={{ margin: '1.75rem 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.2rem' }}>
              {t.preferencesTitle}
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="regPrefLang">
              <Globe size={16} color="var(--color-primary)" />
              <span>{t.labelPreferredLang}</span>
            </label>
            <select
              id="regPrefLang"
              className="form-control"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Language)}
            >
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg btn-block"
              style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>{t.btnCompleteReg}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {t.alreadyRegistered}{' '}
              </span>
              <button
                type="button"
                onClick={onGoLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {t.loginLink}
              </button>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline btn-block"
            >
              {t.btnCancel}
            </button>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <ShieldCheck size={16} color="var(--color-primary)" />
            <span>Government digital public service</span>
          </div>
        </form>
      </div>
    </div>
  );
};
