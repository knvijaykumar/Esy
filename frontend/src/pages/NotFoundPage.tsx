import React from 'react';
import { AlertCircle, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  currentPath: string;
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ currentPath, onNavigate }) => {
  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
      <div
        className="card"
        style={{
          padding: '3rem 2rem',
          border: '1.5px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef2f2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={36} />
        </div>

        <div>
          <span
            style={{
              display: 'inline-block',
              background: '#fef2f2',
              color: '#991b1b',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            404 ERROR
          </span>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
            Page Not Found
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            The requested path <code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{currentPath}</code> does not exist or has been moved.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}>
          <button
            onClick={() => onNavigate('farmer-dashboard')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LayoutDashboard size={18} />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('landing')}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Home size={18} />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
