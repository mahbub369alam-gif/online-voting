"use server";

import prisma from "@/lib/prisma";

/**
 * Verify if the entered phone number matches the voter's registered phone number
 */
export async function verifyPhoneNumber(voterId, enteredPhone) {
  try {
    const voter = await prisma.voter.findUnique({
      where: { voterId: voterId },
      select: {
        phoneNumber: true,
      },
    });

    if (!voter) {
      return {
        success: false,
        error: "Voter not found",
      };
    }

    if (!voter.phoneNumber) {
      return {
        success: false,
        error: "No phone number registered for this voter",
      };
    }

    if (voter.phoneNumber !== enteredPhone) {
      return {
        success: false,
        error: "Phone number doesn't match your registered number",
      };
    }

    return {
      success: true,
      message: "Phone number verified successfully",
    };
  } catch (error) {
    console.error("Phone verification error:", error);
    return {
      success: false,
      error: "Failed to verify phone number",
    };
  }
}
