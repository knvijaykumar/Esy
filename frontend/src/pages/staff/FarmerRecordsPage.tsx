import React, { useState } from 'react';
import { Search, User, Phone, MapPin, Calendar, Globe, Filter, ArrowLeft } from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Farmer } from '../../types';

export const FarmerRecordsPage: React.FC = () => {
  const farmers: Farmer[] = mockService.getAllFarmers();
  const districts = mockService.getDistricts();
  const taluks = mockService.getTaluksByDistrict('dist-1');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch =
      f.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.mobile.includes(searchTerm) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = !selectedDistrict || f.district_id === selectedDistrict;

    return matchesSearch && matchesDistrict;
  });

  const getDistrictName = (id: string) =>
    districts.find((d) => d.id === id)?.name || 'Davanagere';

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'kn': return 'ಕನ್ನಡ (KN)';
      case 'hi': return 'हिन्दी (HI)';
      case 'te': return 'తెలుగు (TE)';
      default: return 'English (EN)';
    }
  };

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

      <div>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Farmer Records</h1>
        <p style={{ fontSize: '0.95rem' }}>
          Registered agricultural producers authorized for MSP procurement.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by Farmer Name, Mobile, or Village..."
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
          Showing {filteredFarmers.length} of {farmers.length} registered farmers
        </div>
      </div>

      {/* Farmer Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Farmer Name</th>
              <th>Mobile Number</th>
              <th>District</th>
              <th>Taluk</th>
              <th>Village</th>
              <th>Registered Date</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map((f) => (
              <tr key={f.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#dcfce7',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {f.full_name[0]}
                    </div>
                    <strong>{f.full_name}</strong>
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{f.mobile}</span>
                </td>
                <td>{getDistrictName(f.district_id)}</td>
                <td>{f.taluk_id === 'tal-1' ? 'Channagiri' : f.taluk_id === 'tal-2' ? 'Harihara' : 'Honnali'}</td>
                <td>{f.village}</td>
                <td>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{f.created_at}</div>
                </td>
                <td>
                  <span className="badge badge-crop">{getLanguageLabel(f.preferred_language)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
