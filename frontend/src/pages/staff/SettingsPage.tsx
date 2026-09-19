import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Clock, Calendar, Building2, User, ArrowLeft } from 'lucide-react';
import { StaffUser } from '../../types';

interface SettingsPageProps {
  staffUser: StaffUser;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ staffUser }) => {
  const [season, setSeason] = useState('Kharif 2026-27');
  const [operatingHours, setOperatingHours] = useState('08:30 AM – 05:30 PM');
  const [dailyCap, setDailyCap] = useState(1500);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Portal Settings</h1>
        <p style={{ fontSize: '0.95rem' }}>
          Configure seasonal MSP parameters, yard hours, and administrative preferences.
        </p>
      </div>

      {saved && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          ✓ Portal settings updated successfully.
        </div>
      )}

      {/* Staff Profile Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <User size={20} color="var(--color-secondary)" />
          <h2 style={{ fontSize: '1.25rem' }}>Staff Profile Details</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: '#64748b' }}>Full Name:</span>
            <div style={{ fontWeight: 700 }}>{staffUser.name}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Designation:</span>
            <div style={{ fontWeight: 700 }}>{staffUser.role}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Official Email:</span>
            <div style={{ fontWeight: 600 }}>{staffUser.email}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Assigned Center:</span>
            <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{staffUser.center_name}</div>
          </div>
        </div>
      </div>

      {/* Season & Operational Configuration Form */}
      <form onSubmit={handleSave} className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Settings size={20} color="var(--color-secondary)" />
          <h2 style={{ fontSize: '1.25rem' }}>Procurement Season Configuration</h2>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="seasonName">
            <Calendar size={16} color="var(--color-secondary)" />
            <span>Active Procurement Season</span>
          </label>
          <select
            id="seasonName"
            className="form-control"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="Kharif 2026-27">Kharif Season 2026-27 (Active)</option>
            <option value="Rabi 2026-27">Rabi Season 2026-27 (Upcoming)</option>
            <option value="Summer 2026">Summer Crops 2026</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="opHours">
            <Clock size={16} color="var(--color-secondary)" />
            <span>Yard Gate Opening & Weighbridge Operating Hours</span>
          </label>
          <input
            id="opHours"
            type="text"
            className="form-control"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dailyCapacity">
            <Building2 size={16} color="var(--color-secondary)" />
            <span>Daily Centre Target Capacity (in Quintals)</span>
          </label>
          <input
            id="dailyCapacity"
            type="number"
            className="form-control"
            value={dailyCap}
            onChange={(e) => setDailyCap(Number(e.target.value))}
          />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-secondary">
            <Save size={16} />
            <span>Save Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
