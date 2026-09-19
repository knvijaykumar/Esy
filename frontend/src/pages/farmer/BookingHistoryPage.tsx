import React from 'react';
import { History, Ticket, TrendingUp, Calendar, MapPin, Wheat, Plus, ArrowLeft } from 'lucide-react';
import { mockService } from '../../services/mockService';
import { Booking, Farmer } from '../../types';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface BookingHistoryPageProps {
  farmer?: Farmer;
  onViewToken: (token: string) => void;
  onTrackStatus: (token: string) => void;
  onNewBooking: () => void;
}

export const BookingHistoryPage: React.FC<BookingHistoryPageProps> = ({
  farmer,
  onViewToken,
  onTrackStatus,
  onNewBooking,
}) => {
  const { t } = useLanguage();
  const bookings: Booking[] = mockService.getFarmerBookings(farmer?.id, farmer?.mobile);

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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>{t.historyTitle}</h1>
          <p style={{ fontSize: '0.95rem' }}>
            {t.historySubtitle}
          </p>
        </div>

        <button onClick={onNewBooking} className="btn btn-primary">
          <Plus size={18} />
          <span>{t.btnNewBooking}</span>
        </button>
      </div>

      {/* Empty State when User has no bookings */}
      {bookings.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '600px',
            margin: '1.5rem auto',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <History size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
            No Bookings Found
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            You do not have any active or past procurement center slot bookings under this account.
          </p>
          <button onClick={onNewBooking} className="btn btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={18} />
            <span>{t.btnNewBooking}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Bookings Table (Desktop) & Cards (Mobile) */}
          <div className="table-responsive" style={{ display: 'none' }} id="history-desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>{t.colToken}</th>
                  <th>{t.colDateSlot}</th>
                  <th>{t.colCentre}</th>
                  <th>{t.colCropQty}</th>
                  <th>{t.colStatus}</th>
                  <th style={{ textAlign: 'right' }}>{t.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: 'var(--color-primary-dark)', letterSpacing: '0.02em' }}>
                        {b.token_number}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.bookingRefLabel}: {b.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.date}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.slot_time}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.center_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.center_address}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.crop_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.estimated_quantity_quintals} Qtl</div>
                    </td>
                    <td>
                      <Badge status={b.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => onViewToken(b.token_number)}
                          className="btn btn-outline btn-sm"
                          title="View Digital Token"
                        >
                          <Ticket size={14} />
                          <span>{t.actionViewToken}</span>
                        </button>
                        <button
                          onClick={() => onTrackStatus(b.token_number)}
                          className="btn btn-primary btn-sm"
                          title="Track Status"
                        >
                          <TrendingUp size={14} />
                          <span>{t.actionTrack}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (Screens < 768px) */}
          <div id="history-mobile-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((b) => (
              <div key={b.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', letterSpacing: '0.02em' }}>
                      {b.token_number}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.bookingRefLabel}: {b.id}</div>
                  </div>
                  <Badge status={b.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Wheat size={16} color="var(--color-primary)" />
                    <span>
                      <strong>{b.crop_name}</strong> ({b.estimated_quantity_quintals} Qtl)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} color="var(--color-primary)" />
                    <span>{b.center_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} color="var(--color-primary)" />
                    <span>{b.date} ({b.slot_time})</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => onViewToken(b.token_number)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Ticket size={15} />
                    <span>{t.actionViewToken}</span>
                  </button>
                  <button
                    onClick={() => onTrackStatus(b.token_number)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <TrendingUp size={15} />
                    <span>{t.actionTrack}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          #history-desktop-table {
            display: block !important;
          }
          #history-mobile-cards {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
