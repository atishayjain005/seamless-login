import { memo } from "react";
import illustration from "../assets/illustration-account.svg";

interface BrandPanelProps {
  // Desktop renders the absolutely-positioned heading + illustration inside
  // the fixed frame; mobile renders just a centred heading above the card.
  desktop?: boolean;
}

export const BrandPanel = memo(function BrandPanel({
  desktop = false,
}: BrandPanelProps) {
  if (desktop) {
    return (
      <div className="absolute left-[80px] top-0 h-full w-[600px]">
        <div className="absolute left-0 top-[96px] w-[540px]">
          <p className="text-2xl font-light leading-8 text-navy animate-rise-1">
            Let&apos;s get started
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-[54px] text-navy animate-rise-2">
            Create your account
          </h1>
          <p className="mt-5 text-base font-normal text-navy-muted animate-rise-3">
            Follow the steps to create your account
          </p>
        </div>
        <img
          src={illustration}
          alt=""
          width={600}
          height={384}
          className="absolute bottom-[70px] left-0 w-[600px] animate-rise-4"
        />
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-lg font-light leading-tight text-navy animate-rise-1">
        Let&apos;s get started
      </p>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-navy sm:text-4xl animate-rise-2">
        Create your account
      </h1>
      <p className="mt-3 text-sm font-normal text-navy-muted sm:text-base animate-rise-3">
        Follow the steps to create your account
      </p>
    </div>
  );
});
