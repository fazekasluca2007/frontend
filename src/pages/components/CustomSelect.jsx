import React, { useState, useEffect, useRef } from 'react';

{/* Ikonok a típusok szerint */ }
const ICON_MAP = {
  country: <i className="bi bi-globe-americas text-dark me-2"></i>,
  city: <i className="bi bi-buildings text-dark me-2"></i>,
};

{/* Egyedi select komponens lenyíló listával */ }
const CustomSelect = ({ options, value, onChange, placeholder, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  {/* Kívülre kattintáskor becsukja a lenyíló listát */ }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    {/* Kívülre kattintás figyelése */ }
    document.addEventListener('mousedown', handleClickOutside);

    {/* Eseményfigyelő eltávolítása */ }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  {/* Segédfüggvények */ }
  const getIcon = () => ICON_MAP[type] || null;
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={containerRef}>
      {/* Megjelenítendő mező */}
      <div className="custom-select-display" onClick={toggleDropdown}>
        {!value && getIcon()}
        {value || placeholder}
        <span className="arrow">
          {isOpen ? (
            <i className="bi bi-chevron-up"></i>
          ) : (
            <i className="bi bi-chevron-down"></i>
          )}
        </span>
      </div>

      {/* Lenyíló lista */}
      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li
              key={option}
              className="custom-select-option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;