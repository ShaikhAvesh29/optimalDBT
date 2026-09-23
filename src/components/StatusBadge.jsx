import React from 'react';
import { useTranslation } from 'react-i18next';

export function StatusBadge({ type, label }) {
  const getBadgeStyle = () => {
    switch (type) {
      case 'success':
      case 'verified':
      case 'approved':
        return 'badge-gov-green';
      case 'warning':
      case 'pending':
      case 'action':
        return 'badge-gov-amber';
      case 'info':
      case 'review':
        return 'badge-gov-blue';
      case 'danger':
      case 'missing':
      case 'conflict':
        return 'badge-gov-red';
      default:
        return 'badge-gov-slate';
    }
  };

  return (
    <span className={getBadgeStyle()}>
      {label}
    </span>
  );
}

export function FrictionBadge({ friction }) {
  const { t } = useTranslation();
  if (friction === 'low') {
    return (
      <span className="badge-gov-green text-[10px]">
        🟢 {t('results.lowEffort')}
      </span>
    );
  }
  if (friction === 'medium') {
    return (
      <span className="badge-gov-amber text-[10px]">
        🟡 {t('results.medEffort')}
      </span>
    );
  }
  return (
    <span className="badge-gov-red text-[10px]">
      🔴 {t('results.highEffort')}
    </span>
  );
}
