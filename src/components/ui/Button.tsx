import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-250 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25 active:bg-primary-dark focus:ring-primary/30',
      secondary: 'bg-secondary text-white hover:bg-secondary-light hover:shadow-md active:bg-secondary-dark focus:ring-secondary/30',
      accent: 'bg-white/40 backdrop-blur-sm text-primary border border-white/30 hover:bg-white/60 hover:border-primary/30 hover:shadow-md focus:ring-primary/20',
      ghost: 'bg-transparent text-primary hover:bg-primary-soft focus:ring-primary/20',
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary-soft active:bg-primary active:text-white focus:ring-primary/30',
      danger: 'bg-danger text-white hover:bg-red-500 hover:shadow-lg hover:shadow-danger/25 active:bg-red-800 focus:ring-danger/30',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
