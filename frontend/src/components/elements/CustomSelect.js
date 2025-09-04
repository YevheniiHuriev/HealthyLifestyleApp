import React, { useState, useRef, useEffect } from 'react';
import '../styles/CustomSelect.css';
import SelectArrov from "../icons/SelectArrow.svg"

const CustomSelect = ({ id, placeholder, options, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`custom-select ${className} ${isOpen ? 'expanded' : ''}`} ref={selectRef} id={id}>
      <div className="select-header" onClick={toggleDropdown}>
        <input
          type="text"
          className="select-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpen) setIsOpen(true);
          }}
          readOnly={!isOpen}
        />
        <span className={`select-arrow ${isOpen ? 'open' : ''}`}>
          ⮟
        </span>
      </div>
      
      {isOpen && (
        <div className="select-options-container">
          <div className="select-options">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="select-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;