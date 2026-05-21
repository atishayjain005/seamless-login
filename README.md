# Seamless Login — Figma Replica

A pixel-faithful **React + TypeScript** implementation of the "Assignment Screens • Login flow"
Figma design — a six-step account-creation flow with a live country-code dropdown and a
working OTP send / verify flow.

[Figma design](https://www.figma.com/design/4pHTqhD8XvvC1ZPsP7i7RT/Assignment-Screens-%E2%80%A2Login-flow---Root?node-id=1-22)

## The flow

| Step | Screen | Contents |
| ---- | ------ | -------- |
| 1 | Account type | Personal / Business selectable cards |
| 2 | Mobile number | Country-code dropdown (live API) + phone input → sends an OTP |
| 3 | OTP verification | 4-digit OTP entry with auto-advance → verifies the OTP |
| 4 | Your name | First / last name inputs |
| 5 | Create password | Password + confirm, with reveal toggles |
| 6 | All set | Success modal with an account summary |

## Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite 6** — build tool / dev server
- **Tailwind CSS v4** — all styling is utility-class based (no CSS Modules,
  no hand-written component CSS); design tokens live in an `@theme` block
- **lucide-react** — icons
- **clsx** — conditional class names

## Getting started

Requires Node.js 18+, 20+, or 22+.

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Integrations

### Country codes — RestCountries API

The country-code dropdown is populated live from
[`restcountries.com/v3.1/all`](https://restcountries.com/) (a free, keyless,
CORS-enabled API). Each option shows the flag, country name, and dial code, and the
list is searchable. `src/hooks/useCountries.ts` parses the response and falls back to a
short offline list if the API is unreachable.

### Phone number

The number field strips non-numeric characters and is hard-capped at **10 digits**;
`Continue` stays disabled until exactly 10 are entered.

### OTP send / verify — mock service

Real SMS delivery requires a paid provider (Twilio / MSG91 / Fast2SMS …), a **secret
API key**, and a **backend** to keep that key off the client — none of which can live
in a frontend-only app. So `src/lib/otpService.ts` is a **mock** that keeps the exact
async shape of a real service:

- `sendOtp(phone)` generates a 4-digit code, starts a 5-minute session, and (since no
  real SMS is sent) surfaces the code in an in-app toast.
- `verifyOtp(code)` checks the code, handling wrong / expired / not-yet-sent cases.

Both success and error states are shown via toasts. To go live, replace the two
functions with `fetch` calls to your own backend endpoints (e.g. `/api/otp/send`,
`/api/otp/verify`) that hold the provider key.

## Project structure

```
src/
  assets/            illustration-account.svg  (exported from Figma)
  styles/
    globals.css      Tailwind entry: @theme tokens + shared keyframes
  hooks/
    useFrameScale.ts scales the 1440×1024 frame to fit any viewport
    useCountries.ts  fetches + parses the RestCountries list
  lib/
    otpService.ts    mock OTP send / verify service
  components/        Button, TextField, OptionCard, OtpInput, CountrySelect,
                     ProgressBar, BrandPanel, BackgroundDecor, ScreenShell, Toast
  components/screens/ one file per flow step + SuccessModal
  types.ts           shared types
  App.tsx            step state + flow orchestration
```

## Design fidelity notes

The design is a fixed **1440×1024** desktop frame, rendered at its exact pixel
dimensions and scaled proportionally (`useFrameScale`) so it stays sharp on any
viewport. The only inline styles are the runtime-computed frame scale and the progress
bar fill — everything else is Tailwind utilities. Design tokens (`#0054FD` brand blue,
`#132C4A` navy, the Rubik type scale, spacing, radii, shadows) were read from the Figma
file and live in the `@theme` block of `src/styles/globals.css`. Entrance animations
are CSS keyframes (transform/opacity only) and respect `prefers-reduced-motion`.
