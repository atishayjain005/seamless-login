import type { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";
import { Button } from "./Button";

interface ScreenShellProps {
  // Progress fraction 0..1. Omit to hide the progress bar (step 1).
  progress?: number;
  heading: ReactNode;
  subheading?: ReactNode;
  children: ReactNode;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  onBack: () => void;
  onContinue: () => void;
}

// White form card on the right of every step: optional progress bar,
// heading, form body, and the Back / Continue footer.
export function ScreenShell({
  progress,
  heading,
  subheading,
  children,
  continueLabel = "Continue",
  continueDisabled = false,
  continueLoading = false,
  onBack,
  onContinue,
}: ScreenShellProps) {
  const hasProgress = progress !== undefined;

  return (
    <section className="absolute right-20 top-[84px] h-[856px] w-[672px] overflow-hidden rounded-3xl bg-white shadow-panel animate-screen-in">
      {hasProgress && (
        <div className="absolute inset-x-0 top-0 z-[1]">
          <ProgressBar value={progress} />
        </div>
      )}

      <div className="relative h-full p-14">
        <h2 className="text-2xl font-medium leading-[34px] tracking-[-0.36px] text-navy animate-rise-1">
          {heading}
        </h2>

        {subheading && (
          <p className="mt-3 text-base font-normal text-label animate-rise-2">
            {subheading}
          </p>
        )}

        <div className="mt-10 animate-rise-3">{children}</div>

        <div className="absolute inset-x-14 bottom-14 flex gap-4 animate-rise-4">
          <Button variant="secondary" fullWidth onClick={onBack}>
            Back
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onContinue}
            disabled={continueDisabled}
            loading={continueLoading}
          >
            {continueLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
