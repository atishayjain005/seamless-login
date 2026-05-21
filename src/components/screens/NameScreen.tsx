import { ScreenShell } from "../ScreenShell";
import { TextField } from "../TextField";
import type { ScreenProps } from "../../types";

export function NameScreen({ form, update, onNext, onBack }: ScreenProps) {
  return (
    <ScreenShell
      progress={0.75}
      heading="What is your name?"
      continueDisabled={
        form.firstName.trim() === "" || form.lastName.trim() === ""
      }
      onBack={onBack}
      onContinue={onNext}
    >
      <div className="flex flex-col gap-5">
        <TextField
          label="First Name"
          placeholder="Oliver"
          value={form.firstName}
          onChange={(value) => update({ firstName: value })}
        />
        <TextField
          label="Last Name"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(value) => update({ lastName: value })}
        />
      </div>
    </ScreenShell>
  );
}
