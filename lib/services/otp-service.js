"use server";

/**
 * OTP Service Module (Twilio Verify Edition)
 * - Sends OTP via Twilio Verify (Twilio generates the OTP)
 * - Verifies OTP via Twilio Verify
 * - Stores a short-lived "verified" flag in DB so UI can continue the flow
 */

import prisma from "@/lib/prisma";
import { sendVerifyOtp, checkVerifyOtp, toBdE164 } from "@/lib/services/twilio-verify";

/**
 * How long we keep "verified" state in DB after approval.
 * Keep it small; user only needs it to pass the OTP step.
 */
const VERIFIED_TTL_MINUTES = 10;

function nowPlusMinutes(min) {
  return new Date(Date.now() + min * 60 * 1000);
}

/**
 * Send OTP to voter's phone number (Twilio Verify)
 * @param {string} voterId - The voter's unique voterId (NOT Mongo ObjectId)
 * @returns {Promise<{success: boolean, error?: string, message?: string}>}
 */
export async function sendOtpToVoter(voterId) {
  try {
    // 1) Load voter
    const voter = await prisma.voter.findUnique({
      where: { voterId },
      select: { id: true, phoneNumber: true, name: true },
    });

    if (!voter || !voter.phoneNumber) {
      return { success: false, error: "Voter phone number not found" };
    }

    // 2) Convert to E.164 for Twilio
    const phoneE164 = toBdE164(voter.phoneNumber);
    if (!phoneE164 || !phoneE164.startsWith("+")) {
      return { success: false, error: "Invalid phone number format" };
    }

    // 3) If already verified recently, don't spam OTP
    const alreadyVerified = await prisma.voterOtp.findFirst({
      where: {
        voterId: voter.id,
        isVerified: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (alreadyVerified) {
      return { success: true, message: "Already verified" };
    }

    // 4) Send OTP via Twilio Verify
    await sendVerifyOtp(phoneE164);

    // 5) (Optional) Keep a "pending" record to help UI + rate limiting
    // We'll create a pending row with short expiry. Attempts are tracked locally here,
    // but Twilio already rate-limits; this is just extra safety / continuity with your schema.
    await prisma.voterOtp.create({
      data: {
        voterId: voter.id,
        otpCode: "TWILIO", // not used
        expiresAt: nowPlusMinutes(5),
        attempts: 0,
        isVerified: false,
      },
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("[OTP SERVICE] sendOtpToVoter error:", error);

    // Twilio error messages are often inside error.message
    return { success: false, error: error?.message || "Failed to send OTP" };
  }
}

/**
 * Verify OTP code for voter (Twilio Verify)
 * @param {string} voterId - The voter's unique voterId
 * @param {string} otpCode - The OTP code user typed
 * @returns {Promise<{success: boolean, error?: string, message?: string}>}
 */
export async function verifyVoterOtp(voterId, otpCode) {
  try {
    const code = String(otpCode ?? "").trim();

    if (!code || code.length < 4) {
      return { success: false, error: "OTP code is required" };
    }

    // 1) Load voter
    const voter = await prisma.voter.findUnique({
      where: { voterId },
      select: { id: true, phoneNumber: true },
    });

    if (!voter) return { success: false, error: "Voter not found" };
    if (!voter.phoneNumber) return { success: false, error: "Voter phone number not found" };

    // 2) Convert phone to E.164
    const phoneE164 = toBdE164(voter.phoneNumber);

    // 3) Optional attempt limiting using latest pending record
    const pending = await prisma.voterOtp.findFirst({
      where: {
        voterId: voter.id,
        isVerified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (pending && pending.attempts >= 3) {
      // cleanup pending to force re-send
      await prisma.voterOtp.deleteMany({ where: { voterId: voter.id, isVerified: false } });
      return { success: false, error: "Too many failed attempts. Please request a new OTP." };
    }

    // 4) Verify via Twilio
    const result = await checkVerifyOtp(phoneE164, code);

    if (result?.status === "approved") {
      // Mark verified in DB for a short time so UI can proceed
      // First, cleanup old OTP rows
      await prisma.voterOtp.deleteMany({ where: { voterId: voter.id } });

      await prisma.voterOtp.create({
        data: {
          voterId: voter.id,
          otpCode: "VERIFIED", // not used
          expiresAt: nowPlusMinutes(VERIFIED_TTL_MINUTES),
          attempts: 0,
          isVerified: true,
        },
      });

      console.log(`[OTP SERVICE] OTP verified successfully for voter ${voterId}`);
      return { success: true, message: "OTP verified successfully" };
    }

    // Not approved => bump attempts locally (if pending exists)
    if (pending) {
      await prisma.voterOtp.update({
        where: { id: pending.id },
        data: { attempts: { increment: 1 } },
      });

      const remaining = Math.max(0, 3 - (pending.attempts + 1));
      return { success: false, error: `Invalid OTP. ${remaining} attempts remaining.` };
    }

    return { success: false, error: "Invalid OTP. Please request a new OTP." };
  } catch (error) {
    console.error("[OTP SERVICE] verifyVoterOtp error:", error);
    return { success: false, error: error?.message || "Failed to verify OTP" };
  }
}

/**
 * Get OTP verification status for a voter
 * Keeps compatibility with your UI flow:
 * - returns isVerified true if we have a short-lived verified record
 * @param {string} voterId
 * @returns {Promise<{success: boolean, isVerified?: boolean, error?: string}>}
 */
export async function getOtpStatus(voterId) {
  try {
    const voter = await prisma.voter.findUnique({
      where: { voterId },
      select: { id: true },
    });

    if (!voter) return { success: false, error: "Voter not found" };

    const verified = await prisma.voterOtp.findFirst({
      where: {
        voterId: voter.id,
        isVerified: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, isVerified: !!verified };
  } catch (error) {
    console.error("[OTP SERVICE] getOtpStatus error:", error);
    return { success: false, error: "Failed to get OTP status" };
  }
}
