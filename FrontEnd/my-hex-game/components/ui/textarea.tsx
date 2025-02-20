import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  disabled?: boolean; // ✅ เพิ่ม disabled เพื่อให้ TypeScript รับรู้
}

export function Textarea({ className = "", disabled, ...props }: TextareaProps) {
  return (
    <textarea
      className={`p-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled} // ✅ ใช้ disabled อย่างถูกต้อง
      {...props} // ✅ รองรับ props อื่น ๆ เช่น value, onChange
    />
  );
}
