import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}

/** iOS-style switch used in table rows and forms. */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label || (checked ? 'On — click to turn off' : 'Off — click to turn on')}
    onClick={onChange}
    disabled={disabled}
    className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full disabled:opacity-50"
    title={checked ? 'Active — click to hide' : 'Inactive — click to show'}
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
);

export default Toggle;
