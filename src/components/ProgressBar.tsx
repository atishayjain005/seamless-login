interface ProgressBarProps {
  // Fraction filled, 0..1.
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 1);

  return (
    <div
      className="h-1.5 w-full overflow-hidden bg-track"
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full w-full origin-left bg-brand transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${clamped})` }}
      />
    </div>
  );
}
