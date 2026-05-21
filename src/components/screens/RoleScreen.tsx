import { Briefcase, User } from "lucide-react";
import { ScreenShell } from "../ScreenShell";
import { OptionCard } from "../OptionCard";
import type { ScreenProps } from "../../types";

export function RoleScreen({ form, update, onNext, onBack }: ScreenProps) {
  return (
    <ScreenShell
      heading={
        <span className="font-normal">
          To join us tell us{" "}
          <strong className="font-bold">what type of account</strong> you are
          opening
        </span>
      }
      onBack={onBack}
      onContinue={onNext}
    >
      <div className="flex flex-col gap-3">
        <OptionCard
          icon={<User size={22} strokeWidth={1.7} />}
          label="Personal"
          selected={form.accountType === "personal"}
          onSelect={() => update({ accountType: "personal" })}
        />
        <OptionCard
          icon={<Briefcase size={22} strokeWidth={1.7} />}
          label="Business"
          selected={form.accountType === "business"}
          onSelect={() => update({ accountType: "business" })}
        />
      </div>
    </ScreenShell>
  );
}
