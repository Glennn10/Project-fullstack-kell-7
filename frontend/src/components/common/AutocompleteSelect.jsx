import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiSearch, FiX } from 'react-icons/fi';
import '../../styles/components/autocomplete-select.css';

const AutocompleteSelect = ({ value, onChange, options, placeholder = 'Cari...' }) => {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = options.find((option) => String(option.value) === String(value));

  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter((option) => `${option.label} ${option.meta || ''} ${option.searchText || ''}`.toLowerCase().includes(keyword));
  }, [options, query]);

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const choose = (option) => {
    onChange(option.value);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!open && ['ArrowDown', 'ArrowUp'].includes(event.key)) setOpen(true);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }
    if (event.key === 'Enter' && open && filteredOptions[activeIndex]) {
      event.preventDefault();
      choose(filteredOptions[activeIndex]);
    }
    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <div className={`autocomplete-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <div className="autocomplete-select__field">
        <FiSearch aria-hidden="true" />
        <input
          ref={inputRef}
          value={open ? query : selected?.label || ''}
          placeholder={placeholder}
          onFocus={() => { setOpen(true); setQuery(''); setActiveIndex(0); }}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); if (value) onChange(''); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
        />
        {(selected || query) && <button type="button" aria-label="Kosongkan pilihan" onClick={() => { onChange(''); setQuery(''); setOpen(true); inputRef.current?.focus(); }}><FiX /></button>}
      </div>
      {open && (
        <div className="autocomplete-select__menu" role="listbox">
          {filteredOptions.map((option, index) => {
            const isSelected = String(option.value) === String(value);
            return (
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${isSelected ? 'is-selected' : ''}${index === activeIndex ? ' is-active' : ''}`}
                key={String(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                <span><strong>{option.label}</strong>{option.meta && <small>{option.meta}</small>}</span>
                {isSelected && <FiCheck aria-hidden="true" />}
              </button>
            );
          })}
          {!filteredOptions.length && <div className="autocomplete-select__empty"><FiSearch /><span>Tidak ada yang cocok.</span><small>Coba judul atau nama lain.</small></div>}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSelect;
