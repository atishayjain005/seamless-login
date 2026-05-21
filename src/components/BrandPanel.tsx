import illustration from "../assets/illustration-account.svg";

/**
 * Left column shared across every step: the "Create your account" heading
 * block and the account illustration.
 */
export function BrandPanel() {
  return (
    <div className="absolute left-20 top-0 h-full w-[600px]">
      <div className="absolute left-0 top-24 w-[540px]">
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
