import React from 'react';

function Select({ icon, value, onChange, options, required = false }) {
  return (
    <div className="input-group">
      {icon && <i className={icon}></i>}
      <select value={value} onChange={onChange} required={required}>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default Select;