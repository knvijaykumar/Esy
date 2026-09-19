import React, { useState } from 'react';
import {
  Search,
  Ticket,
  User,
  Wheat,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Eye,
  FileText,
  X,
  Building2,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Booking, ProcurementStatus, StaffUser, CropAssessmentReport } from '../../types';
import { Badge } from '../../components/common/Badge';

interface TokenManagementPageProps {
  staffUser?: StaffUser;
}

export const TokenManagementPage: React.FC<TokenManagementPageProps> = ({ staffUser }) => {
  const [bookings, setBookings] = useState<Booking[]>(mockService.getAllBookings());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedCenterFilter, setSelectedCenterFilter] = useState<string>(staffUser?.center_name || '');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedCropSlip, setSelectedCropSlip] = useState<CropAssessmentReport | null>(null);

  const allCropReports = mockService.getCropAssessmentReports();
  const allCenters = mockService.getAllCenters();

  const getAttachedCropReport = (b: Booking): CropAssessmentReport | undefined => {
    return allCropReports.find(
      (r) =>
        (r.token_number && r.token_number === b.token_number) ||
        (r.farmer_name.toLowerCase() === b.farmer_name.toLowerCase() &&
          r.crop.toLowerCase() === b.crop_name.toLowerCase())
    );
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.token_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.crop_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || b.status === statusFilter;
    const matchesCenter =
      !selectedCenterFilter ||
      b.center_name.toLowerCase().includes(selectedCenterFilter.toLowerCase()) ||
      selectedCenterFilter.toLowerCase().includes(b.center_name.toLowerCase());

    return matchesSearch && matchesStatus && matchesCenter;
  });

  const handleAdvanceStatus = (tokenNumber: string, nextStatus: ProcurementStatus) => {
    const updated = mockService.updateBookingStatus(tokenNumber, nextStatus);
    if (updated) {
      setBookings([...mockService.getAllBookings()]);
      setSuccessMessage(`Token ${tokenNumber} status updated to "${nextStatus}".`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getNextStatus = (current: ProcurementStatus): ProcurementStatus | null => {
    switch (current) {
      case 'Booking Confirmed': return 'Farmer Arrived';
      case 'Farmer Arrived': return 'Quality Check';
      case 'Quality Check': return 'Procurement Processing';
      case 'Procurement Processing': return 'Procurement Completed';
      default: return null;
    }
  };

  const handleAcceptAllAutomatically = () => {
    const count = mockService.acceptAllTokensAutomatically();
    setBookings([...mockService.getAllBookings()]);
    setSuccessMessage(`⚡ All ${count} active tokens accepted and advanced automatically!`);
    setTimeout(() => setSuccessMessage(''), 4000);
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Token Management</h1>
          <p style={{ fontSize: '0.95rem' }}>
            Verify farmer entry passes and advance milestone stages from arrival to completion.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAcceptAllAutomatically}
          className="btn btn-primary"
          style={{
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.25rem',
          }}
          title="Automatically accept and advance all active farmer tokens in queue"
        >
          <CheckCircle2 size={18} />
          <span>⚡ Accept All Automatically</span>
        </button>
      </div>

      {successMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem', textTransform: 'uppercase' }}
              placeholder="Search token number, farmer, or crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '220px' }}>
            <select
              className="form-control"
              value={selectedCenterFilter}
              onChange={(e) => setSelectedCenterFilter(e.target.value)}
            >
              <option value="">All Procurement Centres</option>
              {allCenters.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Booking Confirmed">Booking Confirmed</option>
              <option value="Farmer Arrived">Farmer Arrived</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Procurement Processing">Procurement Processing</option>
              <option value="Procurement Completed">Procurement Completed</option>
            </select>
          </div>
        </div>

        {selectedCenterFilter && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={14} />
            <span>
              Filtering queue for: <strong>{selectedCenterFilter}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedCenterFilter('')}
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0, marginLeft: '0.5rem', fontSize: '0.8rem' }}
            >
              Show all centres
            </button>
          </div>
        )}
      </div>

      {/* Token Management Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Token #</th>
              <th>Farmer Details</th>
              <th>Crop Information</th>
              <th>Procurement Centre</th>
              <th>Date & Slot</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Advance Milestone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const next = getNextStatus(b.status);
              const attachedCrop = getAttachedCropReport(b);

              return (
                <tr key={b.id}>
                  <td>
                    <strong style={{ color: 'var(--color-primary-dark)', letterSpacing: '0.03em' }}>
                      {b.token_number}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.farmer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.farmer_mobile}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Badge type="crop">{b.crop_name}</Badge>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        ({b.estimated_quantity_quintals} Qtl)
                      </span>
                    </div>

                    {attachedCrop && (
                      <div style={{ marginTop: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedCropSlip(attachedCrop)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#ecfdf5',
                            color: '#166534',
                            border: '1px solid #a7f3d0',
                            borderRadius: '12px',
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          title="View farmer crop assessment sent to this centre"
                        >
                          <Wheat size={12} color="#16a34a" />
                          <span>Crop Slip: {attachedCrop.condition}</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{b.center_name}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.date}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.slot_time}</div>
                  </td>
                  <td>
                    <Badge status={b.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {next ? (
                      <button
                        onClick={() => handleAdvanceStatus(b.token_number, next)}
                        className="btn btn-outline-primary btn-sm"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <span>Advance to {next}</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                        ✓ Finalized
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL: ATTACHED CROP ASSESSMENT INSPECTION */}
      {selectedCropSlip && (
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
              maxWidth: '600px',
              width: '100%',
              background: '#ffffff',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                  Intake Quality Pre-Assessment
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: '0.2rem 0', fontWeight: 800 }}>
                  Farmer Crop Information
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Target Centre: <strong>{selectedCropSlip.center_name}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCropSlip(null)}
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

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Farmer:</span>
                <strong>{selectedCropSlip.farmer_name} ({selectedCropSlip.farmer_mobile})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Crop:</span>
                <strong>{selectedCropSlip.crop}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Preliminary Quality:</span>
                <strong style={{ color: selectedCropSlip.condition === 'Healthy' ? '#166534' : '#92400e' }}>
                  {selectedCropSlip.condition}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Transmitted On:</span>
                <span>{selectedCropSlip.submitted_at || selectedCropSlip.analysis_date}</span>
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table className="table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <th style={{ width: '35%', background: '#f8fafc', fontSize: '0.825rem' }}>Detected Issue</th>
                    <td style={{ fontSize: '0.85rem' }}>{selectedCropSlip.disease_or_issue || 'None'}</td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', fontSize: '0.825rem' }}>Quality Warning</th>
                    <td style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 500 }}>
                      {selectedCropSlip.quality_warning}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', fontSize: '0.825rem' }}>Inspection Advice</th>
                    <td style={{ fontSize: '0.85rem', color: '#1e40af' }}>{selectedCropSlip.recommendation}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedCropSlip(null)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
