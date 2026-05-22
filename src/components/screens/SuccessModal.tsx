import { Check, ShieldCheck } from "lucide-react";
import { Button } from "../Button";
import type { FormState } from "../../types";

interface SuccessModalProps {
  form: FormState;
  onDashboard: () => void;
}

function maskEmail(firstName: string): string {
  const base = (firstName.trim().toLowerCase() || "john").slice(0, 2);
  return `${base}••••@example.com`;
}

export function SuccessModal({ form, onDashboard }: SuccessModalProps) {
  const fullName =
    [form.firstName, form.lastName].filter(Boolean).join(" ").trim() ||
    "John Doe";
  const accountType =
    form.accountType === "business" ? "Business" : "Personal";
  const mobile = `${form.countryCode} ${form.mobile || "9711577290"}`;

  const rows = [
    { label: "Account Type", value: accountType },
    { label: "Email", value: maskEmail(form.firstName) },
    { label: "Name", value: fullName },
    { label: "Mobile Number", value: mobile },
  ];

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[rgba(19,44,74,0.45)] p-4 backdrop-blur-[1.5px] animate-overlay-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account created"
        className="flex w-full max-w-[460px] flex-col items-center rounded-[20px] bg-white p-6 shadow-modal sm:p-10 animate-modal-pop"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full border-[1.5px] border-brand bg-brand-soft text-brand">
          <Check size={28} strokeWidth={2.6} />
        </div>

        <h2 className="mt-5 text-2xl font-medium text-navy">
          You&apos;re all set!
        </h2>
        <p className="mt-2 text-center text-sm text-label">
          Here&apos;s a quick summary of your account details
        </p>

        <dl className="mt-6 w-full rounded-xl bg-[#f5f6f9] px-4 sm:px-5">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-4 py-3.5 sm:py-4 ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <dt className="text-sm text-label">{row.label}</dt>
              <dd className="truncate text-sm font-medium text-navy">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="my-6 flex items-center gap-2 text-center text-[13px] text-label">
          <ShieldCheck
            size={16}
            strokeWidth={2}
            className="shrink-0 text-success"
          />
          Your account is secured with bank-grade security
        </p>

        <Button fullWidth onClick={onDashboard}>
          Go To Dashboard
        </Button>
      </div>
    </div>
  );
}
