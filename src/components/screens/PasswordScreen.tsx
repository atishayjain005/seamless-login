import { ScreenShell } from "../ScreenShell";
import { TextField } from "../TextField";
import type { ScreenProps } from "../../types";

export function PasswordScreen({ form, update, onNext, onBack }: ScreenProps) {
  return (
    <ScreenShell
      progress={1}
      heading="Create Password for your account"
      continueDisabled={
        form.password.length < 6 || form.password !== form.confirmPassword
      }
      onBack={onBack}
      onContinue={onNext}
    >
      <div className="flex flex-col gap-6">
        <TextField
          label="Enter new password"
          type="password"
          placeholder="Enter new password"
          hint="Must be atleast 6 characters"
          value={form.password}
          onChange={(value) => update({ password: value })}
        />
        <TextField
          label="Confirm password"
          type="password"
          placeholder="Confirm password"
          hint="Both passwords must match"
          value={form.confirmPassword}
          onChange={(value) => update({ confirmPassword: value })}
        />
      </div>
    </ScreenShell>
  );
}
