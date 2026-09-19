import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  Circle,
  Building2,
  Calendar,
  Wheat,
  User,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Booking, ProcurementStatus, Farmer } from '../../types';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface TrackStatusPageProps {
  farmer?: Farmer;
  initialTokenNumber?: string;
  onViewToken: (token: string) => void;
}

export const TrackStatusPage: React.FC<TrackStatusPageProps> = ({
  farmer,
  initialTokenNumber = '',
  onViewToken,
}) => {
  const { t } = useLanguage();
  const farmerBookings = farmer ? mockService.getFarmerBookings(farmer.id, farmer.mobile) : [];
  const defaultBooking = initialTokenNumber
    ? mockService.getBookingByTokenForFarmer(initialTokenNumber, farmer?.id, farmer?.mobile)
    : farmerBookings[0];

  const [searchInput, setSearchInput] = useState<string>(defaultBooking?.token_number || initialTokenNumber || '');
  const [currentBooking, setCurrentBooking] = useState<Booking | undefined>(defaultBooking);
  const [searchError, setSearchError] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const found = mockService.getBookingByTokenForFarmer(searchInput.trim(), farmer?.id, farmer?.mobile);
    if (found) {
      setCurrentBooking(found);
      setSearchError('');
    } else {
      setSearchError(`No booking record found for token "${searchInput.trim()}" under your account.`);
    }
  };

  const sampleTokens = farmerBookings.map((b) => b.token_number);

  const getStatusTranslation = (status: ProcurementStatus) => {
    switch (status) {
      case 'Booking Confirmed': return t.statusConfirmed;
      case 'Farmer Arrived': return t.statusArrived;
      case 'Quality Check': return t.statusQuality;
      case 'Procurement Processing': return t.statusProcessing;
      case 'Procurement Completed': return t.statusCompleted;
      default: return status;
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>{t.trackTitle}</h1>
        <p style={{ fontSize: '0.95rem' }}>
          {t.trackSubtitle}
        </p>
      </div>

      {/* Token Search Box */}
      <div className="card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              placeholder={t.searchTokenPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <span>{t.btnTrackToken}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Farmer's Own Active Tokens */}
        {sampleTokens.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
            <span>Your Active Tokens:</span>
            {sampleTokens.map((tok) => (
              <button
                key={tok}
                type="button"
                onClick={() => {
                  setSearchInput(tok);
                  const b = mockService.getBookingByTokenForFarmer(tok, farmer?.id, farmer?.mobile);
                  if (b) {
                    setCurrentBooking(b);
                    setSearchError('');
                  }
                }}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--color-secondary-dark)',
                }}
              >
                {tok}
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <div style={{ marginTop: '0.75rem', color: '#dc2626', fontSize: '0.85rem' }}>
            {searchError}
          </div>
        )}
      </div>

      {/* Empty State when no booking found */}
      {!currentBooking && !searchError && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', maxWidth: '600px', margin: '1rem auto' }}>
          <Clock size={44} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Active Tracking Record</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Enter a valid token number issued to your account above, or book a procurement slot to track live Mandi stages.
          </p>
        </div>
      )}

      {/* Booking Record & Timeline Display */}
      {currentBooking && (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Booking Summary Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                {t.trackTitle}
              </div>
              <h2 style={{ fontSize: '1.75rem', margin: '0.2rem 0' }}>{currentBooking.token_number}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {t.farmerName}: <strong>{currentBooking.farmer_name}</strong> • {t.deliveryCenter}: <strong>{currentBooking.center_name}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <Badge status={currentBooking.status} />
              <button
                onClick={() => onViewToken(currentBooking.token_number)}
                className="btn btn-outline btn-sm"
              >
                {t.btnViewToken}
              </button>
            </div>
          </div>

          {/* Key Facts Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              background: '#f8fafc',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              fontSize: '0.875rem',
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>{t.cropForDelivery}:</span>
              <div style={{ fontWeight: 700 }}>{currentBooking.crop_name}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{t.appointmentSchedule}:</span>
              <div style={{ fontWeight: 700 }}>{currentBooking.date}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-dark)' }}>{currentBooking.slot_time}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{t.estQuantity}:</span>
              <div style={{ fontWeight: 700 }}>{currentBooking.estimated_quantity_quintals} Qtl</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{t.colStatus}:</span>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{getStatusTranslation(currentBooking.status)}</div>
            </div>
          </div>

          {/* 5-Step Official Milestone Timeline */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              {t.processTimelineTitle}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {/* Vertical connector line */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  bottom: '24px',
                  left: '17px',
                  width: '3px',
                  background: '#e2e8f0',
                  zIndex: 1,
                }}
              />

              {currentBooking.timeline.map((item) => {
                const isCompleted = item.completed;
                const isCurrent = item.current;

                return (
                  <div
                    key={item.status}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.25rem',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {/* Node Icon */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCompleted
                          ? 'var(--color-primary)'
                          : isCurrent
                          ? '#ffffff'
                          : '#f1f5f9',
                        color: isCompleted
                          ? '#ffffff'
                          : isCurrent
                          ? 'var(--color-secondary)'
                          : '#94a3b8',
                        border: isCurrent
                          ? '3px solid var(--color-secondary)'
                          : isCompleted
                          ? 'none'
                          : '2px solid #cbd5e1',
                        boxShadow: isCurrent ? '0 0 0 5px rgba(37, 99, 235, 0.15)' : 'none',
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Clock size={18} strokeWidth={2.5} />
                      ) : (
                        <Circle size={14} />
                      )}
                    </div>

                    {/* Step Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: isCurrent || isCompleted ? 700 : 500,
                            color: isCurrent
                              ? 'var(--color-secondary-dark)'
                              : isCompleted
                              ? 'var(--color-text-main)'
                              : '#94a3b8',
                          }}
                        >
                          {getStatusTranslation(item.status)}
                        </h4>

                        {item.timestamp && (
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                            {item.timestamp}
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: isCurrent ? '#1e293b' : 'var(--color-text-muted)',
                            marginTop: '0.2rem',
                          }}
                        >
                          {item.note}
                        </p>
                      )}

                      {isCurrent && (
                        <div
                          style={{
                            display: 'inline-block',
                            marginTop: '0.4rem',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          {t.inProgressAtMandi}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
