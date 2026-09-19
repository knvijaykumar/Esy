import React from 'react';
import { ProcurementStatus } from '../../types';
import { CheckCircle, Clock, AlertCircle, CheckCheck, XCircle } from 'lucide-react';

interface BadgeProps {
  status?: ProcurementStatus | string;
  type?: 'status' | 'crop' | 'category';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'status', children }) => {
  if (type === 'crop') {
    return <span className="badge badge-crop">{children || status}</span>;
  }

  const getStatusClass = (s?: string) => {
    switch (s) {
      case 'Booking Confirmed':
        return {
          className: 'badge badge-confirmed',
          icon: <CheckCircle size={13} />,
        };
      case 'Farmer Arrived':
      case 'Quality Check':
      case 'Procurement Processing':
        return {
          className: 'badge badge-active',
          icon: <Clock size={13} />,
        };
      case 'Procurement Completed':
      case 'Completed':
        return {
          className: 'badge badge-confirmed',
          icon: <CheckCheck size={13} />,
        };
      case 'Cancelled':
        return {
          className: 'badge badge-cancelled',
          icon: <XCircle size={13} />,
        };
      default:
        return {
          className: 'badge badge-pending',
          icon: <AlertCircle size={13} />,
        };
    }
  };

  const { className, icon } = getStatusClass(status || (typeof children === 'string' ? children : undefined));

  return (
    <span className={className}>
      {icon}
      <span>{children || status}</span>
    </span>
  );
};
