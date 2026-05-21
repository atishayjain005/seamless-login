import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "tel" | "password";
  placeholder?: string;
  required?: boolean;
  hint?: string;
  autoFocus?: boolean;
  inputMode?: "text" | "numeric" | "tel";
  maxLength?: number;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  hint,
  autoFocus = false,
  inputMode,
  maxLength,
}: TextFieldProps) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (revealed ? "text" : "password") : type;

  return (
    <div className="flex w-full flex-col">
      <label htmlFor={id} className="mb-2 text-sm font-normal text-label">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>

      <div className="relative flex h-[60px] items-center rounded-xl border border-line bg-white shadow-card transition focus-within:border-brand focus-within:shadow-focus">
        <input
          id={id}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-5 text-base text-navy outline-none placeholder:text-placeholder"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="flex h-full w-[52px] cursor-pointer items-center justify-center text-label transition-colors hover:text-navy"
          >
            {revealed ? (
              <EyeOff size={20} strokeWidth={1.7} />
            ) : (
              <Eye size={20} strokeWidth={1.7} />
            )}
          </button>
        )}
      </div>

      {hint && <p className="mt-2 text-[13px] text-label">{hint}</p>}
    </div>
  );
}
