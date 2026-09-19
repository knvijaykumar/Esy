/**
 * Smarter Farming Section - Feature Configuration
 * 
 * Single source of truth for the "Everything You Need for Smarter Farming" section
 * on the Esy FARM landing page.
 * 
 * To add, remove, rename, reorder, or update any feature, modify this array.
 * The Landing Page will automatically reflect any changes without JSX edits.
 */

export interface SmarterFarmingFeature {
  id: string;
  icon: string; // Emoji or icon representation (e.g. '📍', '🌾', '🦠')
  title: string; // Feature headline
  description: string; // 1-2 sentence description
  badge?: string; // Optional badge/category label (e.g. 'Statewide', 'AI Vision')
  accentColor?: string; // Optional custom accent color (hex)
  bgLight?: string; // Optional light background color for the icon badge
}

export const SMARTER_FARMING_FEATURES: SmarterFarmingFeature[] = [
  {
    id: 'karnataka-procurement-network',
    icon: '📍',
    title: 'Karnataka-Wide Procurement Network',
    description: 'Covers all Karnataka districts, taluks, and predefined procurement centres in one place.',
    badge: 'Statewide',
    accentColor: '#0284c7',
    bgLight: '#f0f9ff',
  },
  {
    id: 'crop-identification',
    icon: '🌾',
    title: 'Crop Identification',
    description: 'Take a photo and quickly find out which crop it is.',
    badge: 'AI Vision',
    accentColor: '#16a34a',
    bgLight: '#f0fdf4',
  },
  {
    id: 'disease-detection',
    icon: '🦠',
    title: 'Disease Detection',
    description: 'Check your crop photo for common diseases and problems.',
    badge: 'Health Check',
    accentColor: '#ea580c',
    bgLight: '#fff7ed',
  },
  {
    id: 'crop-condition',
    icon: '📊',
    title: 'Crop Condition',
    description: 'See if your crop looks Healthy, Moderate, or Poor.',
    badge: 'Grading',
    accentColor: '#059669',
    bgLight: '#ecfdf5',
  },
  {
    id: 'quality-warning',
    icon: '⚠️',
    title: 'Quality Warning',
    description: 'Know about possible crop quality problems before going to the centre.',
    badge: 'Early Advisory',
    accentColor: '#d97706',
    bgLight: '#fffbeb',
  },
  {
    id: 'crop-value-estimation',
    icon: '💰',
    title: 'Crop Value Estimation',
    description: 'Get an estimated crop value based on crop details and MSP.',
    badge: 'Fair Price',
    accentColor: '#15803d',
    bgLight: '#f0fdf4',
  },
  {
    id: 'slot-demand-prediction',
    icon: '📈',
    title: 'Slot Demand Prediction',
    description: 'See which procurement slots may be more crowded.',
    badge: 'Crowd Forecast',
    accentColor: '#7c3aed',
    bgLight: '#f5f3ff',
  },
  {
    id: 'smart-slot-recommendation',
    icon: '🎯',
    title: 'Smart Slot Recommendation',
    description: 'Get a convenient slot suggestion with lower expected demand.',
    badge: 'AI Matching',
    accentColor: '#2563eb',
    bgLight: '#eff6ff',
  },
  {
    id: 'ai-farmer-assistant',
    icon: '💬',
    title: 'AI Farmer Assistant',
    description: 'Ask farming and procurement questions in English or Kannada.',
    badge: 'Bilingual AI',
    accentColor: '#0d9488',
    bgLight: '#f0fdfa',
  },
  {
    id: 'farmer-intelligence',
    icon: '📰',
    title: 'Farmer Intelligence',
    description: 'Get useful updates on schemes, technology, machinery, and procurement.',
    badge: 'Verified News',
    accentColor: '#475569',
    bgLight: '#f8fafc',
  },
  {
    id: 'stay-updated',
    icon: '📰',
    title: 'Stay Updated',
    description: 'Never miss the latest updates on government schemes, MSP, procurement, farming technology, modern agricultural machinery, and farmer advisories.',
    badge: 'Agri Updates',
    accentColor: '#059669',
    bgLight: '#ecfdf5',
  },
];
