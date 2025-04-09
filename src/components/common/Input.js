import React from 'react';

function Input({ icon, value, onChange, placeholder, type = "text", required = false, className }) {
  return (
    <div className="input-group">
      {icon && <i className={icon}></i>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    </div>
  );
}

export default Input;