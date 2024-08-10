/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Button = ({ children, className, onClick, disabled }) => {
  return (
    <button
      className={`px-4 py- bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
