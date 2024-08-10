/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

// eslint-disable-next-line no-unused-vars
const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onValueChange,
            setIsOpen,
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, isOpen, className }) => {
  return (
    <div
      className={`border p-2 rounded cursor-pointer ${
        isOpen ? "border-blue-500" : "border-gray-300"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const SelectContent = ({ children, isOpen, onValueChange, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onValueChange: (value) => {
              onValueChange(value);
              setIsOpen(false);
            },
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ children, value, onValueChange }) => {
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onValueChange(value)}
    >
      {children}
    </div>
  );
};

const SelectValue = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
