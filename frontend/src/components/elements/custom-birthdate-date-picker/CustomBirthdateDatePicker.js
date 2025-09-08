import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomBirthdateDatePicker.css';

const CustomBirthdateDatePicker = ({ selected, onChange, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(() => (selected instanceof Date ? selected : new Date()));
  const { t } = useTranslation();

  const months = [
    t("p_january"), t("p_february"), t("p_march"), t("p_april"), t("p_may"), t("p_june"),
    t("p_july"), t("p_august"), t("p_september"), t("p_october"), t("p_november"), t("p_december")
  ];

  const weekdayMap = {
    'Monday': t("p_monday"),
    'Tuesday': t("p_tuesday"),
    'Wednesday': t("p_wednesday"),
    'Thursday': t("p_thursday"),
    'Friday': t("p_friday"),
    'Saturday': t("p_saturday"),
    'Sunday': t("p_sunday")
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const monthsOptions = months.map((m, idx) => ({ value: idx, label: m }));

  useEffect(() => {
    if (selected instanceof Date) {
      if (!displayDate || selected.getTime() !== displayDate.getTime()) {
        setDisplayDate(selected);
      }
    }
  }, [selected, displayDate]);

  const handleYearChange = (year) => {
    const newDate = new Date(displayDate);
    newDate.setFullYear(year);
    const normalized = normalizeDate(newDate);
    onChange(normalized);
    setDisplayDate(normalized);
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(monthIndex);
    const normalized = normalizeDate(newDate);
    onChange(normalized);
    setDisplayDate(normalized);
  };

  const handleDayClick = (date) => {
  // Створюємо нову дату на основі displayDate (яка містить правильний місяць та рік)
  // але встановлюємо день з обраної дати
  const newDate = new Date(displayDate);
  newDate.setDate(date.getDate());
  newDate.setHours(0, 0, 0, 0);

  // Перевіряємо, чи обрана дата не молодша за 16 років
  const today = new Date();
  const minBirthDate = new Date();
  minBirthDate.setFullYear(today.getFullYear() - 16);
  minBirthDate.setHours(0, 0, 0, 0);
  
  let finalDate = new Date(newDate);
  finalDate.setHours(0, 0, 0, 0);

  // Якщо обрана дата молодша за 16 років, встановлюємо мінімальну допустиму дату
  if (finalDate > minBirthDate) {
    finalDate = new Date(minBirthDate);
  }

  onChange(finalDate);
  setDisplayDate(finalDate);
  setIsOpen(false);
};

  const handleNavigation = (navigationFunc, direction) => {
    setDisplayDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));

      // Забороняємо майбутнє (більше поточного року або поточного місяця в цьому році)
      const now = new Date();
      if (
        newDate.getFullYear() > now.getFullYear() ||
        (newDate.getFullYear() === now.getFullYear() && newDate.getMonth() > now.getMonth())
      ) {
        return prev; // не змінюємо, залишаємо як було
      }

      navigationFunc();
      return newDate;
    });
  };


  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const formatWeekDay = (weekdayName) => {
    return weekdayMap[weekdayName] || weekdayName;
  };

  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '';
  };

  // ---------------- Custom Select ----------------
  const InlineSelect = ({ value, options, onChange, className = '' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const onDocClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const current = options.find(o => o.value === value);

    return (
      <div ref={ref} className={`select-wrapper inline-select ${className}`}>
        <button
          type="button"
          className="select-trigger"
          onClick={() => setOpen(v => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span>{current?.label ?? '—'}</span>
          <span className="chevron">▾</span>
        </button>

        {open && (
          <ul className="select-b-date-option" role="listbox" tabIndex={-1}>
            {options.map(o => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                className={`option ${o.value === value ? 'is-selected' : ''}`}
                onClick={() => { onChange(o.value); setOpen(false); }}
              >
                {o.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  // ------------------------------------------------

  // Альтернативний CustomInput з форматом "04 ● 12 ● 1990"
  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div 
      ref={ref}
      onClick={onClick}
      className={`custom-datepicker-display ${hasValue(selected) ? 'has-value' : ''} ${className}`}
    >
      {selected ? (
        <div className="date-with-dots">
          <span className="date-part">{selected.getDate().toString().padStart(2, '0')}</span>
          <span className="dot-separator"> ● </span>
          <span className="date-part">{(selected.getMonth() + 1).toString().padStart(2, '0')}</span>
          <span className="dot-separator"> ● </span>
          <span className="date-part">{selected.getFullYear()}</span>
        </div>
      ) : (
        <span className="data-picker-placeholder">{placeholder}</span>
      )}
    </div>
  ));

  return (
    <div className={`custom-datepicker-container ${hasValue(selected) ? 'has-value' : ''} ${className}`}>
      <DatePicker
        selected={selected}
        onChange={handleDayClick}
        customInput={<CustomInput />}
        onInputClick={() => setIsOpen(true)}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        dateFormat="dd MM yyyy"
        placeholderText={placeholder}
        renderCustomHeader={({
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="custom-header">
            <div className="year-month-selectors">
              <InlineSelect
                value={displayDate.getFullYear()}
                options={years.map(y => ({ value: y, label: y }))}
                onChange={(val) => handleYearChange(val)}
              />
              <InlineSelect
                value={displayDate.getMonth()}
                options={monthsOptions}
                onChange={(val) => handleMonthChange(val)}
              />
            </div>

            <div className="month-navigation">
              <button
                onClick={() => handleNavigation(decreaseMonth, 'prev')}
                disabled={prevMonthButtonDisabled}
                className="nav-button"
              >‹</button>
              <button
                onClick={() => handleNavigation(increaseMonth, 'next')}
                disabled={nextMonthButtonDisabled}
                className="nav-button"
              >›</button>
            </div>
          </div>
        )}
        formatWeekDay={formatWeekDay}
        dayClassName={(date) =>
          selected &&
          date.getDate() === selected.getDate() &&
          date.getMonth() === selected.getMonth() &&
          date.getFullYear() === selected.getFullYear()
            ? 'selected-day'
            : 'normal-day'
        }
      />
    </div>
  );
};

export default CustomBirthdateDatePicker;
