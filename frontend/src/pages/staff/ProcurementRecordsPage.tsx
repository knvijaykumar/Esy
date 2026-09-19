import React, { useState } from 'react';
import { Search, Wheat, Building2, User, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { mockService } from '../../services/mockService';
import { ProcurementRecord } from '../../types';
import { Badge } from '../../components/common/Badge';

export const ProcurementRecordsPage: React.FC = () => {
  const records: ProcurementRecord[] = mockService.getAllProcurementRecords();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(
    (r) =>
      r.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.token_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuintals = records.reduce((acc, r) => acc + r.quantity_quintals, 0);
  const totalAmount = records.reduce((acc, r) => acc + r.total_amount_inr, 0);

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
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Procurement Records</h1>
          <p style={{ fontSize: '0.95rem' }}>
            Official electronic ledger of finalized crop procurements and DBT receipts.
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: '#ecfdf5', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>Total Procured</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>{totalQuintals.toFixed(1)} Qtl</div>
          </div>
          <div style={{ background: '#eff6ff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>Total MSP Payout</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search records by Farmer Name, Crop, or Token #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Procurement Table (Prompt 22: Farmer, Crop, Centre, Date, Quantity, Status) */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Token / Ref</th>
              <th>Farmer Name</th>
              <th>Crop & Grade</th>
              <th>Procurement Centre</th>
              <th>Date Procured</th>
              <th>Quantity (Qtl)</th>
              <th>Total Payout (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ color: 'var(--color-primary-dark)' }}>{r.token_number}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.id}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.farmer_name}</div>
                </td>
                <td>
                  <Badge type="crop">{r.crop_name}</Badge>
                  <span style={{ fontSize: '0.75rem', marginLeft: '0.35rem', color: '#059669', fontWeight: 600 }}>
                    {r.quality_grade}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{r.center_name}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem' }}>{r.date}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {r.quantity_quintals} Qtl
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    ₹{r.total_amount_inr.toLocaleString('en-IN')}
                  </span>
                </td>
                <td>
                  <Badge status="Completed" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
