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

// White form card. Fills its wrapper (a fixed 672x856 box on desktop, a fluid
// content-height box on mobile), with the footer pinned to the bottom.
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
    <section className="relative flex h-full min-h-[480px] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-panel animate-screen-in">
      {hasProgress && (
        <div className="absolute inset-x-0 top-0 z-[1]">
          <ProgressBar value={progress} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-14">
        <h2 className="text-xl font-medium leading-snug tracking-[-0.36px] text-navy sm:text-2xl sm:leading-[34px] animate-rise-1">
          {heading}
        </h2>

        {subheading && (
          <p className="mt-2 text-sm font-normal text-label sm:mt-3 sm:text-base animate-rise-2">
            {subheading}
          </p>
        )}

        <div className="mt-7 sm:mt-9 lg:mt-10 animate-rise-3">{children}</div>

        <div className="mt-auto flex gap-3 pt-10 sm:gap-4 animate-rise-4">
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
