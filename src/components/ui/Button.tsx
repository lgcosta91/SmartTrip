import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[#0b3c5d] text-white hover:bg-[#00263f] focus-visible:ring-[#0b3c5d] shadow-sm hover:shadow-md',
    secondary:
      'bg-[#e2e8f0] text-[#0f172a] hover:bg-[#cbd5e1] focus-visible:ring-[#64748b]',
    outline:
      'border-2 border-[#cbd5e1] text-[#0f172a] bg-transparent hover:bg-[#f8fafc] hover:border-[#94a3b8] focus-visible:ring-[#0b3c5d]',
    danger:
      'bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:ring-[#ef4444] shadow-xs',
    ghost:
      'text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] focus-visible:ring-[#94a3b8]',
    gradient:
      'bg-gradient-to-r from-[#0b3c5d] to-[#ae3115] text-white hover:opacity-95 shadow-[0_4px_14px_rgba(174,49,21,0.25)] focus-visible:ring-[#ae3115]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
