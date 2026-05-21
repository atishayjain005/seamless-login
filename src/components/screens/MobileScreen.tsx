import { useId, useState } from "react";
import { ScreenShell } from "../ScreenShell";
import { CountrySelect } from "../CountrySelect";
import { sendOtp } from "../../lib/otpService";
import type { Country } from "../../hooks/useCountries";
import type { ScreenProps } from "../../types";

const PHONE_LENGTH = 10;

export function MobileScreen({
  form,
  update,
  onNext,
  onBack,
  showToast,
}: ScreenProps) {
  const inputId = useId();
  const [sending, setSending] = useState(false);
  const isValid = form.mobile.length === PHONE_LENGTH;

  const handleContinue = async () => {
    if (!isValid) return;
    setSending(true);
    const result = await sendOtp(`${form.countryCode} ${form.mobile}`);
    setSending(false);

    if (result.ok) {
      showToast({
        kind: "info",
        text: `Mock OTP service — your verification code is ${result.code}`,
      });
      onNext();
    } else {
      showToast({ kind: "error", text: result.message });
    }
  };

  const handleCountry = (country: Country) => {
    update({ countryCode: country.dialCode, countryFlag: country.flag });
  };

  return (
    <ScreenShell
      progress={0.25}
      heading="OTP Verification"
      continueDisabled={!isValid}
      continueLoading={sending}
      continueLabel={sending ? "Sending OTP" : "Continue"}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className="flex flex-col">
        <label htmlFor={inputId} className="mb-2 text-sm font-normal text-label">
          Mobile Number<span className="ml-0.5 text-danger">*</span>
        </label>

        <div className="flex gap-3">
          <div className="shrink-0">
            <CountrySelect
              dialCode={form.countryCode}
              flag={form.countryFlag}
              onSelect={handleCountry}
            />
          </div>

          <div className="relative flex h-[60px] flex-1 items-center rounded-xl border border-line bg-white shadow-card transition focus-within:border-brand focus-within:shadow-focus">
            <input
              id={inputId}
              type="tel"
              inputMode="numeric"
              placeholder="8343989239"
              value={form.mobile}
              onChange={(event) =>
                update({
                  mobile: event.target.value
                    .replace(/\D/g, "")
                    .slice(0, PHONE_LENGTH),
                })
              }
              className="h-full min-w-0 flex-1 bg-transparent px-5 text-base text-navy outline-none placeholder:text-placeholder"
            />
          </div>
        </div>

        <p className="mt-2 text-[13px] text-label">
          {form.mobile.length}/{PHONE_LENGTH} digits
        </p>
      </div>
    </ScreenShell>
  );
}
