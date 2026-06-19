import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDate(value));
  const [panelPosition, setPanelPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target) && !panelRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnViewportMove = (event) => {
      if (!panelRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    window.addEventListener('resize', closeOnViewportMove);
    document.addEventListener('scroll', closeOnViewportMove, true);
    return () => {
      document.removeEventListener('pointerdown', close);
      window.removeEventListener('resize', closeOnViewportMove);
      document.removeEventListener('scroll', closeOnViewportMove, true);
    };
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
  const togglePicker = () => {
    setViewDate(parseDate(value));
    if (!open) {
      const rect = rootRef.current.getBoundingClientRect();
      const panelWidth = Math.min(290, window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - panelWidth - 12);
      const roomBelow = window.innerHeight - rect.bottom;
      const top = roomBelow >= 385 ? rect.bottom + 8 : Math.max(12, rect.top - 377);
      setPanelPosition({ left, top, width: panelWidth });
    }
    setOpen((current) => !current);
  };

  const panel = open && (
    <div className="date-picker__panel" ref={panelRef} style={panelPosition}>
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
  );

  return (
    <div className={`date-picker${open ? ' is-open' : ''}`} ref={rootRef}>
      <button type="button" className="date-picker__trigger" onClick={togglePicker}>
        <FiCalendar aria-hidden="true" /><span>{formatValue(value)}</span><i aria-hidden="true" />
      </button>
      {panel && createPortal(panel, document.body)}
    </div>
  );
};

export default CustomDatePicker;
