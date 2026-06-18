import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import '../../styles/components/custom-select.css';

const CustomSelect = ({ value, onChange, options, placeholder = 'Pilih opsi' }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedOption = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`custom-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <button type="button" className="custom-select__trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span>{selectedOption?.label || placeholder}</span><FiChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="custom-select__menu" role="listbox">
          {options.map((option) => {
            const selected = String(option.value) === String(value);
            return (
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={selected ? 'is-selected' : ''}
                key={String(option.value)}
                onClick={() => { onChange(option.value); setOpen(false); }}
              >
                <span>{option.label}</span>{selected && <FiCheck aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
