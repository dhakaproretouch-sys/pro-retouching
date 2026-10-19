import React from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

interface ListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  disabled?: boolean;
  /** Optional suggestion dropdown (e.g. known bullet texts). */
  suggestions?: string[];
}

/** Add/remove editor for plain string lists (bullets, features, …). */
export const ListEditor: React.FC<ListEditorProps> = ({
  label,
  items,
  onChange,
  placeholder = 'Type and press Add',
  addLabel = 'Add',
  disabled = false,
  suggestions = [],
}) => {
  const [draft, setDraft] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const add = (value?: string) => {
    const next = (value ?? draft).trim();
    if (!next) return;
    if (items.includes(next)) {
      setDraft('');
      return;
    }
    onChange([...items, next]);
    setDraft('');
    setShowSuggestions(false);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.trim() && !items.includes(s) && s.toLowerCase().includes(draft.toLowerCase())
  );

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        {label}
      </label>

      {items.length > 0 && (
        <ul className="space-y-1.5 mb-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-1.5 py-1.5"
            >
              <span className="flex-1 text-sm text-slate-700 break-words min-w-0">{item}</span>
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={disabled || index === 0}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={disabled || index === items.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={disabled}
                  className="p-1 rounded text-slate-400 hover:text-red-500 disabled:opacity-30"
                  aria-label={`Remove ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="relative flex gap-2">
        <input
          type="text"
          value={draft}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => {
            setDraft(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
        />
        <button
          type="button"
          onClick={() => add()}
          disabled={disabled || !draft.trim()}
          className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-600 border border-slate-200 transition-colors disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          {addLabel}
        </button>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 top-full mt-1 left-0 right-11 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 6).map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => add(suggestion)}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListEditor;
