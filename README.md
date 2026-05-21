# Seamless Login — Figma Replica

A pixel-faithful **React + TypeScript** implementation of the "Assignment Screens •
Login flow" Figma design: a six-step account-creation flow with a live country-code
dropdown and a working OTP send / verify flow.

[Figma design →](https://www.figma.com/design/4pHTqhD8XvvC1ZPsP7i7RT/Assignment-Screens-%E2%80%A2Login-flow---Root?node-id=1-22)

---

## Table of contents

1. [The flow](#the-flow)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Project structure](#project-structure)
5. [Implementation walkthrough](#implementation-walkthrough)
6. [Design fidelity](#design-fidelity)
7. [Re-extracting from Figma](#re-extracting-from-figma)
8. [Known limitations](#known-limitations)

---

## The flow

The app is a single screen that walks the user through six steps. State lives in
`App.tsx`; each step is its own component under `src/components/screens/`.

| Step | Screen | What it does |
| ---- | ------ | ------------ |
| 1 | Account type | Choose Personal or Business (selectable cards) |
| 2 | Mobile number | Country-code dropdown (live API) + 10-digit phone → **sends an OTP** |
| 3 | OTP verification | 4-box code entry with auto-advance → **verifies the OTP** |
| 4 | Your name | First / last name inputs |
| 5 | Create password | Password + confirm, with show/hide toggles |
| 6 | All set | Success modal with an account summary |

`Continue` is disabled until the current step is valid, so the user can't skip ahead.

---

## Tech stack

| Concern | Choice | Notes |
| ------- | ------ | ----- |
| UI | **React 19** + **TypeScript** (strict) | Functional components, typed props |
| Build | **Vite 6** | Fast dev server + production build |
| Styling | **Tailwind CSS v4** | Utility classes only — no CSS Modules, no hand-written component CSS. Tokens live in an `@theme` block |
| Icons | **lucide-react** | Tree-shaken, only used icons imported |
| Class merging | **clsx** | Conditional class names |
| Animation | **CSS keyframes** | Compositor-driven (transform/opacity only); respects `prefers-reduced-motion` |

> Create React App was intentionally not used — it is deprecated and does not support
> React 19. Vite is the modern equivalent.

---

## Getting started

Requires Node.js 18+, 20+, or 22+.

```bash
npm install
npm run dev       # dev server  → http://localhost:5173
npm run build     # type-check (tsc) + production build → dist/
npm run preview   # serve the production build locally
npm run lint      # eslint
```

---

## Project structure

```
seemless-login/
├── index.html                  Rubik font links + Tailwind base classes on <body>
├── vite.config.ts              React + Tailwind v4 Vite plugins
├── src/
│   ├── main.tsx                React root; imports the global stylesheet
│   ├── App.tsx                 Flow orchestration — step + form + toast state
│   ├── types.ts                FormState, AccountType, ToastMessage, ScreenProps
│   │
│   ├── assets/
│   │   └── illustration-account.svg   Account illustration (exported from Figma)
│   │
│   ├── styles/
│   │   └── globals.css         @import tailwindcss · @theme tokens · @keyframes
│   │
│   ├── hooks/
│   │   ├── useFrameScale.ts    Scales the 1440×1024 frame to fit any viewport
│   │   └── useCountries.ts     Fetches + parses the RestCountries list
│   │
│   ├── lib/
│   │   └── otpService.ts       Mock OTP send / verify service
│   │
│   └── components/
│       ├── BrandPanel.tsx      Left column — heading + illustration (memoised)
│       ├── ScreenShell.tsx     White form card: progress bar, heading, footer
│       ├── Button.tsx          Primary / secondary button, with loading state
│       ├── ProgressBar.tsx     Top-of-card step progress
│       ├── TextField.tsx       Labelled input (+ password reveal toggle)
│       ├── OptionCard.tsx      Selectable Personal / Business card
│       ├── OtpInput.tsx        4-box OTP entry with auto-advance + paste
│       ├── CountrySelect.tsx   Searchable country-code dropdown
│       ├── Toast.tsx           Top-of-viewport feedback toast
│       └── screens/
│           ├── RoleScreen.tsx       Step 1
│           ├── MobileScreen.tsx     Step 2 — country + phone + sendOtp
│           ├── OtpScreen.tsx        Step 3 — OTP entry + verifyOtp
│           ├── NameScreen.tsx       Step 4
│           ├── PasswordScreen.tsx   Step 5
│           └── SuccessModal.tsx     Step 6 — overlay modal
```

---

## Implementation walkthrough

### Flow orchestration — `App.tsx`

A single `App` component owns all state:

- `step` (1–6) — the current step. `goNext` / `goBack` clamp it.
- `form` — one `FormState` object. A `update(patch)` helper merges partial updates.
- `toast` — the active toast message, or `null`.

`renderScreen(step)` returns the matching screen component. Step 6 renders the
`SuccessModal` over the (frozen) step-5 screen. Every screen receives the same
`ScreenProps` (`form`, `update`, `onNext`, `onBack`, `showToast`), so screens stay
decoupled from each other.

### The fixed frame + scaling — `useFrameScale.ts`

The Figma artboard is a fixed **1440×1024** desktop frame, so the app renders at those
exact dimensions and the whole frame is scaled to fit the viewport with
`transform: scale()`. The scale is `min((vw − margin)/1440, (vh − margin)/1024, 1)` —
it never scales up, and an outer wrapper is sized to the *scaled* dimensions so the
frame stays centred. This keeps every spacing value pixel-accurate.

### Design tokens — `styles/globals.css`

Tailwind v4 is configured CSS-first. The `@theme` block defines the colours
(`brand` `#0054FD`, `navy` `#132C4A`, …), the **Rubik** font, shadows, and named
animations — all extracted from the Figma file. They become utilities automatically
(`bg-brand`, `text-navy`, `shadow-panel`, `animate-rise-1`, …). Keyframes are defined
below the theme; a `prefers-reduced-motion` block neutralises them for users who opt
out.

### Country-code dropdown — `useCountries.ts` + `CountrySelect.tsx`

`useCountries` fetches [`restcountries.com/v3.1/all`](https://restcountries.com/)
(free, keyless, CORS-enabled) and maps each country to `{ code, name, dialCode, flag }`.
The dial code is built from `idd.root` + `idd.suffixes` (the root alone when a country
has many area-code suffixes). If the request fails it falls back to a built-in list of
ten common countries. `CountrySelect` renders a searchable dropdown — flag, name, and
dial code per row — and closes on outside-click.

### Phone validation — `MobileScreen.tsx`

The number input strips non-numeric characters and is hard-capped at **10 digits**
(`replace(/\D/g, "").slice(0, 10)`). A live `0/10 digits` counter shows progress and
`Continue` stays disabled until exactly 10 digits are entered.

### OTP send / verify — `otpService.ts`

Real SMS delivery needs a paid provider (Twilio / MSG91 / Fast2SMS …), a **secret API
key**, and a **backend** to keep that key off the client — none of which belong in a
frontend-only app. So `otpService.ts` is a **mock** that keeps the exact async shape of
a real service:

- `sendOtp(phone)` — generates a 4-digit code, opens a 5-minute session, and (since no
  real SMS is sent) returns the code so the UI can show it in a toast.
- `verifyOtp(code)` — checks the code, handling wrong / expired / not-yet-requested
  cases.

`MobileScreen` calls `sendOtp` on Continue; `OtpScreen` calls `verifyOtp`. Both show a
loading spinner on the button and surface success / error via toasts. **To go live**,
replace these two functions with `fetch` calls to your own backend endpoints (e.g.
`/api/otp/send`, `/api/otp/verify`) that hold the provider key.

### Animations

All motion is CSS — keyframes (`rise`, `screen-in`, `modal-pop`, `toast-in`, …) plus
Tailwind `transition` utilities for hover/tap. They animate only `transform` and
`opacity`, so they are compositor-driven and never trigger layout.

### Performance

- `BrandPanel` is wrapped in `React.memo` — it has no props and never needs to
  re-render as the form changes.
- Only used `lucide-react` icons are imported (tree-shaken).
- The illustration ships as a single optimised SVG.
- Animations avoid layout-triggering properties.

---

## Design fidelity

Colours, the Rubik type scale, spacing, radii, and shadows were read directly from the
Figma file and centralised in the `@theme` block. The frame renders at its exact
1440×1024 size; the only inline styles in the whole app are the two genuinely
runtime-computed values — the frame `scale` and the progress-bar fill — which no static
utility class can express. The account illustration was exported from Figma as SVG.

---

## Re-extracting from Figma

This project was built without a Figma API token. To re-extract assets:

1. Figma → Settings → Security → **Personal access tokens** → generate one.
2. File tree: `GET https://api.figma.com/v1/files/{fileKey}` with header
   `X-Figma-Token: {token}` — `fileKey` is `4pHTqhD8XvvC1ZPsP7i7RT`.
3. Assets: `GET https://api.figma.com/v1/images/{fileKey}?ids={nodeIds}&format=svg`.

Or select any layer in Figma's **Dev Mode** to read its exact properties, or use the
layer's **Export** panel.

---

## Known limitations

- **OTP is mocked** — no real SMS is sent. The generated code is shown in a toast for
  the demo. Going live needs a provider key + a backend (see above).
- The design is a **desktop artboard**; it scales to fit smaller screens but is not
  re-laid-out for mobile (the Figma file has no mobile breakpoint).
- A few RestCountries entries have unusual dial-code data (e.g. dependent territories);
  these are shown as-is from the API.
