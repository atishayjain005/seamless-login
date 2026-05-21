import { useState } from "react";
import { ScreenShell } from "../ScreenShell";
import { OtpInput } from "../OtpInput";
import { sendOtp, verifyOtp } from "../../lib/otpService";
import type { ScreenProps } from "../../types";

export function OtpScreen({
  form,
  update,
  onNext,
  onBack,
  showToast,
}: ScreenProps) {
  const [verifying, setVerifying] = useState(false);
  const code = form.otp.join("");
  const isComplete = code.length === 4;

  const handleContinue = async () => {
    if (!isComplete) return;
    setVerifying(true);
    const result = await verifyOtp(code);
    setVerifying(false);

    if (result.ok) {
      showToast({ kind: "success", text: result.message });
      onNext();
    } else {
      showToast({ kind: "error", text: result.message });
      update({ otp: ["", "", "", ""] });
    }
  };

  const handleResend = async () => {
    const result = await sendOtp(`${form.countryCode} ${form.mobile}`);
    if (result.ok) {
      showToast({
        kind: "info",
        text: `New code sent — your verification code is ${result.code}`,
      });
    } else {
      showToast({ kind: "error", text: result.message });
    }
  };

  return (
    <ScreenShell
      progress={0.5}
      heading="OTP Verification"
      subheading={`An OTP has been sent to ${form.countryCode} ${form.mobile}`}
      continueDisabled={!isComplete}
      continueLoading={verifying}
      continueLabel={verifying ? "Verifying" : "Continue"}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <OtpInput value={form.otp} onChange={(next) => update({ otp: next })} />

      <p className="mt-6 text-sm font-normal text-label">
        Did not receive OTP?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="cursor-pointer text-sm font-medium text-brand hover:underline"
        >
          Resend OTP
        </button>
      </p>
    </ScreenShell>
  );
}
