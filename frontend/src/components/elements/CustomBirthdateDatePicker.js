import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/CustomBirthdateDatePicker.css';

const months = [
  "СІЧЕНЬ", "ЛЮТИЙ", "БЕРЕЗЕНЬ", "КВІТЕНЬ", "ТРАВЕНЬ", "ЧЕРВЕНЬ",
  "ЛИПЕНЬ", "СЕРПЕНЬ", "ВЕРЕСЕНЬ", "ЖОВТЕНЬ", "ЛИСТОПАД", "ГРУДЕНЬ"
];

// Мапинг англійських назв днів тижня на українські скорочення
const weekdayMap = {
  'Monday': 'Пн',
  'Tuesday': 'Вт',
  'Wednesday': 'Ср',
  'Thursday': 'Чт',
  'Friday': 'Пт',
  'Saturday': 'Сб',
  'Sunday': 'Нд'
};

const CustomBirthdateDatePicker = ({ selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(() => (selected instanceof Date ? selected : new Date()));
  const yearSelectRef = useRef(null);

  // роки
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const monthsOptions = months.map((m, idx) => ({ value: idx, label: m }));

  // Синхронізуємо displayDate тільки коли зовнішній selected реальна дата
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

  // Функція для форматування дня тижня
  const formatWeekDay = (weekdayName) => {
    return weekdayMap[weekdayName] || weekdayName;
  };

  // обмеження висоти селекта років
  useEffect(() => {
    if (yearSelectRef.current) {
      yearSelectRef.current.classList.add('year-select-limited');
    }
  }, []);

const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <input
    ref={ref}
    value={value}
    onClick={onClick}
    readOnly
    placeholder={placeholder}   // 🔹 додали
    className="custom-datepicker-input"
  />
));

  return (
    <div className="custom-datepicker-container">
      <DatePicker
        selected={selected}
        onChange={handleDayClick}
        customInput={<CustomInput />}
        onInputClick={() => setIsOpen(true)}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        dateFormat="dd MM yyyy"
        placeholderText={placeholder}
        className="custom-datepicker-input"
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
        formatWeekDay={formatWeekDay} // Використовуємо функцію форматування
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