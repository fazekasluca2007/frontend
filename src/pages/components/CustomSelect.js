import React, { useState } from 'react';

const CustomSelect = ({ options, value, onChange, placeholder, type }) => {
    const [open, setOpen] = useState(false);
  
    const getPlaceholderIcon = () => {
      if (type === "country") return <i className="bi bi-globe-americas text-dark me-2"></i>;
      if (type === "city") return <i className="bi bi-buildings text-dark me-2"></i>;
      return null;
    };
  
    return (
      <div className="custom-select-wrapper">
        <div
          className="custom-select-display"
          onClick={() => setOpen((prev) => !prev)}
        >
          {!value && getPlaceholderIcon()} 
          {value || placeholder}
          <span className="arrow">
            {open ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
          </span>
        </div>
  
        {open && (
          <ul className="custom-select-options">
            {options.map((opt) => (
              <li
                key={opt}
                className="custom-select-option"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt} 
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

export default CustomSelect;