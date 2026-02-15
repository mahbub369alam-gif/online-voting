// lib/services/twilio-verify.js
import twilio from "twilio";

/**
 * Convert Bangladeshi numbers to E.164 format for Twilio.
 * Accepts: 01XXXXXXXXX, 8801XXXXXXXXX, +8801XXXXXXXXX
 * Returns: +8801XXXXXXXXX (best effort)
 */
export function toBdE164(phone) {
  const raw = String(phone ?? "").trim().replace(/\s|-/g, "");

  if (!raw) return "";

  if (raw.startsWith("+880") && raw.length >= 14) return raw;          // +8801XXXXXXXXX
  if (raw.startsWith("880") && raw.length >= 13) return `+${raw}`;     // 8801XXXXXXXXX
  if (raw.startsWith("01") && raw.length === 11) return `+88${raw}`;   // 01XXXXXXXXX

  // fallback: if they already passed +E164 keep it
  if (raw.startsWith("+")) return raw;

  // last resort
  return `+${raw}`;
}

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    throw new Error(
      "Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local"
    );
  }
  return twilio(sid, token);
}

function getServiceSid() {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!serviceSid) {
    throw new Error(
      "Missing TWILIO_VERIFY_SERVICE_SID in .env.local (Twilio Verify service SID)"
    );
  }
  return serviceSid;
}

/**
 * Send OTP via Twilio Verify
 */
export async function sendVerifyOtp(toPhoneE164) {
  const client = getClient();
  const serviceSid = getServiceSid();

  return client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: toPhoneE164, channel: "sms" });
}

/**
 * Check OTP via Twilio Verify
 */
export async function checkVerifyOtp(toPhoneE164, code) {
  const client = getClient();
  const serviceSid = getServiceSid();

  return client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: toPhoneE164, code });
}
