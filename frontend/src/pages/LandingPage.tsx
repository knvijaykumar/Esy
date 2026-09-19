import React, { useState, useEffect, useRef } from 'react';
import {
  Sprout,
  ShieldCheck,
  Play,
  ArrowLeft,
  Clock,
  UserCheck,
  MapPin,
  Calendar,
  QrCode,
  Truck,
  ExternalLink,
  Landmark,
  PhoneCall,
  CheckCircle2,
  Leaf,
  Scale,
  ArrowRight,
  ChevronDown,
  ChevronsDown,
  X,
  Search,
  RotateCcw,
} from 'lucide-react';
import { SMARTER_FARMING_FEATURES } from '../data/smarterFarmingFeatures';


interface LandingPageProps {
  onStartFarmer: () => void;
  onStartStaff: () => void;
  onGoRegistration: () => void;
}

interface MspCrop {
  name: string;
  kannada: string;
  category: string;
  msp: number;
  unit: string;
}

const KHARIF_MSP_CROPS: MspCrop[] = [
  { name: 'Paddy (Common)', kannada: 'ಭತ್ತ (ಸಾಮಾನ್ಯ)', category: 'Cereals', msp: 2369, unit: '₹ / Quintal' },
  { name: 'Paddy (Grade A)', kannada: 'ಭತ್ತ (ಗ್ರೇಡ್ ಎ)', category: 'Cereals', msp: 2389, unit: '₹ / Quintal' },
  { name: 'Jowar (Hybrid)', kannada: 'ಜೋಳ (ಹೈಬ್ರಿಡ್)', category: 'Millets', msp: 3699, unit: '₹ / Quintal' },
  { name: 'Jowar (Maldandi)', kannada: 'ಜೋಳ (ಮಾಲ್ದಂಡಿ)', category: 'Millets', msp: 3749, unit: '₹ / Quintal' },
  { name: 'Bajra', kannada: 'ಸಜ್ಜೆ', category: 'Millets', msp: 2775, unit: '₹ / Quintal' },
  { name: 'Ragi', kannada: 'ರಾಗಿ', category: 'Millets', msp: 4886, unit: '₹ / Quintal' },
  { name: 'Maize', kannada: 'ಮೆಕ್ಕೆಜೋಳ', category: 'Cereals', msp: 2360, unit: '₹ / Quintal' },
  { name: 'Tur / Arhar', kannada: 'ತೊಗರಿ ಬೇಳೆ', category: 'Pulses', msp: 7950, unit: '₹ / Quintal' },
  { name: 'Moong', kannada: 'ಹೆಸರು ಕಾಳು', category: 'Pulses', msp: 8980, unit: '₹ / Quintal' },
  { name: 'Urad', kannada: 'ಉದ್ದಿನ ಕಾಳು', category: 'Pulses', msp: 7800, unit: '₹ / Quintal' },
  { name: 'Groundnut', kannada: 'ಕಡಲೆಕಾಯಿ', category: 'Oilseeds', msp: 7120, unit: '₹ / Quintal' },
  { name: 'Sunflower Seed', kannada: 'ಸೂರ್ಯಕಾಂತಿ ಬೀಜ', category: 'Oilseeds', msp: 7650, unit: '₹ / Quintal' },
  { name: 'Soybean (Yellow)', kannada: 'ಸೋಯಾಬೀನ್ (ಹಳದಿ)', category: 'Oilseeds', msp: 5150, unit: '₹ / Quintal' },
  { name: 'Sesamum', kannada: 'ಎಳ್ಳು', category: 'Oilseeds', msp: 9650, unit: '₹ / Quintal' },
  { name: 'Nigerseed', kannada: 'ಹುಚ್ಚೆಳ್ಳು', category: 'Oilseeds', msp: 9100, unit: '₹ / Quintal' },
  { name: 'Cotton (Medium Staple)', kannada: 'ಹತ್ತಿ (ಮಧ್ಯಮ)', category: 'Commercial', msp: 7450, unit: '₹ / Quintal' },
  { name: 'Cotton (Long Staple)', kannada: 'ಹತ್ತಿ (ಉದ್ದ)', category: 'Commercial', msp: 7850, unit: '₹ / Quintal' },
];

const RABI_MSP_CROPS: MspCrop[] = [
  { name: 'Wheat', kannada: 'ಗೋಧಿ', category: 'Cereals', msp: 2425, unit: '₹ / Quintal' },
  { name: 'Barley', kannada: 'ಬಾರ್ಲಿ', category: 'Cereals', msp: 1980, unit: '₹ / Quintal' },
  { name: 'Gram (Chana)', kannada: 'ಕಡಲೆ (ಚಣ)', category: 'Pulses', msp: 5650, unit: '₹ / Quintal' },
  { name: 'Lentil (Masur)', kannada: 'ಮಸೂರ್ ಬೇಳೆ', category: 'Pulses', msp: 6700, unit: '₹ / Quintal' },
  { name: 'Rapeseed & Mustard', kannada: 'ಸಾಸಿವೆ', category: 'Oilseeds', msp: 5950, unit: '₹ / Quintal' },
  { name: 'Safflower', kannada: 'ಕುಸುಮೆ', category: 'Oilseeds', msp: 5940, unit: '₹ / Quintal' },
];

