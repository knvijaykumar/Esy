import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { StaffUser } from '../../types';
import { staffAuthService } from '../../services/staffAuthService';

interface StaffLoginPageProps {
  onLoginSuccess: (user: StaffUser) => void;
  onCancel: () => void;
  onRegisterCenter?: () => void;
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({
  onLoginSuccess,
  onCancel,
  onRegisterCenter,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your registered official email and password.');
      return;
    }

    const result = staffAuthService.login(email, password);
    if (!result.success || !result.user) {
      setError(
        result.errorMessage ||
          'This email is not registered. Only registered procurement centre users can log in. Please register your centre first.'
      );
      return;
    }

    onLoginSuccess(result.user);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '2.5rem auto', padding: '0 1rem' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={onCancel}
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
          title="Return to home page"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Top Welcome Heading */}
      <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#eff6ff',
            color: '#1d4ed8',
            padding: '0.35rem 0.95rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.65rem',
            border: '1px solid #bfdbfe',
          }}
        >
          <Building2 size={14} />
          <span>Staff & Procurement Centre Portal</span>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
          Welcome to the Staff Portal
        </h1>
        <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
          Sign in as an authorized APMC/Centre Officer or register a new procurement centre to onboard your yard.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
        }}
      >
        {/* LEFT COLUMN: Officer Login Section */}
        <div
          className="card"
          style={{
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--color-secondary, #2563eb)',
          }}
        >
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <img
                  src="/bks-logo.png"
                  alt="Bharat Krishi Seva"
                  style={{
                    height: '84px',
                    width: '84px',
                    objectFit: 'contain',
                    borderRadius: '50%',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.18)',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary, #2563eb)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Officer Portal
              </div>
              <h2 style={{ fontSize: '1.65rem', margin: '0.25rem 0 0.5rem' }}>Staff & Admin Login</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Restricted to APMC Mandi officials, verification officers, and center managers.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="staffEmail">
                  <Mail size={16} color="var(--color-secondary)" />
                  <span>Official Email Address</span>
                </label>
                <input
                  id="staffEmail"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="staffPassword">
                  <Lock size={16} color="var(--color-secondary)" />
                  <span>Password</span>
                </label>
                <input
                  id="staffPassword"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ShieldCheck size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                <span>Only registered procurement centre officers can log in. Register first if you are new.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-secondary btn-lg btn-block">
                  <span>Login to Staff Dashboard</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-outline btn-block"
                >
                  Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Register a Procurement Centre Section */}
        <div
          className="card"
          style={{
            padding: '2.5rem 2rem',
            border: '1.5px solid #bbf7d0',
            borderTop: '4px solid var(--color-primary, #15803d)',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(22, 101, 52, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'center',
          }}
        >
          <div>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: 'var(--color-primary, #15803d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                border: '2px solid #bbf7d0',
              }}
            >
              <Building2 size={30} />
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--color-primary-dark, #166534)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}
            >
              NEW TO THE OFFICER PORTAL?
            </div>

            <h3
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: 'var(--color-text)',
                marginBottom: '0.75rem',
              }}
            >
              Register a Procurement Centre
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                maxWidth: '380px',
                margin: '0 auto 1.75rem',
              }}
            >
              Register your APMC/procurement centre to use the Smart Agricultural Procurement Platform.
            </p>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>Onboard APMC Yards, PACS & FPO Centres</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>Publish daily procurement slots for local farmers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>Scan and verify digital entry tokens at gate</span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onRegisterCenter}
              className="btn btn-primary btn-lg btn-block"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                padding: '0.9rem 1.5rem',
                fontSize: '1rem',
              }}
            >
              <Building2 size={20} />
              <span>Register Procurement Centre</span>
            </button>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem' }}>
              Free government onboarding • Subject to authority approval
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
