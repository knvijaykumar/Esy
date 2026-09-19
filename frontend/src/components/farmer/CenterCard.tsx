import React from 'react';
import { MapPin, Clock, ArrowRight, Wheat } from 'lucide-react';
import { ProcurementCenter, Crop, District, Taluk } from '../../types';
import { Badge } from '../common/Badge';

interface CenterCardProps {
  center: ProcurementCenter;
  district?: District;
  taluk?: Taluk;
  crops: Crop[];
  onSelect: (center: ProcurementCenter) => void;
  isSelected?: boolean;
}

export const CenterCard: React.FC<CenterCardProps> = ({
  center,
  district,
  taluk,
  crops,
  onSelect,
  isSelected = false,
}) => {
  return (
    <div
      className={`card card-interactive ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(center)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        backgroundColor: isSelected ? 'var(--color-primary-light)' : '#ffffff',
        position: 'relative',
      }}
    >
      <div>
        {/* Centre Name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)' }}>
            {center.name}
          </h3>
          {isSelected && (
            <span
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                flexShrink: 0,
              }}
            >
              Selected
            </span>
          )}
        </div>

        {/* Location / Address */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.4rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem',
            marginBottom: '0.75rem',
          }}
        >
          <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            {center.address}
            {taluk && district ? ` (${taluk.name}, ${district.name})` : ''}
          </span>
        </div>

        {/* Operating Hours */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            marginBottom: '1rem',
          }}
        >
          <Clock size={14} />
          <span>Hours: {center.operating_hours}</span>
        </div>

        {/* Available Crops */}
        <div>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.45rem',
            }}
          >
            <Wheat size={14} color="var(--color-primary)" />
            <span>Available Crops for Procurement:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {crops.map((crop) => (
              <Badge key={crop.id} type="crop">
                {crop.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
        <button
          type="button"
          className={`btn btn-block ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(center);
          }}
        >
          <span>{isSelected ? 'Centre Selected' : 'Select Centre'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
