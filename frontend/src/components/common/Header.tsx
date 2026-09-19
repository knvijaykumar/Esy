import React, { useState } from 'react';
import { Menu, X, User, Building2, LogOut, ArrowLeft } from 'lucide-react';
import { Farmer, StaffUser } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  currentRole: 'farmer' | 'staff' | 'landing';
  currentFarmer: Farmer | null;
  staffUser: StaffUser | null;
  activeTab: string;
  onNavigate: (route: string) => void;
  onRoleSwitch: (role: 'farmer' | 'staff' | 'landing') => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentFarmer,
  staffUser,
  activeTab,
  onNavigate,
  onRoleSwitch,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const renderLuxuryIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'dashboard':
        return (
          <span className="luxury-icon-tile" title="Dashboard">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#ffffff" />
              <rect x="0.5" y="0.5" width="31" height="31" rx="5.5" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="5.5" y="11" width="4.5" height="14" rx="1.5" fill="#22c55e" />
              <rect x="13.5" y="7" width="4.5" height="18" rx="1.5" fill="#e11d48" />
              <rect x="21.5" y="13" width="4.5" height="12" rx="1.5" fill="#0284c7" />
              <line x1="4" y1="26" x2="28" y2="26" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        );
      case 'book-slot':
        return (
          <span className="luxury-icon-tile" title="Book Slot">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#ffffff" />
              <rect x="0.5" y="0.5" width="31" height="31" rx="5.5" stroke="#bfdbfe" strokeWidth="1" />
              <path d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V9H0V6Z" fill="#38bdf8" />
              <rect x="7" y="2" width="2" height="4" rx="1" fill="#1e3a8a" />
              <rect x="23" y="2" width="2" height="4" rx="1" fill="#1e3a8a" />
              <circle cx="8" cy="15" r="1.5" fill="#0284c7" />
              <circle cx="16" cy="15" r="1.5" fill="#0284c7" />
              <circle cx="24" cy="15" r="1.5" fill="#0284c7" />
              <circle cx="8" cy="21" r="1.5" fill="#0284c7" />
              <circle cx="16" cy="21" r="1.5" fill="#0284c7" />
              <circle cx="24" cy="21" r="1.5" fill="#0284c7" />
            </svg>
          </span>
        );
      case 'my-token':
        return (
          <span className="luxury-icon-tile" title="My Token">
            <svg width="22" height="17" viewBox="0 0 36 26" fill="none">
              <rect width="36" height="26" rx="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
              <line x1="11" y1="3" x2="11" y2="23" stroke="#92400e" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="0" cy="13" r="3.5" fill="#143920" />
              <circle cx="36" cy="13" r="3.5" fill="#143920" />
              <rect x="15" y="7" width="14" height="2.5" rx="1" fill="#78350f" opacity="0.75" />
              <rect x="15" y="12" width="9" height="2" rx="1" fill="#78350f" opacity="0.75" />
              <circle cx="26" cy="17" r="2.5" fill="#b45309" />
            </svg>
          </span>
        );
      case 'track':
        return (
          <span className="luxury-icon-tile" title="Track Procurement">
            <svg width="22" height="17" viewBox="0 0 36 26" fill="none">
              <rect x="2" y="3" width="20" height="16" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" />
              <path d="M22 8H29.5C31.5 8 33 9.5 33.5 11.5L34.5 15.5V19H22V8Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.2" />
              <path d="M24 10H28L29.5 13H24V10Z" fill="#bae6fd" />
              <circle cx="9" cy="20" r="3.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="9" cy="20" r="1.5" fill="#e2e8f0" />
              <circle cx="27" cy="20" r="3.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="27" cy="20" r="1.5" fill="#e2e8f0" />
            </svg>
          </span>
        );
      case 'history':
        return (
          <span className="luxury-icon-tile" title="History">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M7 5C5.34315 5 4 6.34315 4 8C4 9.65685 5.34315 11 7 11H25C26.6569 11 28 9.65685 28 8C28 6.34315 26.6569 5 25 5H7Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
              <path d="M5 8V24C5 25.6569 6.34315 27 8 27H26C27.6569 27 29 25.6569 29 24V8H5Z" fill="#fef3c7" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="9" y1="14" x2="23" y2="14" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9" y1="18" x2="21" y2="18" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9" y1="22" x2="17" y2="22" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        );
      case 'profile':
        return (
          <span className="luxury-icon-tile" title="My Profile">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#6b21a8" stroke="#d8b4fe" strokeWidth="1.5" />
              <circle cx="16" cy="11.5" r="5" fill="#f3e8ff" />
              <path d="M7.5 25C7.5 20.5 11.5 18.5 16 18.5C20.5 18.5 24.5 20.5 24.5 25" fill="#f3e8ff" />
            </svg>
          </span>
        );
      default:
        return null;
    }
  };

  const farmerNav = [
    { id: 'farmer-dashboard', label: t.navDashboard || 'Dashboard', iconKey: 'dashboard' },
    { id: 'book-slot', label: t.navBookSlot || 'Book Slot', iconKey: 'book-slot' },
    { id: 'my-token', label: t.navMyToken || 'My Token', iconKey: 'my-token' },
    { id: 'track-status', label: t.navTrackStatus || 'Track Procurement', iconKey: 'track' },
    { id: 'booking-history', label: t.navHistory || 'History', iconKey: 'history' },
    { id: 'my-profile', label: t.navProfile || 'My Profile', iconKey: 'profile' },
  ];

  const staffNav = [
    { id: 'staff-dashboard', label: t.staffNavDashboard || 'Dashboard' },
    { id: 'farmer-records', label: t.staffNavFarmers || 'Farmers' },
    { id: 'procurement-centers', label: t.staffNavCentres || 'Centres' },
    { id: 'slot-management', label: t.staffNavSlots || 'Slots' },
    { id: 'token-management', label: t.staffNavTokens || 'Tokens' },
    { id: 'procurement-records', label: t.staffNavProcurement || 'Procurement' },
    { id: 'staff-reports', label: t.staffNavReports || 'Reports' },
    { id: 'staff-settings', label: t.staffNavSettings || 'Settings' },
  ];

  const isAuthPage =
    activeTab === 'staff-login' ||
    activeTab === 'staff-register-center' ||
    activeTab === 'farmer-login' ||
    activeTab === 'farmer-register';

  const handleNavClick = (id: string) => {
    if (id === 'find-center') {
      onNavigate('book-slot');
    } else {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print" style={{ background: '#ffffff', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* National Tricolor Top Accent */}
      <div className="gov-accent-stripe" />

      {/* Upper Side: Logo on left end, Website Title and Tagline in Horizontal, Utilities on right */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isAuthPage ? 'center' : 'space-between',
          gap: '1rem',
        }}
      >
        {/* Left End: Logo + Horizontal Title & Tagline */}
        <div
          onClick={() =>
            isAuthPage
              ? onRoleSwitch('landing')
              : currentRole === 'staff'
              ? onNavigate('staff-dashboard')
              : onNavigate('farmer-dashboard')
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            flexWrap: 'nowrap',
          }}
          title="Bharat Krishi Seva Portal"
        >
          {/* Logo at Left End */}
          <img
            src="/bks-logo.png"
            alt="Bharat Krishi Seva"
            style={{
              height: '62px',
              width: '62px',
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              flexShrink: 0,
            }}
          />

          {/* Website Title Name & Tagline in Horizontal on the same line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.65rem',
              flexWrap: 'nowrap',
            }}
          >
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                lineHeight: 1.15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🌾</span>
              <span>BHARAT KRISHI SEVA</span>
            </span>
            <span
              style={{
                color: '#cbd5e1',
                fontSize: '1.05rem',
                fontWeight: 300,
                display: 'inline-block',
              }}
              className="tagline-divider"
            >
              |
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: currentRole === 'staff' ? 'var(--color-secondary-dark)' : '#166534',
                fontWeight: 600,
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}
              className="tagline-text"
            >
              {currentRole === 'staff'
                ? 'Staff & Center Administration Portal'
                : 'Farming The Future Since 1947'}
            </span>
          </div>
        </div>

        {/* Right End: Back Button & User Profile Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Universal Back Button */}
          <button
            type="button"
            onClick={() => {
              if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
                window.history.back();
              } else if (activeTab === 'farmer-dashboard' || activeTab === 'staff-dashboard' || isAuthPage) {
                onRoleSwitch('landing');
              } else {
                onNavigate(currentRole === 'staff' ? 'staff-dashboard' : 'farmer-dashboard');
              }
            }}
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              background: '#ffffff',
              color: 'var(--color-text-main)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
            title="Go back to previous page"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {!isAuthPage && (
            <>
              {currentRole === 'farmer' && currentFarmer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => handleNavClick('my-profile')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.35rem 0.85rem',
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.15s ease',
                    }}
                    className="desktop-badge"
                    title="Click to view My Profile"
                  >
                    <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                      <User size={18} strokeWidth={2.2} />
                    </span>
                    <span>{currentFarmer.full_name.split(' ')[0].toLowerCase()}</span>
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.35rem 0.65rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#b91c1c',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      className="desktop-badge"
                      title="Logout from Farmer Account"
                    >
                      <LogOut size={13} />
                      <span>{t.logout || 'Logout'}</span>
                    </button>
                  )}
                </div>
              )}

              {currentRole === 'staff' && staffUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.35rem 0.85rem',
                      background: '#ffffff',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-secondary-dark)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    className="desktop-badge"
                  >
                    <Building2 size={16} color="var(--color-secondary)" />
                    <span>{staffUser.name}</span>
                  </div>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.35rem 0.65rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#b91c1c',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      className="desktop-badge"
                      title="Logout from Staff Portal"
                    >
                      <LogOut size={13} />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}

              {currentRole === 'landing' ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onRoleSwitch('farmer')}
                    className="btn btn-primary btn-sm"
                  >
                    Farmer Portal
                  </button>
                  <button
                    onClick={() => onRoleSwitch('staff')}
                    className="btn btn-outline btn-sm"
                  >
                    Staff Portal
                  </button>
                </div>
              ) : currentRole === 'staff' ? (
                <button
                  onClick={() => onRoleSwitch('farmer')}
                  className="btn btn-outline btn-sm"
                  title="Switch to Farmer view"
                  style={{ fontSize: '0.8rem' }}
                >
                  Switch to Farmer
                </button>
              ) : null}

              {/* Mobile Hamburger Button */}
              {currentRole !== 'landing' && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-main)',
                  }}
                  className="mobile-hamburger"
                  aria-label="Toggle navigation"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lower Bar: Dedicated Full-Width Navigation Tabs Bar */}
      {!isAuthPage && (
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '0.35rem 1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
          className="desktop-nav-bar"
        >
          <div
            style={{
              maxWidth: '1080px',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Luxury Metallic Console Fulfilling the Horizontal Line */}
            <div className="luxury-gold-console">
              {currentRole === 'farmer' &&
                farmerNav.map((item) => {
                  const isActive = activeTab === item.id || (item.id === 'book-slot' && activeTab === 'find-center');
                  const isTrack = item.id === 'track-status';
                  const words = item.label.split(' ');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`luxury-gold-btn ${isActive ? 'active' : ''}`}
                      title={item.label}
                    >
                      {/* Specular flare reflection on top-left rim */}
                      <span className="luxury-flare-accent" />

                      {/* 3D Icon */}
                      {renderLuxuryIcon(item.iconKey)}

                      {/* Label Text */}
                      {isTrack && words.length >= 2 ? (
                        <div className="luxury-btn-text-multiline">
                          <span>{words[0]}</span>
                          <span>{words.slice(1).join(' ')}</span>
                        </div>
                      ) : (
                        <span className="luxury-btn-text">{item.label}</span>
                      )}
                    </button>
                  );
                })}

              {currentRole === 'staff' &&
                staffNav.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`luxury-staff-btn ${isActive ? 'active' : ''}`}
                      title={item.label}
                    >
                      <span className="luxury-flare-accent" />
                      <span className="luxury-btn-text">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Moving Announcement Ticker: Highlight Quick Crop Assessment moving Left to Right */}
      {!isAuthPage && currentRole === 'farmer' && (
        <div
          style={{
            background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd5 50%, #fff7ed 100%)',
            borderTop: '1px solid #fed7aa',
            borderBottom: '1px solid #fdba74',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
          className="header-quick-assessment-ticker"
        >
          {/* Static Left Badge */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, #fff7ed 82%, rgba(255, 247, 237, 0) 100%)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '1rem',
              paddingRight: '1.25rem',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap',
              }}
            >
              <span>⚡</span>
              <span>AI SPOTLIGHT</span>
            </span>
          </div>

          {/* Infinite Moving Ticker Track (Moving Left to Right) */}
          <div
            onClick={() => onNavigate('crop-assessment')}
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'tickerMoveLeftToRight 30s linear infinite',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            className="ticker-track"
            title="Click to launch Quick Crop Assessment"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', paddingRight: '3rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#9a3412', fontWeight: 700, fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🔬</span>
                  <span><strong>Quick Crop Assessment:</strong> Instant AI photo scan for pest diagnosis & APMC quality grading (Grade A / B / C)</span>
                </span>
                <span style={{ color: '#ea580c', fontSize: '0.75rem' }}>•</span>
                <span style={{ color: '#7c2d12', fontSize: '0.825rem', fontWeight: 600 }}>
                  📷 Use live camera (Back & Front options) or upload photo to assess your grain before mandi visit
                </span>
                <span style={{ color: '#ea580c', fontSize: '0.75rem' }}>•</span>
                <span style={{ color: '#c2410c', fontWeight: 800, fontSize: '0.825rem', textDecoration: 'underline' }}>
                  Try Assessment Now →
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', paddingRight: '3rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#9a3412', fontWeight: 700, fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🔬</span>
                  <span><strong>Quick Crop Assessment:</strong> Instant AI photo scan for pest diagnosis & APMC quality grading (Grade A / B / C)</span>
                </span>
                <span style={{ color: '#ea580c', fontSize: '0.75rem' }}>•</span>
                <span style={{ color: '#7c2d12', fontSize: '0.825rem', fontWeight: 600 }}>
                  📷 Use live camera (Back & Front options) or upload photo to assess your grain before mandi visit
                </span>
                <span style={{ color: '#ea580c', fontSize: '0.75rem' }}>•</span>
                <span style={{ color: '#c2410c', fontWeight: 800, fontSize: '0.825rem', textDecoration: 'underline' }}>
                  Try Assessment Now →
                </span>
              </span>
            </div>
          </div>

          {/* Right Edge Fade */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '40px',
              background: 'linear-gradient(270deg, #fff7ed 20%, rgba(255, 247, 237, 0) 100%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {!isAuthPage && mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            background: '#ffffff',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {currentRole === 'farmer' && (
            <>
              <div
                style={{
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 600,
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                Logged in as: {currentFarmer?.full_name || 'Farmer'} ({currentFarmer?.mobile || 'Demo'})
              </div>
              {farmerNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    textAlign: 'left',
                    background: activeTab === item.id ? 'var(--color-primary-light)' : 'transparent',
                    color: activeTab === item.id ? 'var(--color-primary-dark)' : 'var(--color-text-main)',
                    fontWeight: activeTab === item.id ? 700 : 500,
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  {renderLuxuryIcon(item.iconKey)}
                  <span>{item.label}</span>
                </button>
              ))}
              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  style={{
                    textAlign: 'left',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    fontWeight: 700,
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <LogOut size={16} />
                  <span>{t.logout || 'Logout'}</span>
                </button>
              )}
            </>
          )}

          {currentRole === 'staff' && (
            <>
              <div
                style={{
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-secondary-dark)',
                  fontWeight: 600,
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                Staff Portal: {staffUser?.name || 'Officer'}
              </div>
              {staffNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    textAlign: 'left',
                    background: activeTab === item.id ? 'var(--color-secondary-light)' : 'transparent',
                    color: activeTab === item.id ? 'var(--color-secondary-dark)' : 'var(--color-text-main)',
                    fontWeight: activeTab === item.id ? 700 : 500,
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </>
          )}
        </div>
      )}
      {/* Media Query & Animation Helpers */}
      <style>{`
        @keyframes tickerMoveLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        /* Luxury Console fulfilling horizontal line */
        .luxury-gold-console {
          display: flex;
          width: 100%;
          gap: 0.5rem;
          align-items: center;
          justify-content: center;
        }

        /* 3D Jewel Green & Gold Button (Matches User Reference Image) */
        .luxury-gold-btn {
          flex: 1;
          max-width: 170px;
          min-width: 110px;
          height: 38px;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          cursor: pointer;
          position: relative;
          user-select: none;
          white-space: nowrap;
          background: radial-gradient(circle at 18% 25%, rgba(255, 245, 205, 0.22) 0%, transparent 50%),
                      linear-gradient(180deg, #1f492b 0%, #13391f 50%, #0b2413 100%);
          border: 1.2px solid #caa04d;
          box-shadow: 
            0 2px 5px rgba(0, 0, 0, 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.35),
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.5);
          transition: all 0.18s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .luxury-gold-btn:hover {
          transform: translateY(-1.5px);
          filter: brightness(1.12);
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.22),
            inset 0 1px 2px rgba(255, 255, 255, 0.5),
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.6);
        }

        .luxury-gold-btn:active {
          transform: translateY(0.5px);
          filter: brightness(0.96);
        }

        /* Active Tab - Brushed Antique Bronze / Copper Plate (matches "History" in user's image) */
        .luxury-gold-btn.active {
          background: radial-gradient(circle at 18% 25%, rgba(255, 240, 220, 0.25) 0%, transparent 50%),
                      linear-gradient(180deg, #9e6d4c 0%, #7e5033 50%, #5d351e 100%) !important;
          border-color: #e5a777 !important;
          box-shadow: 
            0 2px 5px rgba(60, 25, 10, 0.25),
            inset 0 1px 1px rgba(255, 255, 255, 0.45),
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.5) !important;
        }

        .luxury-btn-text {
          font-family: 'Playfair Display', 'Cinzel', Georgia, 'Times New Roman', serif;
          font-size: 0.84rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #f7eed8;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .luxury-gold-btn.active .luxury-btn-text {
          color: #fff6ed !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }

        .luxury-btn-text-multiline {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.05;
          font-family: 'Playfair Display', 'Cinzel', Georgia, 'Times New Roman', serif;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #f7eed8;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .luxury-gold-btn.active .luxury-btn-text-multiline {
          color: #fff6ed !important;
        }

        .luxury-icon-tile {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
        }

        /* Specular flare gleam at top-left corner (matches Dashboard gleam in user's image) */
        .luxury-flare-accent {
          position: absolute;
          top: -1px;
          left: 6px;
          width: 26px;
          height: 3.5px;
          background: radial-gradient(ellipse at center, rgba(255, 250, 200, 0.9) 0%, rgba(255, 230, 140, 0.4) 45%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          filter: blur(0.4px);
          z-index: 2;
        }

        /* Staff navigation buttons in royal sapphire */
        .luxury-staff-btn {
          flex: 1;
          max-width: 135px;
          min-width: 90px;
          height: 38px;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          cursor: pointer;
          position: relative;
          user-select: none;
          white-space: nowrap;
          background: radial-gradient(circle at 18% 25%, rgba(200, 225, 255, 0.25) 0%, transparent 50%),
                      linear-gradient(180deg, #1b3858 0%, #102640 50%, #081728 100%);
          border: 1.2px solid #5a94d6;
          box-shadow: 
            0 2px 5px rgba(0, 0, 0, 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.35),
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.5);
          transition: all 0.18s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .luxury-staff-btn:hover {
          transform: translateY(-1.5px);
          filter: brightness(1.15);
        }

        .luxury-staff-btn.active {
          background: radial-gradient(circle at 18% 22%, rgba(255, 240, 220, 0.25) 0%, transparent 45%),
                      linear-gradient(180deg, #9e6d4c 0%, #7e5033 50%, #5d351e 100%) !important;
          border-color: #e5a777 !important;
          box-shadow: 
            0 2px 5px rgba(60, 25, 10, 0.25),
            inset 0 1px 1px rgba(255, 255, 255, 0.45),
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.5) !important;
        }

        .luxury-staff-btn .luxury-btn-text {
          font-size: 0.82rem;
        }
        .ticker-track:hover {
          animation-play-state: paused !important;
        }
        @media (min-width: 900px) {
          .desktop-nav-bar {
            display: block !important;
          }
          .desktop-badge {
            display: inline-flex !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-nav-bar {
            display: none !important;
          }
          .tagline-divider,
          .tagline-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
