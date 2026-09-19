import React from 'react';
import { CheckCircle2, Ticket, TrendingUp, Calendar, MapPin, Wheat, Clock, User, Home, ArrowLeft } from 'lucide-react';
import { Booking } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BookingConfirmationPageProps {
  booking?: Booking;
  onViewToken: () => void;
  onTrackStatus: () => void;
  onGoHome: () => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  booking,
  onViewToken,
  onTrackStatus,
  onGoHome,
}) => {
  const { t } = useLanguage();

  if (!booking) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', maxWidth: '560px', margin: '2rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <img
            src="/bks-logo.png"
            alt="Bharat Krishi Seva"
            style={{ height: '80px', width: '80px', objectFit: 'contain', borderRadius: '50%' }}
          />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Booking Record</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Please book an APMC slot or view your booking history.
        </p>
        <button onClick={onGoHome} className="btn btn-primary" style={{ margin: '0 auto' }}>
          {t.btnBackDashboard || 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '1rem auto' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={onGoHome}
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

      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '2.5rem 2rem',
          border: '2px solid var(--color-primary-border)',
        }}
      >
        {/* Brand Logo & Success Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <img
            src="/bks-logo.png"
            alt="Bharat Krishi Seva"
            style={{
              height: '76px',
              width: '76px',
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(21, 128, 61, 0.2)',
            }}
          />
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 6px rgba(21, 128, 61, 0.1)',
            }}
          >
            <CheckCircle2 size={38} />
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t.procurementSlotReserved}
        </div>
        <h1 style={{ fontSize: '2rem', margin: '0.25rem 0 0.5rem' }}>{t.bookingConfirmedTitle}</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
          {t.bookingConfirmedSub}
        </p>

        {/* Big Token Reference Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '2px dashed var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {t.tokenNumberLabel}
          </div>
          <div
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '0.05em',
              margin: '0.25rem 0',
            }}
          >
            {booking.token_number}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#166534' }}>
            {t.bookingRefLabel}: {booking.id}
          </div>
        </div>

        {/* Booking Details Breakdown */}
        <div
          style={{
            textAlign: 'left',
            background: '#f8fafc',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <User size={18} color="var(--color-primary)" />
            <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>{t.farmerName}:</span>
            <strong>{booking.farmer_name}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Wheat size={18} color="var(--color-primary)" />
            <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>{t.cropForDelivery}:</span>
            <strong>{booking.crop_name} ({booking.estimated_quantity_quintals} Quintals)</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MapPin size={18} color="var(--color-primary)" />
            <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>{t.deliveryCenter}:</span>
            <strong>{booking.center_name}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>{t.stepDate}:</span>
            <strong>{booking.date}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={18} color="var(--color-primary)" />
            <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>{t.stepSlot}:</span>
            <strong style={{ color: 'var(--color-secondary-dark)' }}>{booking.slot_time}</strong>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onViewToken}
            className="btn btn-primary btn-lg btn-block"
          >
            <Ticket size={20} />
            <span>{t.btnViewMyToken}</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={onTrackStatus}
              className="btn btn-outline"
            >
              <TrendingUp size={18} />
              <span>{t.btnTrackMilestones}</span>
            </button>

            <button
              onClick={onGoHome}
              className="btn btn-outline"
            >
              <Home size={18} />
              <span>{t.btnBackDashboard}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
