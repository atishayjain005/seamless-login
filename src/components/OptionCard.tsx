import { Check } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

interface OptionCardProps {
  icon: ReactNode;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ icon, label, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        "relative flex h-[76px] w-full cursor-pointer items-center gap-3 rounded-xl border px-6 text-left shadow-card",
        "transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.99]",
        selected ? "border-brand bg-brand-tint" : "border-line bg-white",
      )}
    >
      <span className={clsx("flex", selected ? "text-brand" : "text-navy-muted")}>
        {icon}
      </span>
      <span
        className={clsx(
          "flex-1 text-base font-medium",
          selected ? "text-brand" : "text-navy",
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          "flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] transition",
          selected ? "border-brand bg-brand" : "border-line-strong",
        )}
      >
        {selected && (
          <span className="flex text-white animate-pop-in">
            <Check size={14} strokeWidth={3} />
          </span>
        )}
      </span>
    </button>
  );
}
