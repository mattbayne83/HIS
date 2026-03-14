import React from 'react';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'accent';
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', label }) => {
  const variantClasses = {
    success: 'bg-success/15 backdrop-blur-sm text-success border-success/25',
    warning: 'bg-warning/15 backdrop-blur-sm text-[#D97706] border-warning/25',
    danger: 'bg-danger/15 backdrop-blur-sm text-danger border-danger/25',
    neutral: 'bg-neutral-200/60 backdrop-blur-sm text-neutral-600 border-neutral-300/40',
    info: 'bg-secondary/15 backdrop-blur-sm text-secondary border-secondary/25',
    accent: 'bg-primary/15 backdrop-blur-sm text-primary border-primary/25',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
};

export default Badge;
