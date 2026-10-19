import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-[#0F2A55] font-bold shadow-sm',
  secondary:
    'bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 font-semibold border border-slate-200',
  danger:
    'bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold shadow-sm',
  ghost:
    'bg-transparent hover:bg-slate-100 disabled:bg-transparent text-slate-600 font-semibold',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
};

/** Consistent admin button with loading spinner + optional leading icon. */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...rest
}) => (
  <button
    className={`inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <Loader2 className={size === 'sm' ? 'w-3.5 h-3.5 animate-spin' : 'w-4 h-4 animate-spin'} />
    ) : (
      icon
    )}
    {children}
  </button>
);

export default Button;
