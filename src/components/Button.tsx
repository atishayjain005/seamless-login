import type { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "flex h-[49px] cursor-pointer items-center justify-center gap-2 rounded-[38px] px-6",
        "text-[15px] font-medium tracking-[0.1px] transition duration-200 ease-out",
        "disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:active:scale-[0.97]",
        fullWidth ? "w-full" : "w-[250px]",
        variant === "primary"
          ? "bg-brand text-white shadow-button enabled:hover:bg-brand-hover disabled:bg-brand-disabled disabled:shadow-none"
          : "border border-line-strong bg-white text-navy enabled:hover:border-navy-muted",
      )}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