const KHARIF_POPULAR_SEARCHES = ['Paddy', 'Ragi', 'Maize', 'Tur / Arhar', 'Moong', 'Groundnut', 'Cotton'];
const RABI_POPULAR_SEARCHES = ['Wheat', 'Gram (Chana)', 'Barley', 'Rapeseed & Mustard', 'Lentil'];

const highlightMatch = (text: string, query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: '#fef08a',
              color: '#854d0e',
              padding: '0.1rem 0.25rem',
              borderRadius: '3px',
              fontWeight: 700,
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFarmer,
  onStartStaff,
  onGoRegistration,
}) => {
  const [activeSeason, setActiveSeason] = useState<'kharif' | 'rabi'>('kharif');
  const [isMspPaused, setIsMspPaused] = useState(false);
  const [mspSearchQuery, setMspSearchQuery] = useState('');
  const [mspSelectedCategory, setMspSelectedCategory] = useState('all');
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isSideHintDismissed, setIsSideHintDismissed] = useState(false);
  const mspScrollRef = useRef<HTMLDivElement>(null);
  const mspInputRef = useRef<HTMLInputElement>(null);

  // Monitor scroll depth to toggle side hint visibility smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll down to the next main section
  const scrollToMoreInfo = () => {
    const target = document.getElementById('official-msp-rates');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        mspInputRef.current?.focus();
      }, 450);
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  const currentCrops = activeSeason === 'kharif' ? KHARIF_MSP_CROPS : RABI_MSP_CROPS;
  const otherSeasonCrops = activeSeason === 'kharif' ? RABI_MSP_CROPS : KHARIF_MSP_CROPS;
  const otherSeasonName = activeSeason === 'kharif' ? 'Winter Crop Season 2026–27' : 'Rain Crop Season 2026–27';
  const otherSeasonKey = activeSeason === 'kharif' ? 'rabi' : 'kharif';

  const cleanQuery = mspSearchQuery.trim().toLowerCase();
  const isSearchActive = cleanQuery.length > 0;
  const isCategoryActive = mspSelectedCategory !== 'all';
  const isFiltering = isSearchActive || isCategoryActive;

  // Filter crops
  const filteredCrops = currentCrops.filter((crop) => {
    const matchesSearch =
      !cleanQuery ||
      crop.name.toLowerCase().includes(cleanQuery) ||
      crop.kannada.toLowerCase().includes(cleanQuery) ||
      crop.category.toLowerCase().includes(cleanQuery) ||
      crop.msp.toString().includes(cleanQuery);

    const matchesCategory =
      mspSelectedCategory === 'all' ||
      crop.category.toLowerCase() === mspSelectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Cross-season matches when current season yields 0 matches
  const otherSeasonMatches = isSearchActive
    ? otherSeasonCrops.filter(
        (crop) =>
          crop.name.toLowerCase().includes(cleanQuery) ||
          crop.kannada.toLowerCase().includes(cleanQuery) ||
          crop.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  // When filtered or search active: show filtered crops directly without duplicate loop.
  // When not filtering: show duplicated loop for continuous crawl.
  const displayCrops = isFiltering ? filteredCrops : [...currentCrops, ...currentCrops];

  // Auto-scroll is paused if user hovered or if currently filtering/searching
  const isAutoScrollEffectivePaused = isMspPaused || isFiltering;

  // Reset scroll on season, search query, or category change
  useEffect(() => {
    if (mspScrollRef.current) {
      mspScrollRef.current.scrollTop = 0;
    }
  }, [activeSeason, mspSearchQuery, mspSelectedCategory]);

  // Smooth slow automatic scrolling down
  useEffect(() => {
    const el = mspScrollRef.current;
    if (!el || isAutoScrollEffectivePaused) return;

    let animId: number;
    let lastTime: number | null = null;
    const speed = 25; // gentle, readable slow crawl (~25px per second)

    const step = (time: number) => {
      if (!isAutoScrollEffectivePaused && el) {
        if (lastTime !== null) {
          const delta = (time - lastTime) / 1000;
          el.scrollTop += speed * delta;

          // Seamless loop when top half has completely scrolled through
          const halfHeight = el.scrollHeight / 2;
          if (halfHeight > 0 && el.scrollTop >= halfHeight) {
            el.scrollTop -= halfHeight;
          }
        }
        lastTime = time;
      } else {
        lastTime = null;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isAutoScrollEffectivePaused, activeSeason]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#0f172a' }}>

      {/* Top Navbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 4rem', background: '#0f172a', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Left Links */}
        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <span
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ cursor: 'pointer', color: '#86efac' }}
          >
            • Home
          </span>
          <span
            onClick={() => {
              document.getElementById('official-msp-rates')?.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => mspInputRef.current?.focus(), 450);
            }}
            style={{ cursor: 'pointer', opacity: 0.85 }}
          >
            Official MSP
          </span>
          <span
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer', opacity: 0.85 }}
          >
            How it Works
          </span>
          <span
            onClick={() => document.getElementById('tutorial-video')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer', opacity: 0.85 }}
          >
            Tutorial Video
          </span>
        </nav>

        {/* Center Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '1px' }}>
          <img
            src="/bks-logo.png"
            alt="Bharat Krishi Seva"
            style={{
              height: '72px',
              width: '72px',
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          />
          BHARAT KRISHI SEVA
        </div>

        {/* Right Links & Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <button
            onClick={onGoRegistration}
            style={{
              background: '#dcfce7',
              color: '#166534',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#bbf7d0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#dcfce7';
            }}
          >
            Login Now
          </button>

          <button
            onClick={onStartStaff}
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              padding: '0.55rem 1.15rem',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
            }}
            title="Access Staff & Officer Portal"
          >
            <ShieldCheck size={16} color="#86efac" />
            <span>Staff Login Portal</span>
          </button>
        </div>
      </header>

      {/* ==================================================
          AI SPOTLIGHT - Autonomous Moving Marquee
          (Non-touchable, pointer-events: none, continuous auto-motion, purely informative)
          ================================================== */}
      <div
        className="landing-ai-spotlight-bar"
        style={{
          background: 'linear-gradient(90deg, #0b1329 0%, #0f172a 35%, #132238 65%, #0b1329 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(34, 197, 94, 0.22)',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 30,
        }}
      >
        {/* Static Left Badge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #0b1329 82%, rgba(11, 19, 41, 0) 100%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1.5rem',
            paddingRight: '1.75rem',
          }}
        >
          <span
            className="ai-spotlight-badge"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              padding: '0.22rem 0.65rem',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span>⚡</span>
            <span>AI SPOTLIGHT</span>
          </span>
        </div>

        {/* Infinite Moving Ticker Track (Moving slowly Right to Left, non-touchable) */}
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'landingAiSpotlightMove 38s linear infinite',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          className="landing-ai-ticker-track"
        >
          {/* Segment 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', paddingRight: '3rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5rem', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#86efac', fontWeight: 700, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>🌱</span>
                <span><strong>Quick Crop Assessment:</strong> AI-powered crop identification, condition analysis, and visible issue detection</span>
              </span>
              <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>•</span>
              <span style={{ color: '#dcfce7', fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>🌱</span>
                <span><strong>Quick Crop Assessment:</strong> AI-powered crop identification, condition analysis, and visible issue detection</span>
              </span>
              <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>•</span>
            </span>
          </div>

          {/* Segment 2 (Duplicate for seamless continuous right-to-left loop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', paddingRight: '3rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5rem', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#86efac', fontWeight: 700, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>🌱</span>
                <span><strong>Quick Crop Assessment:</strong> AI-powered crop identification, condition analysis, and visible issue detection</span>
              </span>
              <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>•</span>
              <span style={{ color: '#dcfce7', fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>🌱</span>
                <span><strong>Quick Crop Assessment:</strong> AI-powered crop identification, condition analysis, and visible issue detection</span>
              </span>
              <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>•</span>
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
            width: '60px',
            background: 'linear-gradient(270deg, #0b1329 20%, rgba(11, 19, 41, 0) 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ==================================================
          1. HERO SECTION
          ================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '660px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 4rem',
      }}>
        {/* Autonomous Moving AI Spotlight Beam Glow (Purely visual, non-touchable) */}
        <div
          className="landing-ambient-ai-spotlight"
          style={{
            position: 'absolute',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.16) 0%, rgba(16, 185, 129, 0.07) 40%, rgba(15, 23, 42, 0) 70%)',
            filter: 'blur(65px)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
            top: '-5%',
            left: '25%',
            animation: 'ambientAiSpotlightSweep 18s ease-in-out infinite alternate',
          }}
        />

        {/* Animated Floating Farmer Background Layer with Lifelike Eye Blinking */}
        <div
          className="floating-farmer-container"
          style={{
            position: 'absolute',
            top: '-25px',
            left: '-25px',
            right: '-25px',
            bottom: '-25px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* Base Layer: Open Eyes */}
          <div
            className="floating-farmer-layer"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("/farmer-hero-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
            }}
          />

          {/* Blink Layer: Eyelids Closed (Fades in/out periodically for realistic blinking) */}
          <div
            className="floating-farmer-layer floating-farmer-blink"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("/farmer-hero-blink.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
            }}
          />
        </div>

        {/* Ambient Floating Sprout and Leaf Accents */}
        <div className="floating-ambient-leaf leaf-1" style={{ position: 'absolute', top: '22%', right: '48%', zIndex: 3, opacity: 0.45, pointerEvents: 'none' }}>
          <Leaf size={30} color="#166534" />
        </div>
        <div className="floating-ambient-leaf leaf-2" style={{ position: 'absolute', bottom: '20%', right: '28%', zIndex: 3, opacity: 0.4, pointerEvents: 'none' }}>
          <Sprout size={36} color="#15803d" />
        </div>
        <div className="floating-ambient-leaf leaf-3" style={{ position: 'absolute', top: '14%', right: '18%', zIndex: 3, opacity: 0.35, pointerEvents: 'none' }}>
          <Leaf size={24} color="#86efac" />
        </div>

        {/* Gradient overlay for readability on left side */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '65%', background: 'linear-gradient(90deg, rgba(240,253,244,0.96) 0%, rgba(240,253,244,0.88) 45%, rgba(240,253,244,0) 100%)', zIndex: 2 }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px' }}>
          <div style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '0.5px' }}>
            Bharat Krishi Seva
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#0f172a', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.75rem', letterSpacing: '-1px' }}>
            Smart Farm Procurement <br />
            <span style={{ color: '#166534' }}>Slot Booking Guaranteed</span>
          </h1>
          <h2 style={{ fontSize: '1.25rem', color: '#166534', fontWeight: 700, marginBottom: '1.25rem' }}>
            ಕರ್ನಾಟಕದ ರೈತರಿಗೆ ನೇರ ಬೆಂಬಲ ಬೆಲೆ ಅಂದಾಜು ಮತ್ತು ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಸೇವೆ
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '1rem', fontWeight: 500, lineHeight: 1.6 }}>
            Calculate your estimated crop payout using official MSP rates, locate your nearest APMC centre, and book a guaranteed drop-off slot to avoid yard congestion.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem', fontStyle: 'italic' }}>
            *Platform provides price estimates and scheduling only. No transactions handled online.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={onStartFarmer} style={{ background: '#166534', color: '#ffffff', border: 'none', padding: '0.8rem 1.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Estimate Price & Book</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '0.2rem' }}>ಬೆಲೆ ಅಂದಾಜು & ಬುಕಿಂಗ್</span>
            </button>
            <button
              onClick={() => {
                document.getElementById('official-msp-rates')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => mspInputRef.current?.focus(), 450);
              }}
              style={{ background: '#ffffff', color: '#166534', border: '2px solid #166534', padding: '0.8rem 1.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <span style={{ fontWeight: 700, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Search size={18} />
                <span>Search Official MSP Rates</span>
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '0.2rem' }}>ಬೆಲೆ ಪಟ್ಟಿ & ಹುಡುಕಾಟ</span>
            </button>
          </div>
        </div>

        {/* Floating Badges with gentle organic float animations */}
        <div style={{ position: 'absolute', right: '4rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
          <div className="floating-badge badge-float-1" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.95)', padding: '1.25rem 1.75rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', minWidth: '340px', borderLeft: '4px solid #166534' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '50%' }}>
              <Leaf size={24} color="#166534" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>100% Transparent</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Official MSP rates & no middlemen</div>
            </div>
          </div>
          <div className="floating-badge badge-float-2" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.95)', padding: '1.25rem 1.75rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', minWidth: '340px', borderLeft: '4px solid #166534' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '50%' }}>
              <Landmark size={24} color="#166534" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>Accurate MSP Estimation</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Calculate expected crop value upfront</div>
            </div>
          </div>
          <div className="floating-badge badge-float-3" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.95)', padding: '1.25rem 1.75rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', minWidth: '340px', borderLeft: '4px solid #166534' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '50%' }}>
              <ShieldCheck size={24} color="#166534" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>Guaranteed Slot Token</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Direct SMS appointment for APMC drop-off</div>
            </div>
          </div>
        </div>

        {/* Floating Animation & Blinking Eye Styles */}
        <style>{`
          .floating-farmer-container {
            animation: floatFarmerMovement 11s ease-in-out infinite alternate;
            will-change: transform;
          }

          @keyframes floatFarmerMovement {
            0% {
              transform: scale(1.02) translateY(0px) translateX(0px);
            }
            33% {
              transform: scale(1.05) translateY(-14px) translateX(6px);
            }
            66% {
              transform: scale(1.04) translateY(-8px) translateX(-4px);
            }
            100% {
              transform: scale(1.06) translateY(-18px) translateX(4px);
            }
          }

          /* Natural Human Blinking Pattern */
          .floating-farmer-blink {
            opacity: 0;
            animation: farmerBlinkCycle 4.8s infinite;
            will-change: opacity;
          }

          @keyframes farmerBlinkCycle {
            0%, 65%, 72%, 78%, 100% {
              opacity: 0;
            }
            /* Natural quick first blink ~120ms */
            68%, 70% {
              opacity: 1;
            }
            /* Subtle secondary micro-blink ~100ms */
            75%, 76.5% {
              opacity: 1;
            }
          }

          @keyframes badgeFloat1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes badgeFloat2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-13px); }
          }
          @keyframes badgeFloat3 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-9px); }
          }

          .badge-float-1 {
            animation: badgeFloat1 5.2s ease-in-out infinite;
          }
          .badge-float-2 {
            animation: badgeFloat2 6s ease-in-out 0.9s infinite;
          }
          .badge-float-3 {
            animation: badgeFloat3 5.5s ease-in-out 1.7s infinite;
          }

          @keyframes floatLeafDrift1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(14px, -22px) rotate(16deg); }
          }
          @keyframes floatLeafDrift2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-12px, -26px) rotate(-14deg); }
          }
          @keyframes floatLeafDrift3 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(16px, -18px) rotate(22deg); }
          }

          .leaf-1 { animation: floatLeafDrift1 6.5s ease-in-out infinite; }
          .leaf-2 { animation: floatLeafDrift2 8s ease-in-out 1.5s infinite; }
          .leaf-3 { animation: floatLeafDrift3 7.2s ease-in-out 2.8s infinite; }

          .msp-scroll-box::-webkit-scrollbar {
            width: 6px;
          }
          .msp-scroll-box::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 4px;
          }
          .msp-scroll-box::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .msp-scroll-box::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          /* Autonomous AI Spotlight Marquee & Visual Spotlight Styles */
          .landing-ai-spotlight-bar,
          .landing-ai-ticker-track,
          .landing-ambient-ai-spotlight {
            pointer-events: none !important;
            user-select: none !important;
          }

          @keyframes landingAiSpotlightMove {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes ambientAiSpotlightSweep {
            0% {
              transform: translate(-15%, -15%) scale(0.95);
              opacity: 0.55;
            }
            35% {
              transform: translate(30%, 15%) scale(1.15);
              opacity: 0.85;
            }
            70% {
              transform: translate(5%, 35%) scale(1.0);
              opacity: 0.6;
            }
            100% {
              transform: translate(50%, -10%) scale(1.2);
              opacity: 0.8;
            }
          }

          @keyframes aiBadgeGlowPulse {
            0%, 100% {
              box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
            }
            50% {
              box-shadow: 0 2px 18px rgba(34, 197, 94, 0.75);
            }
          }

          .ai-spotlight-badge {
            animation: aiBadgeGlowPulse 3s ease-in-out infinite;
          }

          /* Smarter Farming Grid & Responsive Styles */
          .smarter-features-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }

          @media (max-width: 1140px) {
            .smarter-features-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 840px) {
            .smarter-features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .smarter-farming-container {
              padding: 2.25rem 1.5rem !important;
            }
          }

          @media (max-width: 580px) {
            .smarter-features-grid {
              grid-template-columns: 1fr;
            }
            .smarter-farming-container {
              padding: 1.75rem 1.15rem !important;
            }
          }

          .smarter-feature-card:hover {
            transform: translateY(-4px);
            border-color: #86efac !important;
            box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(22, 101, 52, 0.08) !important;
          }

          /* Side Scroll Indicator Keyframes & Micro-Animations */

          .side-scroll-mouse-icon {
            width: 19px;
            height: 29px;
            border: 2px solid #86efac;
            border-radius: 12px;
            position: relative;
            display: flex;
            justify-content: center;
            padding-top: 4px;
            flex-shrink: 0;
            box-shadow: 0 0 10px rgba(74, 222, 128, 0.35);
          }

          .side-scroll-mouse-dot {
            width: 3.5px;
            height: 6.5px;
            background-color: #4ade80;
            border-radius: 2px;
            animation: sideMouseWheelSlide 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }

          @keyframes sideMouseWheelSlide {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(11px);
            }
          }

          .side-scroll-bounce-arrow {
            animation: sideBounceChevrons 1.8s ease-in-out infinite;
          }

          @keyframes sideBounceChevrons {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(5px);
            }
            60% {
              transform: translateY(2.5px);
            }
          }

          .dock-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
          }

          .dock-hidden {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
            pointer-events: none;
          }

          @media (max-width: 640px) {
            .floating-side-scroll-dock {
              right: 0.75rem !important;
              bottom: 4.8rem !important;
              max-width: calc(100vw - 1.5rem) !important;
            }
          }
        `}</style>
      </section>

      {/* ==================================================
          2. OFFICIAL MSP RATES SECTION
          ================================================== */}
      <section
        id="official-msp-rates"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '4rem 2rem 5rem',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section Back Navigation */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease',
              }}
              title="Return to top"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#dcfce7',
                color: '#166534',
                padding: '0.35rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              <Scale size={16} color="#166534" />
              <span>Government-announced MSP</span>
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.5rem 0' }}>
              Official MSP Rates
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '700px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Know the Government-announced Minimum Support Price before booking your procurement slot.
            </p>

            {/* Season Tabs */}
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '0.35rem', borderRadius: '12px', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveSeason('kharif')}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeSeason === 'kharif' ? '#166534' : 'transparent',
                  color: activeSeason === 'kharif' ? '#ffffff' : '#475569',
                  boxShadow: activeSeason === 'kharif' ? '0 2px 8px rgba(22, 101, 52, 0.25)' : 'none',
                }}
              >
                Rain Crop Season 2026–27
              </button>
              <button
                onClick={() => setActiveSeason('rabi')}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeSeason === 'rabi' ? '#166534' : 'transparent',
                  color: activeSeason === 'rabi' ? '#ffffff' : '#475569',
                  boxShadow: activeSeason === 'rabi' ? '0 2px 8px rgba(22, 101, 52, 0.25)' : 'none',
                }}
              >
                Winter Crop Season 2026–27
              </button>
            </div>

            {/* Search Toolbar & Interactive Filtering */}
            <div
              style={{
                marginTop: '1.75rem',
                maxWidth: '750px',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {/* Main Search Input & Button Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mspInputRef.current?.blur();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.35rem 0.45rem 0.35rem 1.1rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease',
                  gap: '0.5rem',
                }}
                className="msp-search-bar-form"
              >
                <Search size={20} color="#166534" style={{ flexShrink: 0 }} />
                <input
                  ref={mspInputRef}
                  id="msp-search-input"
                  type="text"
                  value={mspSearchQuery}
                  onChange={(e) => setMspSearchQuery(e.target.value)}
                  placeholder="Search crop (e.g., Paddy, Ragi, ಭತ್ತ, Maize) or category..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    padding: '0.5rem 0.25rem',
                    background: 'transparent',
                    fontWeight: 500,
                  }}
                />

                {mspSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setMspSearchQuery('');
                      mspInputRef.current?.focus();
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: 0,
                    }}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}

                {/* Explicit Enabled Search Button */}
                <button
                  type="submit"
                  id="msp-search-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: '#166534',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem 1.35rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(22, 101, 52, 0.3)',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#166534')}
                  title="Click to search crops"
                >
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </form>

              {/* Category Pills & Quick Filter Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginRight: '0.2rem' }}>
                  Category:
                </span>
                {['all', 'Cereals', 'Millets', 'Pulses', 'Oilseeds', 'Commercial'].map((cat) => {
                  const count =
                    cat === 'all'
                      ? currentCrops.length
                      : currentCrops.filter((c) => c.category.toLowerCase() === cat.toLowerCase()).length;
                  if (count === 0 && cat !== 'all') return null;

                  const isSelected = mspSelectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMspSelectedCategory(cat.toLowerCase())}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '20px',
                        border: isSelected ? '1px solid #166534' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        background: isSelected ? '#166534' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#475569',
                        transition: 'all 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>{cat === 'all' ? 'All' : cat}</span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#e2e8f0',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '10px',
                          color: isSelected ? '#ffffff' : '#475569',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Popular Quick Search Suggestions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  flexWrap: 'wrap',
                  fontSize: '0.78rem',
                  color: '#64748b',
                }}
              >
                <span style={{ fontWeight: 600 }}>Quick search:</span>
                {(activeSeason === 'kharif' ? KHARIF_POPULAR_SEARCHES : RABI_POPULAR_SEARCHES).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMspSearchQuery(item);
                      mspInputRef.current?.focus();
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.75rem',
                      color: '#166534',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="msp-live-badge">
                <span className="msp-live-dot" />
                <span className="msp-live-word">Live</span>
                <span style={{ fontWeight: 600, color: '#166534' }}>Official MSP Rates</span>
              </span>

              {isFiltering ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    color: '#854d0e',
                    background: '#fef9c3',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    border: '1px solid #fef08a',
                    fontWeight: 600,
                  }}
                >
                  <span>Auto-scroll paused during search</span>
                </span>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  (Continuous slow scroll • Hover to pause)
                </span>
              )}
            </div>

            {isFiltering && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMspSearchQuery('');
                    setMspSelectedCategory('all');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Dedicated MSP Rate Box with Auto-scroll (Showing crops) */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
              position: 'relative',
            }}
            onMouseEnter={() => setIsMspPaused(true)}
            onMouseLeave={() => setIsMspPaused(false)}
          >
            {/* Scrollable Container */}
            <div
              ref={mspScrollRef}
              className="msp-scroll-box"
              style={{
                height: '350px',
                overflowY: 'auto',
                overflowX: 'auto',
                position: 'relative',
                scrollBehavior: 'auto',
              }}
            >
              {filteredCrops.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b',
                      marginBottom: '1rem',
                    }}
                  >
                    <Search size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    No Commodities Found
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                    No crops matching <strong style={{ color: '#0f172a' }}>"{mspSearchQuery}"</strong>
                    {mspSelectedCategory !== 'all' ? ` in ${mspSelectedCategory}` : ''} were found in the{' '}
                    <strong>{activeSeason === 'kharif' ? 'Rain Crop Season 2026–27' : 'Winter Crop Season 2026–27'}</strong> schedule.
                  </p>

                  {/* Cross-season suggestion if match found in opposite season */}
                  {otherSeasonMatches.length > 0 && (
                    <div
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        borderRadius: '10px',
                        padding: '0.85rem 1.25rem',
                        marginBottom: '1.25rem',
                        maxWidth: '520px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        textAlign: 'left',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1, fontSize: '0.85rem', color: '#065f46' }}>
                        💡 <strong>Found in {otherSeasonName}:</strong>{' '}
                        {otherSeasonMatches.map((c) => `${c.name} (${c.kannada})`).join(', ')}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSeason(otherSeasonKey)}
                        style={{
                          background: '#166534',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Switch to {otherSeasonName}
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMspSearchQuery('');
                      setMspSelectedCategory('all');
                      mspInputRef.current?.focus();
                    }}
                    style={{
                      background: '#f1f5f9',
                      color: '#166534',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.55rem 1.25rem',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Clear Search & View All Crops</span>
                  </button>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', padding: '1rem 1.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>Crop Name</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', padding: '1rem 1.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>Category</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', padding: '1rem 1.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', textAlign: 'right', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>MSP Amount</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', padding: '1rem 1.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>Unit</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', padding: '1rem 1.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>Official Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCrops.map((crop, index) => (
                      <tr
                        key={`${crop.name}-${index}`}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: index % 2 === 0 ? '#ffffff' : '#fcfdfd',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fcfdfd')}
                      >
                        <td style={{ padding: '0.95rem 1.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                            {highlightMatch(crop.name, mspSearchQuery)}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 500 }}>
                            {highlightMatch(crop.kannada, mspSearchQuery)}
                          </div>
                        </td>
                        <td style={{ padding: '0.95rem 1.5rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '6px',
                            }}
                          >
                            {highlightMatch(crop.category, mspSearchQuery)}
                          </span>
                        </td>
                        <td style={{ padding: '0.95rem 1.5rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534' }}>
                            ₹{crop.msp.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td style={{ padding: '0.95rem 1.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                          {crop.unit}
                        </td>
                        <td style={{ padding: '0.95rem 1.5rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: '#dcfce7',
                              color: '#166534',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '12px',
                            }}
                          >
                            <CheckCircle2 size={12} />
                            Government-announced MSP
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Subtle bottom gradient indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '24px',
                background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Source Footer */}
          <div
            style={{
              marginTop: '1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            <div>
              <strong>Source:</strong> Government of India, Ministry of Agriculture & Farmers Welfare
            </div>
            <a
              href="https://agricoop.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#166534',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>View Official Government Source</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* ==================================================
          3. HOW IT WORKS & VIDEO TUTORIAL SECTION
          ================================================== */}
      <section
        id="how-it-works"
        style={{
          background: '#f8fafc',
          color: '#0f172a',
          padding: '4rem 2rem 5rem',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section Back Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={() => document.getElementById('official-msp-rates')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease',
              }}
              title="Return to previous section"
            >
              <ArrowLeft size={16} />
              <span>Back to Official MSP Rates</span>
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease',
              }}
              title="Return to top"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#dcfce7',
                color: '#166534',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              <Play size={12} fill="#166534" />
              <span>Watch & Learn • Video Walkthrough</span>
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.5rem 0' }}>
              How It Works
            </h2>
            <div style={{ fontSize: '1.05rem', color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>
              ಕರ್ನಾಟಕ ರೈತರಿಗೆ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ವೀಕ್ಷಿಸಿ
            </div>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '650px', margin: '0 auto', lineHeight: 1.5 }}>
              A seamless digital journey for Indian farmers to secure government procurement slots without yard delays.
            </p>
          </div>

          {/* Dedicated Video Tutorial Player / Card with User Provided Background */}
          <div
            id="tutorial-video"
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.08)',
              position: 'relative',
              background: '#020617',
              aspectRatio: '16 / 9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Image: The uploaded picture with farmers and landscape */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url("/tutorial-video-bg.jpg?v=2")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'none',
              }}
            />

            {/* Subtle gentle gradient only for top/bottom edge readability */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, transparent 25%, transparent 75%, rgba(15, 23, 42, 0.4) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top Badges */}
            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.5rem',
                right: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                HD 1080p
              </span>

              <span
                style={{
                  background: 'rgba(22, 101, 52, 0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(134, 239, 172, 0.4)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Clock size={13} />
                <span>60–90 sec walkthrough</span>
              </span>
            </div>

            {/* Center Content: Play Button Overlay & Frosted Text Pill */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
              }}
            >
              {/* Play Button Overlay */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  border: '3px solid #86efac',
                  boxShadow: '0 0 35px rgba(34, 197, 94, 0.65), 0 10px 25px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 0 45px rgba(34, 197, 94, 0.85), 0 12px 30px rgba(0, 0, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(34, 197, 94, 0.65), 0 10px 25px rgba(0, 0, 0, 0.5)';
                }}
                title="Play tutorial video"
              >
                <Play size={36} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
              </div>

              {/* Transparent Text Overlay without blocking background image */}
              <div
                style={{
                  textAlign: 'center',
                  background: 'transparent',
                  backdropFilter: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0',
                  border: 'none',
                  boxShadow: 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.01em',
                    marginBottom: '0.25rem',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  Tutorial video coming soon
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#ffffff',
                    maxWidth: '480px',
                    margin: '0 auto',
                    lineHeight: 1.45,
                    fontWeight: 600,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  See how to estimate your crop value, book a procurement slot and get your digital token.
                </div>
              </div>
            </div>

            {/* Bottom Glass Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.85rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.825rem',
                color: '#cbd5e1',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span>Esy FARM — Smart Agricultural Procurement Platform</span>
              </div>
              <span style={{ color: '#94a3b8' }}>Video slot ready (16:9 MP4/WebM)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          3.5. ALL-IN-ONE SMARTER FARMING PLATFORM FEATURES
          (Immediately after Tutorial Video & before Footer)
          ================================================== */}
      <section
        id="smarter-farming"
        style={{
          background: '#f8fafc',
          color: '#0f172a',
          padding: '4.5rem 1.5rem 5.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          {/* Master Box With Shadow */}
          <div
            className="smarter-farming-container"
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.09), 0 4px 16px -2px rgba(15, 23, 42, 0.04)',
              padding: '3.5rem 3rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle decorative top accent bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 35%, #0284c7 70%, #10b981 100%)',
              }}
            />

            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                }}
              >
                <span>🌾</span>
                <span>All-in-One Platform</span>
              </div>

              <h2
                style={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.75rem 0',
                  lineHeight: 1.25,
                }}
              >
                🚜 Everything You Need for Smarter Farming
              </h2>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#64748b',
                  maxWidth: '780px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                &ldquo;From checking your crop to finding a centre and choosing the right slot — Esy FARM puts it all in one place.&rdquo;
              </p>
            </div>

            {/* Feature Cards Grid (Desktop 3-4 cards/row, Tablet 2, Mobile 1) */}
            <div className="smarter-features-grid">
              {SMARTER_FARMING_FEATURES.map((feat) => (
                <div
                  key={feat.id}
                  className="smarter-feature-card"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Top Bar: Icon Badge + Optional Category Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: feat.bgLight || '#f0fdf4',
                        border: `1px solid ${(feat.accentColor || '#16a34a')}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.45rem',
                      }}
                    >
                      {feat.icon}
                    </div>
                    {feat.badge && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: feat.accentColor || '#166534',
                          background: feat.bgLight || '#f0fdf4',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          border: `1px solid ${(feat.accentColor || '#166534')}30`,
                        }}
                      >
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  {/* Feature Title */}
                  <h3
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.35,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{feat.icon}</span>
                    <span>{feat.title}</span>
                  </h3>

                  {/* Feature Description */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      margin: 0,
                      lineHeight: 1.55,
                      flexGrow: 1,
                    }}
                  >
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Section End CTA */}
            <div
              className="smarter-farming-cta-box"
              style={{
                marginTop: '3.5rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
                border: '1.5px solid #86efac',
                borderRadius: '20px',
                padding: '2.5rem 2rem',
                boxShadow: '0 10px 25px -5px rgba(22, 101, 52, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#14532d',
                  margin: '0 0 0.5rem 0',
                  letterSpacing: '-0.01em',
                }}
              >
                🌱 Smarter Farming Starts Here
              </h3>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#166534',
                  margin: '0 0 1.5rem 0',
                  maxWidth: '580px',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                Explore Esy FARM and make your procurement journey easier.
              </p>
              <button
                onClick={onGoRegistration}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: '#166534',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 2.25rem',
                  borderRadius: '10px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 101, 52, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#15803d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 101, 52, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#166534';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(22, 101, 52, 0.35)';
                }}
              >
                <span>Start Exploring</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          4. FOOTER SECTION
          ================================================== */}
      <footer style={{ background: '#090d16', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '3.5rem 4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Col 1: Platform Overview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.85rem' }}>
                <img
                  src="/bks-logo.png"
                  alt="Logo"
                  style={{
                    height: '52px',
                    width: '52px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <span>Bharat Krishi Seva</span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', margin: 0 }}>
                Esy FARM is developed as an educational and demonstration project to explore digital solutions for agricultural procurement. The information, AI results, estimates, and workflows are intended for demonstration purposes only and are not meant for real-world use or official decisions. DISCLAIMER BY — Mr. Vijay Kumar K N
              </p>
            </div>

            {/* Col 2: Kisan Helpline */}
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
                Kisan Support & Helpline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                <PhoneCall size={18} />
                <span>Coming Soon</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Toll-free helpline assistance will be available soon for all registered farmers.
              </p>
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                Email: <a href="mailto:vijaykumarkn20@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>vijaykumarkn20@gmail.com</a>
              </div>
            </div>

            {/* Col 3: Quick Navigation */}
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
                Platform Navigation
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <li>
                  <span
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}
                  >
                    ↑ Back to Top
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => document.getElementById('official-msp-rates')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}
                  >
                    Official MSP Rates
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}
                  >
                    How It Works
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => document.getElementById('tutorial-video')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}
                  >
                    Watch Tutorial Video
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Administrative Portal */}
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
                Officer & Mandi Portal
              </div>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Authorized APMC officials, verification officers, and procurement centre managers can log in or register new centres.
              </p>
              <button
                onClick={onStartStaff}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <ShieldCheck size={16} color="#86efac" />
                <span>Staff Login Portal</span>
              </button>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
          </div>

        </div>
      </footer>

      {/* Floating Side Scroll Hint Dock (Positioned at side, above the chat button) */}
      {!isSideHintDismissed && (
        <aside
          className={`floating-side-scroll-dock ${isScrolledDown ? 'dock-hidden' : 'dock-visible'}`}
          style={{
            position: 'fixed',
            right: '1.5rem',
            bottom: '5.4rem',
            zIndex: 920,
            maxWidth: '350px',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          aria-label="Scroll down for more information"
        >
          <div
            onClick={scrollToMoreInfo}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.95) 100%)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1.5px solid rgba(74, 222, 128, 0.6)',
              borderRadius: '14px',
              padding: '0.9rem 1.15rem',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(34, 197, 94, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              position: 'relative',
              userSelect: 'none',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#86efac';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(34, 197, 94, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.6)';
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(34, 197, 94, 0.25)';
            }}
            title="Click to scroll down to explore Official MSP Rates, How It Works, and Smarter Farming tools"
          >
            {/* Top row: Mouse indicator + text + dismiss button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="side-scroll-mouse-icon">
                  <div className="side-scroll-mouse-dot" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                    <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.925rem', letterSpacing: '-0.01em' }}>
                      Scroll down for more info
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 600, marginTop: '2px' }}>
                    ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ
                  </div>
                </div>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSideHintDismissed(true);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
                title="Dismiss hint"
                aria-label="Dismiss scroll hint"
              >
                <X size={13} />
              </button>
            </div>

            {/* Quick section links row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.45rem', marginTop: '0.1rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('official-msp-rates')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.08)', color: '#dcfce7', padding: '2px 7px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
                >
                  🌾 MSP Rates
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.08)', color: '#dcfce7', padding: '2px 7px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
                >
                  ⚙️ How it Works
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('tutorial-video')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.08)', color: '#dcfce7', padding: '2px 7px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
                >
                  📺 Video
                </span>
              </div>
              <div className="side-scroll-bounce-arrow" style={{ color: '#4ade80', marginLeft: '0.5rem' }}>
                <ChevronsDown size={18} />
              </div>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
};
