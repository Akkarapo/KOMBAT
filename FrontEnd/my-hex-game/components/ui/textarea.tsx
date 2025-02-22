import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  disabled?: boolean; 
}

export function Textarea({ className = "", disabled, ...props }: TextareaProps) {
  return (
    <textarea
      className={`p-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled} 
      {...props} // ✅ รองรับ props อื่น ๆ เช่น value, onChange
      style={{
        scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
      }}
    />
  );
}
