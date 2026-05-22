import { useRef } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import clsx from "clsx";

interface OtpInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  length?: number;
}

export function OtpInput({ value, onChange, length = 4 }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const focusAt = (index: number) => {
    refs.current[Math.min(Math.max(index, 0), length - 1)]?.focus();
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      focusAt(index - 1);
    }
    if (event.key === "ArrowLeft") focusAt(index - 1);
    if (event.key === "ArrowRight") focusAt(index + 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!digits) return;
    onChange(Array.from({ length }, (_, i) => digits[i] ?? ""));
    focusAt(Math.min(digits.length, length - 1));
  };

  return (
    <div className="flex gap-2.5 sm:gap-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={`otp-${index}`}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus={index === 0}
          maxLength={1}
          value={value[index] ?? ""}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={clsx(
            "aspect-square w-full max-w-[72px] min-w-0 flex-1 rounded-xl border bg-white text-center text-2xl font-medium text-navy shadow-card outline-none transition sm:text-[26px]",
            "focus:border-brand focus:shadow-focus",
            value[index] ? "border-brand" : "border-line",
          )}
        />
      ))}
    </div>
  );
}
