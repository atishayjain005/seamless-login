/**
 * Mock OTP service.
 *
 * Real SMS delivery requires a paid provider (Twilio / MSG91 / Fast2SMS …),
 * a secret API key, and a backend to keep that key off the client. This mock
 * keeps the exact async shape of such a service so a real provider can be
 * dropped in by replacing the two functions below with `fetch` calls to your
 * own backend endpoints (`/api/otp/send`, `/api/otp/verify`).
 */

export interface OtpSendResult {
  ok: boolean;
  message: string;
  /** The generated code — surfaced in the UI only because no real SMS is sent. */
  code?: string;
}

export interface OtpVerifyResult {
  ok: boolean;
  message: string;
}

interface OtpSession {
  phone: string;
  code: string;
  expiresAt: number;
}

const OTP_LENGTH = 4;
const OTP_TTL_MS = 5 * 60 * 1000;

let session: OtpSession | null = null;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function generateCode(): string {
  const max = 10 ** OTP_LENGTH;
  return String(Math.floor(Math.random() * max)).padStart(OTP_LENGTH, "0");
}

/** "Sends" an OTP to the given phone number and starts a verification session. */
export async function sendOtp(fullPhone: string): Promise<OtpSendResult> {
  await wait(750);

  const digits = fullPhone.replace(/\D/g, "");
  if (digits.length < 10) {
    return { ok: false, message: "Enter a valid phone number before requesting an OTP." };
  }

  const code = generateCode();
  session = { phone: fullPhone, code, expiresAt: Date.now() + OTP_TTL_MS };
  return { ok: true, message: `OTP sent to ${fullPhone}`, code };
}

/** Verifies a code against the active session. */
export async function verifyOtp(input: string): Promise<OtpVerifyResult> {
  await wait(650);

  if (!session) {
    return { ok: false, message: "Please request an OTP first." };
  }
  if (Date.now() > session.expiresAt) {
    session = null;
    return { ok: false, message: "This OTP has expired — resend a new one." };
  }
  if (input !== session.code) {
    return { ok: false, message: "Incorrect OTP. Please try again." };
  }

  session = null;
  return { ok: true, message: "Phone number verified successfully." };
}
