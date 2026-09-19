import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-5 transition-all duration-200';

  const variantStyles = {
    default: 'bg-white border border-[#e2e8f0] shadow-xs',
    elevated: 'bg-white border border-[#e2e8f0] shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
    bordered: 'bg-[#f8fafc] border-2 border-[#e2e8f0]',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-xs',
  };

  const interactiveStyles = interactive
    ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-[#cbd5e1]'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
