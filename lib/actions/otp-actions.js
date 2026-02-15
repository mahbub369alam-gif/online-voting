"use server";

import prisma from "@/lib/prisma";
import { sendOtpToVoter, verifyVoterOtp } from "@/lib/services/otp-service";

/**
 * Send OTP to voter's phone number
 */
export async function sendOtp(voterId) {
  try {
    // Get voter's phone number for masking
    const voter = await prisma.voter.findUnique({
      where: { voterId: voterId },
      select: {
        phoneNumber: true,
        name: true,
      },
    });

    if (!voter || !voter.phoneNumber) {
      return {
        success: false,
        error: "Voter phone number not found",
      };
    }

    // Send OTP via OTP service
    const otpResult = await sendOtpToVoter(voterId);

    if (!otpResult.success) {
      return {
        success: false,
        error: otpResult.error || "Failed to send OTP",
      };
    }

    return {
      success: true,
      message: "OTP sent successfully",
      maskedPhone: maskPhoneNumber(voter.phoneNumber),
    };
  } catch (error) {
    console.error("Send OTP error:", error);
    return {
      success: false,
      error: "Failed to send OTP",
    };
  }
}

/**
 * Verify OTP code for voter
 */
export async function verifyOtp(voterId, otpCode) {
  try {
    // Verify OTP via OTP service
    const verificationResult = await verifyVoterOtp(voterId, otpCode);

    if (!verificationResult.success) {
      return {
        success: false,
        error: verificationResult.error || "Invalid OTP",
      };
    }

    return {
      success: true,
      message: "OTP verified successfully",
    };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return {
      success: false,
      error: "Failed to verify OTP",
    };
  }
}

/**
 * Helper function to mask phone number
 */
function maskPhoneNumber(phone) {
  if (!phone || phone.length < 6) return phone;
  const first3 = phone.substring(0, 3);
  const last3 = phone.substring(phone.length - 3);
  const middle = "*".repeat(phone.length - 6);
  return `${first3}${middle}${last3}`;
}
