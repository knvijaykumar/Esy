import React, { useState } from 'react';
import { Building2, MapPin, Phone, Clock, Wheat, Search, Filter, ArrowLeft } from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Badge } from '../../components/common/Badge';

export const ProcurementCentresPage: React.FC = () => {
  const centers = mockService.getAllCenters();
  const districts = mockService.getDistricts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const filteredCenters = centers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || c.district_id === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const getDistrictName = (distId: string) =>
    districts.find((d) => d.id === distId)?.name || 'Davanagere';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Procurement Centres</h1>
          <p style={{ fontSize: '0.95rem' }}>
            Registered APMC Mandis and Government Grain Facilitation Centres.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search centres by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '200px' }}>
            <select
              className="form-control"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
          Showing {filteredCenters.length} centres
        </div>
      </div>

      {/* Centres Grid */}
      <div className="grid-2" style={{ gap: '1.25rem' }}>
        {filteredCenters.map((center) => {
          const crops = mockService.getCropsByCenter(center.id);
          const districtName = getDistrictName(center.district_id);

          return (
            <div key={center.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>{center.name}</h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#eff6ff',
                      color: 'var(--color-secondary-dark)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {districtName}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{center.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} />
                    <span>Hours: {center.operating_hours}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={16} />
                    <span>Helpdesk: {center.contact_phone}</span>
                  </div>
                </div>

                {/* Available Crops */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Wheat size={14} color="var(--color-primary)" />
                    <span>Authorized Crops:</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {crops.map((c) => (
                      <Badge key={c.id} type="crop">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#64748b',
                }}
              >
                <span>Daily Capacity: <strong>{center.daily_capacity_quintals} Quintals</strong></span>
                <span style={{ color: '#059669', fontWeight: 600 }}>● Active Season</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
