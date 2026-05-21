import { useCallback, useState } from "react";
import type { ReactElement } from "react";
import { BrandPanel } from "./components/BrandPanel";
import { Toast } from "./components/Toast";
import { RoleScreen } from "./components/screens/RoleScreen";
import { MobileScreen } from "./components/screens/MobileScreen";
import { OtpScreen } from "./components/screens/OtpScreen";
import { NameScreen } from "./components/screens/NameScreen";
import { PasswordScreen } from "./components/screens/PasswordScreen";
import { SuccessModal } from "./components/screens/SuccessModal";
import { useFrameScale } from "./hooks/useFrameScale";
import type { FormState, ScreenProps, ToastMessage } from "./types";

const INITIAL_FORM: FormState = {
  accountType: "personal",
  countryCode: "+1",
  countryFlag: "🇺🇸",
  mobile: "",
  otp: ["", "", "", ""],
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

function renderScreen(step: number, props: ScreenProps): ReactElement {
  switch (step) {
    case 1:
      return <RoleScreen {...props} />;
    case 2:
      return <MobileScreen {...props} />;
    case 3:
      return <OtpScreen {...props} />;
    case 4:
      return <NameScreen {...props} />;
    default:
      return <PasswordScreen {...props} />;
  }
}

function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const scale = useFrameScale();

  const update = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const goNext = useCallback(
    () => setStep((current) => Math.min(current + 1, 6)),
    [],
  );
  const goBack = useCallback(
    () => setStep((current) => Math.max(current - 1, 1)),
    [],
  );
  const restart = useCallback(() => {
    setForm(INITIAL_FORM);
    setStep(1);
  }, []);

  const showToast = useCallback((message: ToastMessage) => {
    setToast(message);
  }, []);
  const closeToast = useCallback(() => setToast(null), []);

  // Step 6 is the success modal layered over the password screen.
  const screenStep = step >= 6 ? 5 : step;
  const screenProps: ScreenProps = {
    form,
    update,
    onNext: goNext,
    onBack: goBack,
    showToast,
  };

  return (
    <div className="grid h-screen w-full place-items-center overflow-hidden bg-navy">
      <div
        className="relative shrink-0"
        style={{ width: 1440 * scale, height: 1024 * scale }}
      >
        <main
          className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left overflow-hidden rounded-[14px] bg-canvas shadow-[0_50px_110px_rgba(0,0,0,0.4)]"
          style={{ transform: `scale(${scale})` }}
        >
          <BrandPanel />

          <div key={screenStep} className="absolute inset-0">
            {renderScreen(screenStep, screenProps)}
          </div>

          {step === 6 && <SuccessModal form={form} onDashboard={restart} />}
        </main>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

export default App;
