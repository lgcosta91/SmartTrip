import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-semibold rounded-full tracking-wide uppercase';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
  };

  const variantStyles = {
    primary: 'bg-[#0b3c5d]/10 text-[#0b3c5d] border border-[#0b3c5d]/20',
    success: 'bg-[#10b981]/15 text-[#047857] border border-[#10b981]/25',
    warning: 'bg-[#f59e0b]/15 text-[#b45309] border border-[#f59e0b]/25',
    danger: 'bg-[#ef4444]/15 text-[#b91c1c] border border-[#ef4444]/25',
    neutral: 'bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]',
    ai: 'bg-gradient-to-r from-[#0b3c5d]/10 to-[#ae3115]/15 text-[#ae3115] border border-[#ae3115]/30',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
