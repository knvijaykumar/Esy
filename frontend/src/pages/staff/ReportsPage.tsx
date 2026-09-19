import React from 'react';
import {
  FileBarChart,
  Wheat,
  Building2,
  CheckCircle2,
  TrendingUp,
  Download,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { mockService } from '../../services/mockService';

export const ReportsPage: React.FC = () => {
  const stats = mockService.getStaffStats();
  const records = mockService.getAllProcurementRecords();
  const bookings = mockService.getAllBookings();

  // Crop-wise procurement breakdown (CSS bar chart data)
  const cropBreakdown = [
    { crop: 'Paddy', quintals: 58.5, percentage: 37, color: '#15803d' },
    { crop: 'Ragi', quintals: 42.0, percentage: 27, color: '#2563eb' },
    { crop: 'Jowar', quintals: 35.0, percentage: 22, color: '#7c3aed' },
    { crop: 'Tur', quintals: 22.5, percentage: 14, color: '#d97706' },
  ];

  // Centre-wise bookings breakdown
  const centreBreakdown = [
    { centre: 'Channagiri Procurement Centre', bookings: 12, percentage: 38 },
    { centre: 'Harihara Agricultural Mandi', bookings: 9, percentage: 28 },
    { centre: 'Honnali Facilitation Centre', bookings: 6, percentage: 19 },
    { centre: 'Davanagere Central APMC Hub', bookings: 5, percentage: 15 },
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Procurement Reports</h1>
          <p style={{ fontSize: '0.95rem' }}>
            Operational summary and distribution statistics for Kharif / Rabi Season 2026.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-outline btn-sm"
        >
          <Download size={16} />
          <span>Export / Print Summary</span>
        </button>
      </div>

      {/* 4 Summary Cards (Prompt 23 requirements) */}
      <div className="grid-4" style={{ gap: '1.25rem' }}>
        {/* Card 1: Total Procurement */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Procurement</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
            {stats.totalProcuredQuintals.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Qtl</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            ₹{stats.totalPayoutInr.toLocaleString('en-IN')} DBT distributed
          </div>
        </div>

        {/* Card 2: Crop-wise Procurement */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Crop Types</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-secondary-dark)', margin: '0.2rem 0' }}>
            7 Commodities
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Paddy & Ragi leading volume
          </div>
        </div>

        {/* Card 3: Centre-wise Bookings */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Centre Bookings</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#7c3aed', margin: '0.2rem 0' }}>
            {bookings.length} Tokens
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Across 10 APMC mandi yards
          </div>
        </div>

        {/* Card 4: Completed Procurements */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Completed Procurements</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
            {records.length} Lots
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            100% Quality checked
          </div>
        </div>
      </div>

      {/* Chart 1: Crop-wise Procurement Volume */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Wheat size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.25rem' }}>Crop-wise Procurement Volume (Quintals)</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cropBreakdown.map((item) => (
            <div key={item.crop}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>{item.crop}</span>
                <span style={{ color: '#64748b' }}>
                  <strong>{item.quintals} Quintals</strong> ({item.percentage}%)
                </span>
              </div>
              <div style={{ height: '14px', background: '#e2e8f0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Centre-wise Bookings Distribution */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Building2 size={20} color="var(--color-secondary)" />
          <h2 style={{ fontSize: '1.25rem' }}>Centre-wise Booking Activity</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {centreBreakdown.map((item) => (
            <div key={item.centre}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>{item.centre}</span>
                <span style={{ color: '#64748b' }}>
                  <strong>{item.bookings} appointments</strong> ({item.percentage}%)
                </span>
              </div>
              <div style={{ height: '14px', background: '#e2e8f0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    backgroundColor: 'var(--color-secondary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
