/**
 * SMS Service Module
 * This module handles all SMS-related operations including OTP sending and verification
 */

// In-memory storage for demo purposes (use Redis or database in production)
const otpStorage = new Map();

/**
 * Generate a random 4-digit OTP
 */
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Send OTP via SMS
 * @param {string} phoneNumber - The phone number to send OTP to
 * @returns {Promise<{success: boolean, error?: string, otpId?: string}>}
 */
export async function sendSmsOtp(phoneNumber) {
  try {
    // Generate OTP
    const otp = generateOtp();
    const otpId = `${phoneNumber}_${Date.now()}`;

    // Store OTP with expiration (5 minutes)
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStorage.set(phoneNumber, {
      otp,
      otpId,
      expirationTime,
      attempts: 0,
    });

    // TODO: Implement actual SMS sending
    // Replace this section with your SMS service integration:

    // For demo purposes, log the OTP
    console.log(`[SMS SERVICE] Sending OTP ${otp} to ${phoneNumber}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      otpId,
    };
  } catch (error) {
    console.error("SMS sending error:", error);
    return {
      success: false,
      error: "Failed to send SMS",
    };
  }
}

/**
 * Verify OTP code
 * @param {string} phoneNumber - The phone number to verify OTP for
 * @param {string} otpCode - The OTP code to verify
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verifySmsOtp(phoneNumber, otpCode) {
  try {
    const storedOtpData = otpStorage.get(phoneNumber);

    if (!storedOtpData) {
      return {
        success: false,
        error: "No OTP found for this phone number",
      };
    }

    // Check if OTP has expired
    if (Date.now() > storedOtpData.expirationTime) {
      otpStorage.delete(phoneNumber);
      return {
        success: false,
        error: "OTP has expired. Please request a new one.",
      };
    }

    // Check attempt limit (max 3 attempts)
    if (storedOtpData.attempts >= 3) {
      otpStorage.delete(phoneNumber);
      return {
        success: false,
        error: "Too many failed attempts. Please request a new OTP.",
      };
    }

    // Verify OTP
    if (storedOtpData.otp !== otpCode) {
      storedOtpData.attempts += 1;
      otpStorage.set(phoneNumber, storedOtpData);

      return {
        success: false,
        error: `Invalid OTP. ${3 - storedOtpData.attempts} attempts remaining.`,
      };
    }

    // OTP is valid, remove from storage
    otpStorage.delete(phoneNumber);

    console.log(`[SMS SERVICE] OTP verified successfully for ${phoneNumber}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      error: "Failed to verify OTP",
    };
  }
}
