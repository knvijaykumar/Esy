import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Filter,
  CheckCircle2,
  Wheat,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { District, Taluk, ProcurementCenter, Crop } from '../../types';
import { CenterCard } from '../../components/farmer/CenterCard';
import { useLanguage } from '../../context/LanguageContext';

interface FindCenterPageProps {
  onCenterSelected: (center: ProcurementCenter, cropId?: string) => void;
}

export const FindCenterPage: React.FC<FindCenterPageProps> = ({ onCenterSelected }) => {
  const { t } = useLanguage();
  const districts = mockService.getFarmerFacingDistricts();

  // Hierarchy Selection State
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist-1'); // Default Davanagere for convenient demo
  const [selectedTalukId, setSelectedTalukId] = useState<string>('tal-1'); // Default Channagiri
  const [selectedCenterId, setSelectedCenterId] = useState<string>('cnt-1'); // Default Channagiri Centre
  const [selectedCropId, setSelectedCropId] = useState<string>('');

  // Geolocation simulation state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoFound, setGeoFound] = useState<boolean>(false);

  // Derived lists based on selection hierarchy
  const availableTaluks: Taluk[] = selectedDistrictId
    ? mockService.getTaluksByDistrict(selectedDistrictId)
    : [];

  const availableCenters: ProcurementCenter[] = selectedTalukId
    ? mockService.getCentersByTaluk(selectedTalukId)
    : selectedDistrictId
    ? mockService.getCentersByDistrict(selectedDistrictId)
    : [];

  // Currently selected centre object
  const currentCenter = selectedCenterId
    ? mockService.getCenterById(selectedCenterId)
    : undefined;

  // Crops available at the selected centre (or all crops if none selected)
  const availableCrops: Crop[] = currentCenter
    ? mockService.getCropsByCenter(currentCenter.id)
    : mockService.getAllCrops();

  // --- Strict Hierarchy Reset Handlers ---

  // When farmer changes District: Reset Taluk, Reset Centre, Reset Crop
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setSelectedTalukId('');
    setSelectedCenterId('');
    setSelectedCropId('');
    setGeoFound(false);
  };

  // When farmer changes Taluk: Reset Centre, Reset Crop
  const handleTalukChange = (talukId: string) => {
    setSelectedTalukId(talukId);
    setSelectedCenterId('');
    setSelectedCropId('');
    setGeoFound(false);
  };

  // When farmer changes Centre: Reset Crop
  const handleCenterSelect = (center: ProcurementCenter) => {
    setSelectedCenterId(center.id);
    setSelectedCropId(''); // Reset Crop
  };

  // Option 1: "Find Near Me" simulated interaction
  const handleFindNearMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setGeoFound(true);
      // Pre-select the closest centre
      setSelectedDistrictId('dist-1');
      setSelectedTalukId('tal-1');
      setSelectedCenterId('cnt-1');
      setSelectedCropId('');
    }, 800);
  };

  const handleResetFilters = () => {
    setSelectedDistrictId('');
    setSelectedTalukId('');
    setSelectedCenterId('');
    setSelectedCropId('');
    setGeoFound(false);
  };

  const handleProceedToBooking = () => {
    if (!currentCenter) return;
    onCenterSelected(currentCenter, selectedCropId || undefined);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      {/* Page Heading */}
      <div>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>
          {t.findTitle}
        </h1>
        <p style={{ fontSize: '0.95rem' }}>
          {t.findSubtitle}
        </p>
      </div>

      {/* Option 1: Find Near Me Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
          border: '1.5px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#ffffff',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0,
            }}
          >
            <Navigation size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
              {t.opt1NearMe}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{t.btnNearMe}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {t.opt1Desc}
            </p>
          </div>
        </div>

        <button
          onClick={handleFindNearMe}
          disabled={isLocating}
          className="btn btn-secondary btn-lg"
          style={{ minWidth: '180px' }}
        >
          {isLocating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>{t.nearMeLocating}</span>
            </>
          ) : (
            <>
              <Navigation size={18} />
              <span>{t.btnNearMe}</span>
            </>
          )}
        </button>
      </div>

      {/* Geolocation Feedback Banner */}
      {geoFound && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#065f46',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          <Sparkles size={18} />
          <span>
            {t.nearbyFound}
          </span>
        </div>
      )}

      {/* Option 2: Manual Selection Hierarchy */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              {t.opt2Hierarchy}
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>{t.opt2Hierarchy}</h2>
          </div>

          {(selectedDistrictId || selectedTalukId || selectedCenterId || selectedCropId) && (
            <button
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 500,
              }}
            >
              <RotateCcw size={14} /> {t.resetFilters}
            </button>
          )}
        </div>

        {/* Hierarchy Dropdowns: District -> Taluk */}
        <div className="grid-2">
          {/* Step 1: District */}
          <div className="form-group">
            <label className="form-label" htmlFor="filterDistrict">
              <MapPin size={16} color="var(--color-primary)" />
              <span>{t.hierDistrict}</span>
              <span className="required">*</span>
            </label>
            <select
              id="filterDistrict"
              className="form-control"
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
            >
              <option value="">-- {t.hierDistrict} --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Taluk (Dependent) */}
          <div className="form-group">
            <label className="form-label" htmlFor="filterTaluk">
              <MapPin size={16} color="var(--color-primary)" />
              <span>{t.hierTaluk}</span>
              <span className="required">*</span>
            </label>
            <select
              id="filterTaluk"
              className="form-control"
              value={selectedTalukId}
              onChange={(e) => handleTalukChange(e.target.value)}
              disabled={!selectedDistrictId}
            >
              <option value="">
                {selectedDistrictId ? `-- ${t.hierTaluk} --` : `-- ${t.hierDistrict} --`}
              </option>
              {availableTaluks.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  {tItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hierarchy Breadcrumb indicator */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#475569',
            marginTop: '0.5rem',
          }}
        >
          <span style={{ fontWeight: 600 }}>{t.activeHierarchy}:</span>
          <span>{districts.find((d) => d.id === selectedDistrictId)?.name || t.hierDistrict}</span>
          <span>→</span>
          <span>{availableTaluks.find((tal) => tal.id === selectedTalukId)?.name || t.hierTaluk}</span>
          <span>→</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {currentCenter?.name || t.hierCentre}
          </span>
          {selectedCropId && (
            <>
              <span>→</span>
              <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                {availableCrops.find((c) => c.id === selectedCropId)?.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Available Centres List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>
            {t.availCentresTitle} ({availableCenters.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {t.selectCenterPrompt}
          </span>
        </div>

        {availableCenters.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--color-text-muted)' }}
          >
            <MapPin size={36} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No centres found</h3>
            <p style={{ fontSize: '0.9rem' }}>
              {t.selectCenterPrompt}
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {availableCenters.map((center) => {
              const centerCrops = mockService.getCropsByCenter(center.id);
              const district = districts.find((d) => d.id === center.district_id);
              const taluk = mockService.getTaluksByDistrict(center.district_id).find((tItem) => tItem.id === center.taluk_id);

              return (
                <CenterCard
                  key={center.id}
                  center={center}
                  district={district}
                  taluk={taluk}
                  crops={centerCrops}
                  isSelected={selectedCenterId === center.id}
                  onSelect={handleCenterSelect}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Centre & Crop Filter Drawer */}
      {currentCenter && (
        <div
          className="card"
          style={{
            border: '2px solid var(--color-primary)',
            background: '#ffffff',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                {t.btnSelectedCenter}
              </div>
              <h3 style={{ fontSize: '1.35rem', margin: '0.2rem 0' }}>{currentCenter.name}</h3>
              <p style={{ fontSize: '0.875rem' }}>{currentCenter.address}</p>
            </div>

            <button
              onClick={handleProceedToBooking}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px' }}
            >
              <span>{t.btnBookAtCenter}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Crop Selection (predefined temporary list as specified) */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>
              <Wheat size={16} color="var(--color-primary)" />
              <span>{t.chooseCropPrompt}</span>
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {availableCrops.map((crop) => {
                const isCropSelected = selectedCropId === crop.id;
                return (
                  <div
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isCropSelected
                        ? '2px solid var(--color-primary)'
                        : '1.5px solid var(--color-border)',
                      backgroundColor: isCropSelected
                        ? 'var(--color-primary-light)'
                        : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: isCropSelected ? 700 : 500,
                      color: isCropSelected
                        ? 'var(--color-primary-dark)'
                        : 'var(--color-text-main)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Wheat size={18} color={isCropSelected ? 'var(--color-primary)' : '#64748b'} />
                    <div>
                      <div>{crop.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        MSP: {crop.unit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
