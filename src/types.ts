export type AccountType = "personal" | "business";

export interface FormState {
  accountType: AccountType;
  countryCode: string;
  countryFlag: string;
  mobile: string;
  otp: string[];
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export type ToastKind = "info" | "success" | "error";

export interface ToastMessage {
  kind: ToastKind;
  text: string;
}

/** Props shared by every step component in the flow. */
export interface ScreenProps {
  form: FormState;
  update: (patch: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
  showToast: (toast: ToastMessage) => void;
}
