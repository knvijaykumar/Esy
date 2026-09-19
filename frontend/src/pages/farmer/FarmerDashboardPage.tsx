import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CalendarCheck,
  Ticket,
  TrendingUp,
  History,
  ArrowRight,
  Sparkles,
  User,
  Zap,
  UserCheck,
  Sprout,
  Calendar,
  QrCode,
  Truck,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Farmer, Booking } from '../../types';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { farmerUpdatesService, FarmerUpdate } from '../../services/farmerUpdatesService';

interface FarmerDashboardPageProps {
  farmer: Farmer;
  latestBooking?: Booking;
  onNavigate: (route: string) => void;
}

export const FarmerDashboardPage: React.FC<FarmerDashboardPageProps> = ({
  farmer,
  latestBooking,
  onNavigate,
}) => {
  const { t } = useLanguage();

  // State for 📰 Latest Farmer Updates Section
  const [updates, setUpdates] = useState<FarmerUpdate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoadingUpdates, setIsLoadingUpdates] = useState<boolean>(true);
  const [updatesError, setUpdatesError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const categories = [
    'All',
    '🏛️ Government Schemes',
    '💰 MSP & Procurement',
    '🌾 Farming Technology',
    '🚜 Agricultural Machinery',
    '🧪 Crop Technology',
    '📢 Farmer Advisory',
    '🎓 Training & Events',
  ];

  const loadUpdates = async (cat?: string) => {
    setIsLoadingUpdates(true);
    setUpdatesError(null);
    try {
      const res = await farmerUpdatesService.getLatestUpdates(
        cat === 'All' ? undefined : cat,
        6
      );
      if (res.error) {
        setUpdatesError(res.error);
        setUpdates([]);
      } else {
        setUpdates(res.updates || []);
        if (res.lastSynced) setLastSynced(res.lastSynced);
      }
    } catch {
      setUpdatesError('Unable to load the latest updates. Please try again later.');
      setUpdates([]);
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  useEffect(() => {
    loadUpdates(selectedCategory);
  }, [selectedCategory]);

  const actions = [
    {
      id: 'crop-assessment',
      title: '⚡ Quick Crop Assessment',
      description: 'Capture or upload a crop photo for a quick AI-based assessment.',
      icon: <Zap size={32} />,
      color: '#ea580c',
      bgColor: '#ffedd5',
    },
    {
      id: 'book-slot',
      title: 'Book Slot & Find Near Me',
      description: 'Auto-detect nearest APMC centre via GPS, choose your crop, date, and reserve a guaranteed 1-hour slot.',
      icon: <CalendarCheck size={32} />,
      color: '#15803d',
      bgColor: '#dcfce7',
    },
    {
      id: 'my-token',
      title: t.cardTokenTitle,
      description: t.cardTokenDesc,
      icon: <Ticket size={32} />,
      color: '#7c3aed',
      bgColor: '#ede9fe',
    },
    {
      id: 'track-status',
      title: t.cardTrackTitle,
      description: t.cardTrackDesc,
      icon: <TrendingUp size={32} />,
      color: '#0891b2',
      bgColor: '#cffafe',
    },
    {
      id: 'booking-history',
      title: t.cardHistoryTitle,
      description: t.cardHistoryDesc,
      icon: <History size={32} />,
      color: '#b45309',
      bgColor: '#fef3c7',
    },
    {
      id: 'my-profile',
      title: t.cardProfileTitle,
      description: t.cardProfileDesc,
      icon: <User size={32} />,
      color: '#059669',
      bgColor: '#d1fae5',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.75rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <Sparkles size={14} />
              <span>{t.seasonBadge}</span>
            </div>

            {/* User Avatar Button matching user's provided screenshot */}
            <button
              onClick={() => onNavigate('my-profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease',
              }}
              title="Click to view My Profile"
            >
              <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                <User size={18} strokeWidth={2.2} />
              </span>
              <span>{farmer.full_name.split(' ')[0].toLowerCase()}</span>
            </button>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '1.85rem', marginBottom: '0.4rem' }}>
            {t.welcomeFarmer}, {farmer.full_name || 'Farmer'}
          </h1>
          <p style={{ color: '#dcfce7', fontSize: '1.05rem', maxWidth: '600px', marginBottom: '1.25rem' }}>
            {t.welcomeSub}
          </p>

          {/* Profile Summary Strip (Prompt Section 37) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.875rem',
              color: '#f0fdf4',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ opacity: 0.8 }}>{t.farmerIdLabel}: </span>
                <strong style={{ letterSpacing: '0.03em' }}>{farmer.farmer_id || 'FMR-00125'}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.8 }}>{t.mobileLabel}: </span>
                <strong>{farmer.mobile ? `******${farmer.mobile.slice(-4)}` : '******3210'}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.8 }}>{t.talukLabel}: </span>
                <strong>{farmer.village || 'Santhebennur'}</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigate('my-profile')}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--color-primary-dark)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'background 0.15s ease',
              }}
            >
              <span>{t.btnViewProfile}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Token Notification Banner (if any) */}
      {latestBooking && (
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid var(--color-primary-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                {t.activeTokenTitle}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '0.02em' }}>
                {latestBooking.token_number}
              </div>
            </div>
            <div>
              <Badge status={latestBooking.status} />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              background: '#f8fafc',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <strong style={{ color: 'var(--color-text-main)' }}>Crop:</strong> {latestBooking.crop_name}
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-main)' }}>Centre:</strong> {latestBooking.center_name}
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-main)' }}>Scheduled:</strong> {latestBooking.date} ({latestBooking.slot_time})
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => onNavigate('my-token')}
              className="btn btn-primary btn-sm"
            >
              <Ticket size={16} />
              <span>{t.btnViewToken}</span>
            </button>
            <button
              onClick={() => onNavigate('track-status')}
              className="btn btn-outline btn-sm"
            >
              <TrendingUp size={16} />
              <span>{t.btnTrackLive}</span>
            </button>
            <button
              onClick={() => onNavigate('crop-assessment')}
              className="btn btn-outline btn-sm"
              style={{
                borderColor: '#ea580c',
                color: '#c2410c',
                background: '#fff7ed',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)',
              }}
              title="Assess crop quality & health with AI"
            >
              <Zap size={16} color="#ea580c" />
              <span>⚡ Quick Crop Assessment</span>
              <span
                style={{
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                }}
              >
                AI
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Main Actions Section */}
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>
            {t.servicesHeading}
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            {t.servicesSubtitle}
          </p>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {actions.map((act) => {
            if (act.id === 'crop-assessment') {
              return (
                <div
                  key={act.id}
                  onClick={() => onNavigate(act.id)}
                  className="card card-interactive"
                  style={{
                    gridColumn: '1 / -1',
                    background: 'linear-gradient(135deg, #fffbf5 0%, #fff7ed 40%, #ffffff 100%)',
                    border: '2px solid #ea580c',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                    boxShadow: '0 12px 28px -5px rgba(234, 88, 12, 0.22), 0 0 0 1px rgba(234, 88, 12, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Faint watermark illustration */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-15px',
                      bottom: '-25px',
                      opacity: 0.07,
                      color: '#ea580c',
                      pointerEvents: 'none',
                    }}
                  >
                    <Zap size={190} />
                  </div>

                  {/* Top Badges Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
                        }}
                      >
                        <Sparkles size={13} />
                        <span>AI-Powered Feature</span>
                      </span>
                      <span
                        style={{
                          background: '#ffedd5',
                          color: '#9a3412',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          border: '1px solid #fed7aa',
                        }}
                      >
                        ⚡ 5-Second Instant Analysis
                      </span>
                      <span
                        style={{
                          background: '#fef3c7',
                          color: '#854d0e',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          border: '1px solid #fde68a',
                        }}
                      >
                        ★ Recommended Before Mandi Visit
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#c2410c',
                        background: '#ffffff',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      Zero Setup Required
                    </span>
                  </div>

                  {/* Main Content Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: 'var(--radius-xl)',
                        background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 6px 16px rgba(234, 88, 12, 0.25)',
                      }}
                    >
                      <Zap size={36} strokeWidth={2.4} />
                    </div>

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <h3
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: '#7c2d12',
                          marginBottom: '0.35rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span>⚡ Quick Crop Assessment</span>
                      </h3>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          color: '#4b5563',
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        Capture or upload a crop photo for instant AI-based disease diagnosis, APMC quality grade prediction (Grade A/B/C), and fair market advisory before visiting the APMC mandi.
                      </p>
                    </div>

                    {/* CTA Button on the right */}
                    <div style={{ flexShrink: 0 }}>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.75rem 1.4rem',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          borderRadius: '10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Start AI Assessment</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Feature Highlight Pills */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.6rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px dashed #fdba74',
                      fontSize: '0.825rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#ffffff',
                        color: '#9a3412',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      📸 Camera & Photo Upload
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#ffffff',
                        color: '#9a3412',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      🔬 Instant Pest & Disease Scan
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#ffffff',
                        color: '#9a3412',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      🌾 APMC Quality Grade (A / B / C)
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#ffffff',
                        color: '#9a3412',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      📄 Downloadable Health Report
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={act.id}
                onClick={() => onNavigate(act.id)}
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
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-lg)',
                    background: act.bgColor,
                    color: act.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {act.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                    {act.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                    {act.description}
                  </p>
                </div>

                <div style={{ color: 'var(--color-primary)' }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📰 Latest Farmer Updates Section */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.5rem' }}>📰</span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Latest Farmer Updates
              </h2>
              {lastSynced && (
                <span
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                  Live Updated
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.925rem', color: '#64748b', margin: 0, maxWidth: '750px', lineHeight: 1.5 }}>
              Stay updated with government schemes, procurement news, farming technologies and modern agricultural machinery.
            </p>
          </div>

          <button
            onClick={() => loadUpdates(selectedCategory)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'background 0.15s ease',
            }}
            title="Refresh verified updates"
          >
            <RefreshCw size={13} style={{ animation: isLoadingUpdates ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Categories Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.65rem',
            marginBottom: '1.25rem',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? 700 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: isSelected ? '#15803d' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: isSelected ? '1px solid #166534' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 2px 6px rgba(21, 128, 61, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Content State: Loading, Error, Empty, or Updates Grid */}
        {isLoadingUpdates ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  height: '170px',
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : updatesError ? (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              color: '#991b1b',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={18} color="#b91c1c" />
              <span>Unable to load the latest updates. Please try again later.</span>
            </div>
            <button
              onClick={() => loadUpdates(selectedCategory)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
            >
              Retry
            </button>
          </div>
        ) : updates.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: '#64748b',
              fontSize: '0.925rem',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1',
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>No new updates available at the moment.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {updates.slice(0, 6).map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                className="card-interactive"
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#1e293b',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      {item.published_date}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.025rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.4,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                    }}
                  >
                    {item.summary}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '0.8rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      color: '#64748b',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '160px',
                    }}
                    title={item.source_name}
                  >
                    {item.source_name}
                  </span>

                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#15803d',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>Read Official Update →</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step-by-Step Farmer Journey Section */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.75rem',
          border: '1px solid #e2e8f0',
          marginTop: '0.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            Step-by-Step Farmer Journey
          </h2>
          <p style={{ fontSize: '0.925rem', color: '#64748b', margin: 0 }}>
            Complete transparency at each stage of the MSP grain procurement process
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Step 01 */}
          <div
            onClick={() => onNavigate('my-profile')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="card-interactive"
            title="View Registered Farmer Profile"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                01 — Register
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <UserCheck size={18} />
              </div>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.45rem 0' }}>Farmer Sign-in</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Quick and secure sign-in using your registered 10-digit mobile number with zero physical paperwork.
            </p>
          </div>

          {/* Step 02 */}
          <div
            onClick={() => onNavigate('book-slot')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="card-interactive"
            title="Click to Find Nearest APMC & Book Slot"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                02 — Select Centre
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <MapPin size={18} />
              </div>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.45rem 0' }}>Find Nearest APMC</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Select your District and Taluk to discover verified government procurement yards and grain centres.
            </p>
          </div>

          {/* Step 03 */}
          <div
            onClick={() => onNavigate('book-slot')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="card-interactive"
            title="Click to Choose Crop & Bags"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                03 — Select Crop
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <Sprout size={18} />
              </div>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.45rem 0' }}>Choose Crop & Bags</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Pick your crop (Paddy, Ragi, Maize, Jowar, etc.) and enter your expected yield for instant MSP calculation.
            </p>
          </div>

          {/* Step 04 */}
          <div
            onClick={() => onNavigate('book-slot')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="card-interactive"
            title="Click to Reserve Time Slot"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                04 — Book Slot
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <Calendar size={18} />
              </div>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.45rem 0' }}>Reserve Time Slot</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Select an available date and a guaranteed 1-hour arrival window to avoid long vehicle queues at the yard.
            </p>
          </div>

          {/* Step 05 */}
          <div
            onClick={() => onNavigate('my-token')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="card-interactive"
            title="Click to View Digital Token"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                05 — Get Digital Token
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <QrCode size={18} />
              </div>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.45rem 0' }}>Digital Token & SMS</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Receive an instant verifiable QR token on your screen and via SMS for priority weighbridge entry.
            </p>
          </div>

          {/* Step 06 */}
          <div
            onClick={() => onNavigate('track-status')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="card-interactive"
            title="Click to Track Procurement"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                06 — Visit & Track
              </span>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <Truck size={18} />
              </div>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.45rem 0' }}>Drop-off & Fair Payout</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Arrive on time, complete electronic weighment, and receive your MSP payment directly into your bank account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
