import React, { useState } from 'react';
import { ArrowUpRight, AlertCircle, Sprout, ArrowLeft } from 'lucide-react';
import { Farmer } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

interface FarmerLoginPageProps {
  onLoginSuccess: (farmer: Farmer) => void;
  onGoRegister: () => void;
  onGoStaff?: () => void;
  onCancel: () => void;
}

export const FarmerLoginPage: React.FC<FarmerLoginPageProps> = ({
  onLoginSuccess,
  onGoRegister,
  onGoStaff,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [mobileInput, setMobileInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileInput(raw);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mobileInput.length !== 10) {
      setError(t.invalidLoginError);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await authService.loginWithMobile(mobileInput);
      if (result.success && result.farmer) {
        onLoginSuccess(result.farmer);
      } else {
        setError(result.errorMessage || t.invalidLoginError);
      }
    } catch (err: any) {
      setError(err?.message || t.invalidLoginError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setMobileInput('9845123456');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: 'url("/login-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
    }}>
      {/* Top Left Back Button */}
      <button
        type="button"
        onClick={onCancel}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1.5px solid #cbd5e1',
          borderRadius: '24px',
          padding: '0.5rem 1.15rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: '#0f172a',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          zIndex: 30,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.15s ease',
        }}
        title="Go back to Home"
      >
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </button>
      
      {/* Main Split Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '1100px',
        minHeight: '650px',
        borderRadius: '32px',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>


        {/* Left Panel: Visual Area with floating animation */}
        <div
          className="floating-farmer-login-panel"
          style={{
            flex: 1,
            backgroundImage: 'url("/login-farmer-couple.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            margin: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* The image itself contains the badge and text, so no HTML content is needed here */}
        </div>

        <style>{`
          @keyframes floatFarmerCard {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.01);
            }
          }
          .floating-farmer-login-panel {
            animation: floatFarmerCard 6s ease-in-out infinite;
            will-change: transform;
          }
        `}</style>

        {/* Right Panel: Login Form */}
        <div style={{
          flex: 1,
          padding: '4rem 5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
            <img
              src="/bks-logo.png"
              alt="Bharat Krishi Seva"
              style={{
                height: '96px',
                width: '96px',
                objectFit: 'contain',
                borderRadius: '50%',
                boxShadow: '0 8px 24px rgba(21, 128, 61, 0.18)',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Welcome back, Farmer
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Please enter your 10-digit mobile number
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>Mobile Number</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobileInput}
                onChange={handleMobileChange}
                placeholder="e.g. 9845123456"
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  border: 'none',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '1.25rem',
                  outline: 'none',
                  color: '#0f172a',
                  transition: 'border-color 0.2s',
                  background: 'transparent'
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#166534'}
                onBlur={(e) => e.target.style.borderBottomColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>Remember for 30 days</span>
              </label>
              <span onClick={onCancel} style={{ fontWeight: 600, color: '#0f172a', cursor: 'pointer', textDecoration: 'underline' }}>
                Return Home
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(90deg, #14532d 0%, #064e3b 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 0.5rem 0.5rem 1.5rem',
                borderRadius: '24px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                opacity: isLoading ? 0.8 : 1,
                boxShadow: '0 10px 15px -3px rgba(20, 83, 45, 0.3)'
              }}
            >
              <span>{isLoading ? 'Logging in...' : 'Sign Up'}</span>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#bef264',
                color: '#14532d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowUpRight size={24} />
              </div>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account?{' '}
            <span onClick={onGoRegister} style={{ color: '#14532d', fontWeight: 700, cursor: 'pointer' }}>
              Register here
            </span>
          </div>

          {onGoStaff && (
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              APMC Official or Mandi Officer?{' '}
              <span onClick={onGoStaff} style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>
                Staff Login Portal &rarr;
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
