import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, className = "", onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
