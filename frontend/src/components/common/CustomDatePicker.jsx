import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../../styles/components/custom-date-picker.css';

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const dayNames = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
const parseDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const toValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const formatValue = (value) => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parseDate(value));

const CustomDatePicker = ({ value, onChange, min }) => {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDate(value));

  useEffect(() => {
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [viewDate]);

  const moveMonth = (amount) => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  return (
    <div className={`date-picker${open ? ' is-open' : ''}`} ref={rootRef}>
      <button type="button" className="date-picker__trigger" onClick={() => { setViewDate(parseDate(value)); setOpen((current) => !current); }}>
        <FiCalendar aria-hidden="true" /><span>{formatValue(value)}</span><i aria-hidden="true" />
      </button>
      {open && (
        <div className="date-picker__panel">
          <header>
            <button type="button" onClick={() => moveMonth(-1)} aria-label="Bulan sebelumnya"><FiChevronLeft /></button>
            <strong>{monthNames[viewDate.getMonth()]} <span>{viewDate.getFullYear()}</span></strong>
            <button type="button" onClick={() => moveMonth(1)} aria-label="Bulan berikutnya"><FiChevronRight /></button>
          </header>
          <div className="date-picker__weekdays">{dayNames.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="date-picker__days">
            {days.map((date) => {
              const dateValue = toValue(date);
              const outside = date.getMonth() !== viewDate.getMonth();
              const disabled = min && dateValue < min;
              return (
                <button
                  type="button"
                  key={dateValue}
                  disabled={disabled}
                  className={`${outside ? 'is-outside' : ''}${dateValue === value ? ' is-selected' : ''}`}
                  onClick={() => { onChange(dateValue); setOpen(false); }}
                >{date.getDate()}</button>
              );
            })}
          </div>
          <footer><span>Pilih tanggal</span><button type="button" onClick={() => { const next = min && toValue(new Date()) < min ? min : toValue(new Date()); onChange(next); setOpen(false); }}>Hari ini</button></footer>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
