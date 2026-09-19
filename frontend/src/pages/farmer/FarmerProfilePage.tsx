import React, { useState } from 'react';
import {
  User,
  Phone,
  CreditCard,
  MapPin,
  Home,
  Globe,
  Calendar,
  Edit,
  Save,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Farmer, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FarmerProfilePageProps {
  farmer: Farmer;
  onProfileUpdated: (updated: Farmer) => void;
  onLogout?: () => void;
}

export const FarmerProfilePage: React.FC<FarmerProfilePageProps> = ({
  farmer,
  onProfileUpdated,
  onLogout,
}) => {
  const { t } = useLanguage();
  const districts = mockService.getFarmerFacingDistricts();

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Editable fields
  const [fullName, setFullName] = useState(farmer.full_name);
  const [mobile, setMobile] = useState(farmer.mobile);
  const [districtId, setDistrictId] = useState(farmer.district_id);
  const [talukId, setTalukId] = useState(farmer.taluk_id);
  const [village, setVillage] = useState(farmer.village);
  const [address, setAddress] = useState(farmer.address || '');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(farmer.preferred_language);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTaluks = districtId ? mockService.getTaluksByDistrict(districtId) : [];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictId(e.target.value);
    setTalukId('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName(farmer.full_name);
    setMobile(farmer.mobile);
    setDistrictId(farmer.district_id);
    setTalukId(farmer.taluk_id);
    setVillage(farmer.village);
    setAddress(farmer.address || '');
    setPreferredLanguage(farmer.preferred_language);
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name cannot be blank.';
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) errs.mobile = 'Mobile number must be 10 digits.';
    if (!districtId) errs.district = 'Select a district.';
    if (!talukId) errs.taluk = 'Select a taluk.';
    if (!village.trim()) errs.village = 'Village cannot be blank.';
    if (!address.trim()) errs.address = 'Address cannot be blank.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedFarmer: Farmer = {
      ...farmer,
      full_name: fullName.trim(),
      mobile: mobile.replace(/\D/g, ''),
      district_id: districtId,
      taluk_id: talukId,
      village: village.trim(),
      address: address.trim(),
      preferred_language: preferredLanguage,
    };

    const result = mockService.updateFarmerProfile(updatedFarmer);
    onProfileUpdated(result);
    setIsEditing(false);
    setSuccessMessage(t.profileUpdatedSuccess);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const districtObj = districts.find((d) => d.id === farmer.district_id);
  const talukObj = mockService.getTaluksByDistrict(farmer.district_id).find((talItem) => talItem.id === farmer.taluk_id);

  const getLangDisplay = (l: Language) => {
    switch (l) {
      case 'kn': return 'ಕನ್ನಡ (Kannada)';
      case 'hi': return 'हिन्दी (Hindi)';
      case 'te': return 'తెలుగు (Telugu)';
      case 'ta': return 'தமிழ் (Tamil)';
      case 'mr': return 'मराठी (Marathi)';
      default: return 'English (EN)';
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
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
          title="Return to previous page"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Title & Edit Profile Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>{t.profileTitle}</h1>
          <p style={{ fontSize: '0.95rem' }}>
            {t.profileSubtitle}
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            <Edit size={16} />
            <span>{t.btnEditProfile}</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.925rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* VIEW MODE */}
      {!isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Card with Avatar */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                border: '2px solid var(--color-primary-border)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={38} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem' }}>{farmer.full_name}</h2>
                <span
                  style={{
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary-dark)',
                    border: '1px solid var(--color-primary-border)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {farmer.farmer_id || 'FMR-00125'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Registered Producer • District: <strong>{districtObj?.name || 'Davanagere'}</strong>
              </div>
            </div>
          </div>

          {/* Section 1: Personal Information */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <User size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.15rem' }}>{t.personalInfoTitle}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.labelFullName}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>{farmer.full_name}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.mobileLabel}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>{farmer.mobile}</div>
              </div>


            </div>
          </div>

          {/* Section 2: Location */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <MapPin size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.15rem' }}>{t.locationTitle}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.labelDistrict}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  {districtObj?.name || 'Davanagere'} ({districtObj?.state || 'Karnataka'})
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.labelTaluk}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  {talukObj?.name || 'Channagiri'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.labelVillage}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>{farmer.village}</div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.labelAddress}</div>
                <div style={{ fontSize: '1rem', marginTop: '0.2rem', color: 'var(--color-text-main)' }}>
                  {farmer.address || `${farmer.village}, ${talukObj?.name || 'Channagiri'}, ${districtObj?.name || 'Davanagere'}`}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Preferences & Account Information */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Preferences */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <Globe size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>{t.preferencesTitle}</h3>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.labelPreferredLang}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  {getLangDisplay(farmer.preferred_language)}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>{t.accountInfoTitle}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.farmerIdLabel}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {farmer.farmer_id || 'FMR-00125'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t.regDateLabel}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {farmer.created_at || '2026-08-12'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Logout Action */}
          {onLogout && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-outline"
                style={{
                  borderColor: '#fca5a5',
                  color: '#b91c1c',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <LogOut size={18} />
                <span>{t.logout || 'Logout from Account'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* EDIT PROFILE MODE */
        <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>{t.btnEditProfile}</h2>
              <p style={{ fontSize: '0.85rem' }}>{t.profileSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline btn-sm"
            >
              <X size={16} /> {t.btnCancel}
            </button>
          </div>

          <div className="grid-2" style={{ gap: '1.25rem' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="editFullName">
                <User size={16} color="var(--color-primary)" />
                <span>{t.labelFullName}</span>
                <span className="required">*</span>
              </label>
              <input
                id="editFullName"
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <div className="form-error">{errors.fullName}</div>}
            </div>

            {/* Mobile Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="editMobile">
                <Phone size={16} color="var(--color-primary)" />
                <span>{t.labelMobile}</span>
                <span className="required">*</span>
              </label>
              <input
                id="editMobile"
                type="tel"
                maxLength={10}
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              />
              {errors.mobile && <div className="form-error">{errors.mobile}</div>}
            </div>



            {/* Preferred Language */}
            <div className="form-group">
              <label className="form-label" htmlFor="editLang">
                <Globe size={16} color="var(--color-primary)" />
                <span>{t.labelPreferredLang}</span>
              </label>
              <select
                id="editLang"
                className="form-control"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
              >
                <option value="en">English (EN)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label" htmlFor="editDistrict">
                <MapPin size={16} color="var(--color-primary)" />
                <span>{t.labelDistrict}</span>
                <span className="required">*</span>
              </label>
              <select
                id="editDistrict"
                className="form-control"
                value={districtId}
                onChange={handleDistrictChange}
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && <div className="form-error">{errors.district}</div>}
            </div>

            {/* Taluk */}
            <div className="form-group">
              <label className="form-label" htmlFor="editTaluk">
                <MapPin size={16} color="var(--color-primary)" />
                <span>{t.labelTaluk}</span>
                <span className="required">*</span>
              </label>
              <select
                id="editTaluk"
                className="form-control"
                value={talukId}
                onChange={(e) => setTalukId(e.target.value)}
              >
                <option value="">-- {t.hierTaluk} --</option>
                {availableTaluks.map((tItem) => (
                  <option key={tItem.id} value={tItem.id}>
                    {tItem.name}
                  </option>
                ))}
              </select>
              {errors.taluk && <div className="form-error">{errors.taluk}</div>}
            </div>

            {/* Village */}
            <div className="form-group">
              <label className="form-label" htmlFor="editVillage">
                <span>{t.labelVillage}</span>
                <span className="required">*</span>
              </label>
              <input
                id="editVillage"
                type="text"
                className="form-control"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
              {errors.village && <div className="form-error">{errors.village}</div>}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="editAddress">
                <Home size={16} color="var(--color-primary)" />
                <span>{t.labelAddress}</span>
                <span className="required">*</span>
              </label>
              <input
                id="editAddress"
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>
          </div>

          {/* Buttons: Save Changes & Cancel */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{t.btnSaveChanges}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
