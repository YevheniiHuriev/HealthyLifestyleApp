import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomBirthdateDatePicker.css';

const months = [
  "СІЧЕНЬ", "ЛЮТИЙ", "БЕРЕЗЕНЬ", "КВІТЕНЬ", "ТРАВЕНЬ", "ЧЕРВЕНЬ",
  "ЛИПЕНЬ", "СЕРПЕНЬ", "ВЕРЕСЕНЬ", "ЖОВТЕНЬ", "ЛИСТОПАД", "ГРУДЕНЬ"
];

const weekdayMap = {
  'Monday': 'Пн',
  'Tuesday': 'Вт',
  'Wednesday': 'Ср',
  'Thursday': 'Чт',
  'Friday': 'Пт',
  'Saturday': 'Сб',
  'Sunday': 'Нд'
};

const CustomBirthdateDatePicker = ({ selected, onChange, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(() => (selected instanceof Date ? selected : new Date()));
  const yearSelectRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const monthsOptions = months.map((m, idx) => ({ value: idx, label: m }));

  useEffect(() => {
    if (selected instanceof Date) {
      if (!displayDate || selected.getTime() !== displayDate.getTime()) {
        setDisplayDate(selected);
      }
    }
  }, [selected]);

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
    const newDate = new Date(displayDate);
    newDate.setDate(date.getDate());
    newDate.setHours(0, 0, 0, 0);

    onChange(newDate);
    setDisplayDate(newDate);
    setIsOpen(false);
  };

  const handleNavigation = (navigationFunc, direction) => {
    navigationFunc();
    const newDate = new Date(displayDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setDisplayDate(newDate);
  };

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const formatWeekDay = (weekdayName) => {
    return weekdayMap[weekdayName] || weekdayName;
  };

  useEffect(() => {
    if (yearSelectRef.current) {
      yearSelectRef.current.classList.add('year-select-limited');
    }
  }, []);

  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '';
  };

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
        <span className="placeholder">{placeholder}</span>
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
              <div className="select-wrapper">
                <select
                  ref={yearSelectRef}
                  value={displayDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                  className="year-select"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={displayDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
                  className="month-select"
                >
                  {monthsOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
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