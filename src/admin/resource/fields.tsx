import React from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all disabled:opacity-50';

interface FieldShellProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export const FieldShell: React.FC<FieldShellProps> = ({
  label,
  required,
  error,
  hint,
  children,
  htmlFor,
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    {error && (
      <p className="mt-1.5 text-xs text-red-500 font-medium" role="alert">
        {error}
      </p>
    )}
  </div>
);

type TextFieldProps = {
  label: string;
  error?: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({ label, error, hint, required, ...rest }) => (
  <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={rest.name}>
    <input
      className={inputClass}
      aria-invalid={error ? 'true' : 'false'}
      {...rest}
    />
  </FieldShell>
);

type TextAreaFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  rows?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  hint,
  required,
  rows = 4,
  ...rest
}) => (
  <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={rest.name}>
    <textarea
      rows={rows}
      className={`${inputClass} resize-y`}
      aria-invalid={error ? 'true' : 'false'}
      {...rest}
    />
  </FieldShell>
);

type SelectFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  error,
  hint,
  options,
  required,
  ...rest
}) => (
  <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={rest.name}>
    <div className="relative">
      <select className={`${inputClass} appearance-none pr-9`} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </FieldShell>
);

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}

/** Labeled switch for forms (isActive, isPopular, …). */
export const SwitchField: React.FC<SwitchFieldProps> = ({
  label,
  checked,
  onChange,
  hint,
  disabled = false,
}) => (
  <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full disabled:opacity-50"
    >
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-amber-400' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  </div>
);
