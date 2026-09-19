import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div style={{ margin: '1.5rem 0', width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: '580px',
          position: 'relative',
        }}
      >
        {/* Background track line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '20px',
            right: '20px',
            height: '3px',
            background: '#e2e8f0',
            zIndex: 1,
          }}
        />

        {/* Completed track line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '20px',
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            height: '3px',
            background: 'var(--color-primary)',
            zIndex: 2,
            transition: 'width 0.3s ease',
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3,
                cursor: isCompleted && onStepClick ? 'pointer' : 'default',
                width: `${100 / steps.length}%`,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: isCompleted
                    ? 'var(--color-primary)'
                    : isCurrent
                    ? '#ffffff'
                    : '#f1f5f9',
                  color: isCompleted
                    ? '#ffffff'
                    : isCurrent
                    ? 'var(--color-primary)'
                    : '#94a3b8',
                  border: isCurrent
                    ? '3px solid var(--color-primary)'
                    : isCompleted
                    ? 'none'
                    : '2px solid #cbd5e1',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(21, 128, 61, 0.15)' : 'none',
                }}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
              </div>
              <span
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
                  color: isCurrent
                    ? 'var(--color-primary-dark)'
                    : isCompleted
                    ? 'var(--color-text-main)'
                    : 'var(--color-text-muted)',
                  textAlign: 'center',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
