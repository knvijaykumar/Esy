import React from 'react';
import {
  Printer,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Wheat,
  User,
  ShieldCheck,
  TrendingUp,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { Booking } from '../../types';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface DigitalTokenPageProps {
  booking?: Booking;
  onTrackStatus: (tokenNumber: string) => void;
  onBackToDashboard: () => void;
}

export const DigitalTokenPage: React.FC<DigitalTokenPageProps> = ({
  booking,
  onTrackStatus,
  onBackToDashboard,
}) => {
  const { t } = useLanguage();

  if (!booking) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '600px', margin: '2rem auto' }}>
        <FileText size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{t.noActiveTokenTitle}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
          {t.noActiveTokenDesc}
        </p>
        <button onClick={onBackToDashboard} className="btn btn-primary">
          {t.btnBackDashboard}
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStub = () => {
    // Generates a simple formatted receipt text download
    const content = `=====================================================
GOVERNMENT OF KARNATAKA - AGRICULTURAL PROCUREMENT
SMART DIGITAL PROCUREMENT TOKEN PASS
=====================================================
TOKEN NUMBER       : ${booking.token_number}
BOOKING REFERENCE  : ${booking.id}
DATE OF ISSUE      : ${booking.created_at}
-----------------------------------------------------
FARMER NAME        : ${booking.farmer_name}
MOBILE NUMBER      : ${booking.farmer_mobile}
VILLAGE            : ${booking.district_id}
-----------------------------------------------------
PROCUREMENT CENTRE : ${booking.center_name}
ADDRESS            : ${booking.center_address}
-----------------------------------------------------
CROP FOR DELIVERY  : ${booking.crop_name}
ESTIMATED QUANTITY : ${booking.estimated_quantity_quintals} Quintals
SCHEDULED DATE     : ${booking.date}
SCHEDULED TIME SLOT: ${booking.slot_time}
STATUS             : ${booking.status}
=====================================================
INSTRUCTIONS:
1. Carry original Farmer ID Card & valid photo ID.
2. Present this token number at Mandi Gate 1.
3. Arrive strictly during the designated 1-hour slot.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Token_${booking.token_number}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Top Back Navigation */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={onBackToDashboard}
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
          title="Return to dashboard"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Action Header (Hidden during Print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>{t.tokenPassHeader}</h1>
          <p style={{ fontSize: '0.875rem' }}>{t.tokenPassSubtitle}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <Printer size={16} />
            <span>{t.btnPrintToken}</span>
          </button>
          <button onClick={handleDownloadStub} className="btn btn-primary btn-sm">
            <Download size={16} />
            <span>{t.btnDownload}</span>
          </button>
        </div>
      </div>

      {/* Official Government Pass Card (Printable) */}
      <div
        className="token-print-card"
        style={{
          background: '#ffffff',
          border: '2px solid #0f172a',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Tricolor Stripe on Token */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
          }}
        />

        {/* Header with National Public Service Seal & Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1.25rem',
            borderBottom: '1.5px dashed #cbd5e1',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src="/bks-logo.png"
              alt="Bharat Krishi Seva"
              style={{
                height: '60px',
                width: '60px',
                objectFit: 'contain',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={20} color="var(--color-primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.tokenPassGovTitle}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {t.tokenPassGovSub}
              </div>
            </div>
          </div>

          <Badge status={booking.status} />
        </div>

        {/* Large Token Number Display */}
        <div
          style={{
            textAlign: 'center',
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.tokenNumberLabel}
          </div>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              margin: '0.35rem 0',
              fontFamily: 'monospace, sans-serif',
            }}
          >
            {booking.token_number}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {t.bookingRefLabel}: <strong>{booking.id}</strong>
          </div>
        </div>

        {/* Official Specifications Table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.25rem',
            fontSize: '0.925rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Farmer */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.farmerName}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
              {booking.farmer_name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {t.mobileLabel}: {booking.farmer_mobile}
            </div>
          </div>

          {/* Crop */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.cropForDelivery}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
              {booking.crop_name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              {t.estQuantity}: {booking.estimated_quantity_quintals} Qtl
            </div>
          </div>

          {/* Centre */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.deliveryCenter}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
              {booking.center_name}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
              {booking.center_address}
            </div>
          </div>

          {/* Date */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.stepDate}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.2rem', fontSize: '1rem' }}>
              {booking.date}
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.scheduledTimeSlot}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-secondary-dark)', marginTop: '0.2rem', fontSize: '1rem' }}>
              {booking.slot_time}
            </div>
          </div>
        </div>

        {/* Security & Instructions Footer */}
        <div
          style={{
            borderTop: '1.5px dashed #cbd5e1',
            paddingTop: '1rem',
            fontSize: '0.75rem',
            color: '#64748b',
            lineHeight: 1.5,
          }}
        >
          <strong>{t.instructionsTitle}</strong> {t.mandiPassNotice}
        </div>
      </div>

      {/* Footer Navigation (Hidden in Print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <button onClick={onBackToDashboard} className="btn btn-outline">
          {t.btnBackDashboard}
        </button>

        <button
          onClick={() => onTrackStatus(booking.token_number)}
          className="btn btn-secondary"
        >
          <TrendingUp size={18} />
          <span>{t.btnTrackMilestones}</span>
        </button>
      </div>
    </div>
  );
};
