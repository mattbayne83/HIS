import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'glass-light' | 'glass-medium' | 'glass-heavy';
  interactive?: boolean;
  shimmer?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'glass-medium',
  interactive = false,
  shimmer = false,
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    solid: 'bg-card border border-neutral-200 shadow-lg',
    'glass-light': 'glass-light',
    'glass-medium': 'glass-medium',
    'glass-heavy': 'glass-heavy',
  };

  const interactiveClasses = interactive
    ? 'hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300'
    : 'transition-shadow duration-250';

  const shimmerClass = shimmer ? 'relative overflow-hidden shimmer-effect' : '';

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${shimmerClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
