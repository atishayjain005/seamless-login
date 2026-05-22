import { useEffect } from "react";
import { Check, Info, X } from "lucide-react";
import type { ToastKind, ToastMessage } from "../types";

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const ICON = { info: Info, success: Check, error: X } as const;

const ACCENT: Record<ToastKind, string> = {
  info: "bg-brand text-white",
  success: "bg-success text-white",
  error: "bg-danger text-white",
};

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onClose, 6000);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;
  const Icon = ICON[toast.kind];

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100vw-2rem)] max-w-[440px] -translate-x-1/2 sm:top-6 animate-toast-in">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white py-3 pl-3 pr-4 shadow-card">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ACCENT[toast.kind]}`}
        >
          <Icon size={16} strokeWidth={2.6} />
        </span>
        <p className="flex-1 text-sm font-medium text-navy">{toast.text}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-1 shrink-0 cursor-pointer text-label transition-colors hover:text-navy"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
