import React, { useState } from 'react';
import {
  Users,
  Building2,
  CalendarCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Ticket,
  FileBarChart,
  ShieldCheck,
  Wheat,
  Eye,
  FileText,
  AlertTriangle,
  Sparkles,
  X,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { StaffUser, CropAssessmentReport } from '../../types';
import { Badge } from '../../components/common/Badge';

interface StaffDashboardPageProps {
  staffUser: StaffUser;
  onNavigate: (route: string) => void;
}

export const StaffDashboardPage: React.FC<StaffDashboardPageProps> = ({
  staffUser,
  onNavigate,
}) => {
  const [selectedReportModal, setSelectedReportModal] = useState<CropAssessmentReport | null>(null);

  const stats = mockService.getStaffStats();
  const centreBookings = mockService.getBookingsByCenter(staffUser.center_name);
  const displayBookings = centreBookings.length > 0 ? centreBookings : mockService.getAllBookings().slice(0, 5);
  const cropReports = mockService.getCropAssessmentReportsByCenter(staffUser.center_name);

  const summaryCards = [
    {
      label: 'Registered Farmers',
      value: stats.registeredFarmers.toString(),
      subtext: 'Across 4 districts',
      icon: <Users size={28} />,
      color: '#15803d',
      bgColor: '#dcfce7',
      route: 'farmer-records',
    },
    {
      label: 'Procurement Centres',
      value: stats.procurementCentres.toString(),
      subtext: '10 operational APMC yards',
      icon: <Building2 size={28} />,
      color: '#2563eb',
      bgColor: '#dbeafe',
      route: 'procurement-centers',
    },
    {
      label: "Today's Bookings",
      value: stats.todaysBookings.toString(),
      subtext: `Targeting ${staffUser.center_name}`,
      icon: <CalendarCheck size={28} />,
      color: '#7c3aed',
      bgColor: '#ede9fe',
      route: 'slot-management',
    },
    {
      label: 'Incoming Crop Reports',
      value: cropReports.length.toString(),
      subtext: `Specific to ${staffUser.center_name}`,
      icon: <Wheat size={28} />,
      color: '#0284c7',
      bgColor: '#e0f2fe',
      route: 'token-management',
    },
    {
      label: 'Pending Milestones',
      value: stats.pendingProcurement.toString(),
      subtext: 'Tokens in verification queue',
      icon: <Clock size={28} />,
      color: '#d97706',
      bgColor: '#fef3c7',
      route: 'token-management',
    },
    {
      label: 'Completed Weighments',
      value: stats.completedProcurement.toString(),
      subtext: 'Weighed & DBT receipts issued',
      icon: <CheckCircle2 size={28} />,
      color: '#059669',
      bgColor: '#ecfdf5',
      route: 'procurement-records',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Officer Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: '#93c5fd',
              marginBottom: '0.5rem',
            }}
          >
            <ShieldCheck size={14} />
            <span>Mandi Operations Command • Kharif 2026</span>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '1.85rem', marginBottom: '0.25rem' }}>
            {staffUser.name}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Role: <strong>{staffUser.role}</strong> • Assigned: <strong>{staffUser.center_name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('token-management')}
            className="btn btn-secondary btn-sm"
          >
            <Ticket size={16} />
            <span>Process Tokens</span>
          </button>
          <button
            onClick={() => onNavigate('staff-reports')}
            className="btn btn-outline btn-sm"
            style={{ color: '#ffffff', borderColor: '#334155' }}
          >
            <FileBarChart size={16} />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics (Prompt 17 requirements) */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Key Procurement Metrics</h2>

        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {summaryCards.map((card) => (
            <div
              key={card.label}
              onClick={() => onNavigate(card.route)}
              className="card card-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: card.bgColor,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.1rem 0' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {card.subtext}
                </div>
              </div>

              <div style={{ color: '#94a3b8' }}>
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Token Processing Queue Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Today's Active Arrival & Weighbridge Queue</h3>
            <p style={{ fontSize: '0.85rem' }}>
              Real-time token status verification at <strong>{staffUser.center_name}</strong>
            </p>
          </div>

          <button
            onClick={() => onNavigate('token-management')}
            className="btn btn-outline btn-sm"
          >
            <span>View All Tokens</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Farmer Name</th>
                <th>Crop</th>
                <th>Slot Time</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>{b.token_number}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.farmer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.farmer_mobile}</div>
                  </td>
                  <td>
                    <Badge type="crop">{b.crop_name}</Badge>
                    <span style={{ fontSize: '0.8rem', marginLeft: '0.35rem', color: '#64748b' }}>
                      ({b.estimated_quantity_quintals} Qtl)
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{b.slot_time}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.date}</div>
                  </td>
                  <td>
                    <Badge status={b.status} />
                  </td>
                  <td>
                    <button
                      onClick={() => onNavigate('token-management')}
                      className="btn btn-outline btn-sm"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FARMER CROP INFORMATION RECEIVED FOR SPECIFIC PROCUREMENT CENTRE */}
      <div className="card" style={{ borderTop: '4px solid #16a34a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Wheat size={16} color="#16a34a" />
              <span>Targeted Intake Intelligence</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
              Farmer Crop Information Received for {staffUser.center_name}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
              Pre-arrival grain quality assessments and photos transmitted specifically to your procurement centre.
            </p>
          </div>

          <span
            style={{
              background: '#dcfce7',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Destination:</span>
            <strong>{staffUser.center_name}</strong>
          </span>
        </div>

        {cropReports.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed #cbd5e1',
            }}
          >
            <Wheat size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
              No crop reports received yet for {staffUser.center_name}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              When farmers perform AI crop assessments and select this centre as their destination, their reports will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Slip ID</th>
                  <th>Farmer Details</th>
                  <th>Crop</th>
                  <th>Quality Condition</th>
                  <th>Issue / Diagnosis</th>
                  <th>Transmitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cropReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', fontSize: '0.85rem' }}>
                        {report.id}
                      </span>
                      {report.token_number && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Token: <strong>{report.token_number}</strong>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{report.farmer_name}</div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{report.farmer_mobile}</div>
                    </td>
                    <td>
                      <Badge type="crop">{report.crop}</Badge>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          background:
                            report.condition === 'Healthy'
                              ? '#dcfce7'
                              : report.condition === 'Moderate'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            report.condition === 'Healthy'
                              ? '#166534'
                              : report.condition === 'Moderate'
                              ? '#92400e'
                              : '#991b1b',
                          border: `1px solid ${
                            report.condition === 'Healthy'
                              ? '#bbf7d0'
                              : report.condition === 'Moderate'
                              ? '#fde68a'
                              : '#fecaca'
                          }`,
                        }}
                      >
                        ● {report.condition}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '240px' }}>
                        {report.disease_or_issue || 'Normal Grain'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem', fontStyle: 'italic' }}>
                        {report.quality_warning}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                        {report.submitted_at || report.analysis_date}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedReportModal(report)}
                        className="btn btn-outline btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        <Eye size={14} />
                        <span>Inspect Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: FULL CROP ASSESSMENT INSPECTION SLIP */}
      {selectedReportModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '640px',
              width: '100%',
              background: '#ffffff',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                  Procurement Centre Intake Verification
                </div>
                <h3 style={{ fontSize: '1.35rem', margin: '0.2rem 0', fontWeight: 800 }}>
                  Farmer Crop Assessment Slip
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Reference ID: <strong style={{ color: '#2563eb' }}>{selectedReportModal.id}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Destination Verification Badge */}
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: '#166534',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={18} color="#16a34a" />
              <span>
                Transmitted directly to <strong>{selectedReportModal.center_name}</strong> for intake validation.
              </span>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Farmer Name</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{selectedReportModal.farmer_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedReportModal.farmer_mobile}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Crop & Quality Condition</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{selectedReportModal.crop}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: selectedReportModal.condition === 'Healthy' ? '#166534' : '#92400e' }}>
                  Condition: {selectedReportModal.condition}
                </div>
              </div>

              {selectedReportModal.token_number && (
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Linked Token #</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2563eb' }}>{selectedReportModal.token_number}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedReportModal.booking_date}</div>
                </div>
              )}
            </div>

            {/* Quality Observations Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table className="table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <th style={{ width: '35%', background: '#f8fafc', fontSize: '0.825rem' }}>Identified Issue</th>
                    <td style={{ fontSize: '0.85rem' }}>{selectedReportModal.disease_or_issue || 'None (Healthy Grain)'}</td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', fontSize: '0.825rem' }}>Quality Warning</th>
                    <td style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 500 }}>
                      {selectedReportModal.quality_warning || 'Within standard limits'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', fontSize: '0.825rem' }}>Mandi Handling Advice</th>
                    <td style={{ fontSize: '0.85rem', color: '#1e40af' }}>
                      {selectedReportModal.recommendation}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', fontSize: '0.825rem' }}>Transmitted Date</th>
                    <td style={{ fontSize: '0.85rem' }}>{selectedReportModal.submitted_at || selectedReportModal.analysis_date}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-outline btn-sm"
              >
                Print Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="btn btn-primary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
