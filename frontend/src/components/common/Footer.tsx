import React from 'react';
import { PhoneCall, Shield, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="no-print" style={{ background: '#0f172a', color: '#cbd5e1', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#22c55e" />
              {t.platformTitle}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              {t.footerDesc}
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {t.kisanHelpline}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              <PhoneCall size={18} />
              Coming Soon
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {t.kisanHelplineSchedule}
            </p>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {t.fairPriceAssuranceTitle}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#22c55e" /> {t.mspGuarantee}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#22c55e" /> {t.dbtAssurance}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#22c55e" /> {t.weighbridgeCertified}
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#64748b',
            gap: '1rem',
          }}
        >
          <div>
            © 2026 Bharat Krishi Seva (Esy FARM)
          </div>
          <div>
            Digital Public Infrastructure for Agriculture
          </div>
        </div>
      </div>
    </footer>
  );
};
