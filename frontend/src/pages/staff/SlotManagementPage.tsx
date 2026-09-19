import React, { useState } from 'react';
import { Calendar, Building2, Clock, Plus, CheckCircle, AlertCircle, Edit, Save, ArrowLeft } from 'lucide-react';
import { mockService } from '../../services/mockService';
import { ProcurementCenter } from '../../types';

export const SlotManagementPage: React.FC = () => {
  const centers = mockService.getAllCenters();
  const [selectedCenterId, setSelectedCenterId] = useState<string>('cnt-1');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-15');

  const selectedCenter = centers.find((c) => c.id === selectedCenterId) || centers[0];
  const slots = mockService.getSlotsForCenterAndDate(selectedCenter.id, selectedDate);

  const dates = [
    '2026-09-15',
    '2026-09-16',
    '2026-09-17',
    '2026-09-18',
    '2026-09-19',
    '2026-09-21',
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Slot Management</h1>
        <p style={{ fontSize: '0.95rem' }}>
          Configure arrival capacity and manage vehicle unloading time slots by procurement yard.
        </p>
      </div>

      {/* Selector Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {/* Centre Select */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="slotCenter">
              <Building2 size={16} color="var(--color-secondary)" />
              <span>Select Procurement Centre</span>
            </label>
            <select
              id="slotCenter"
              className="form-control"
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
            >
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Select */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="slotDate">
              <Calendar size={16} color="var(--color-secondary)" />
              <span>Select Procurement Date</span>
            </label>
            <select
              id="slotDate"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d} (15 September 2026 Season)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Context Summary */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: '#475569',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            Centre: <strong>{selectedCenter.name}</strong> • Date: <strong>{selectedDate}</strong>
          </div>
          <div>
            Operating Hours: <strong>{selectedCenter.operating_hours}</strong>
          </div>
        </div>
      </div>

      {/* Slots Table (Prompt 20: Slot, Capacity, Booked, Available) */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Vehicle Capacity</th>
              <th>Booked Appointments</th>
              <th>Available Slots</th>
              <th>Mandi Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const available = Math.max(0, slot.capacity - slot.booked_count);
              const percentage = Math.round((slot.booked_count / slot.capacity) * 100);

              return (
                <tr key={slot.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                      <Clock size={16} color="var(--color-primary)" />
                      <span>{slot.time_range}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{slot.capacity}</strong> vehicles
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--color-secondary-dark)' }}>
                      {slot.booked_count}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.35rem' }}>
                      ({percentage}% booked)
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: available > 5 ? '#059669' : available > 0 ? '#d97706' : '#dc2626',
                      }}
                    >
                      {available} slots left
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: available > 0 ? '#ecfdf5' : '#fef2f2',
                        color: available > 0 ? '#065f46' : '#991b1b',
                      }}
                    >
                      {available > 0 ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {available > 0 ? 'Accepting Tokens' : 'Fully Booked'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
