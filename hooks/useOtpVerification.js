"use client";

import { verifyPhoneNumber } from "@/lib/actions/phone-verification";
import { sendOtpToVoter, verifyVoterOtp } from "@/lib/services/otp-service";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook for OTP verification process
 */
export function useOtpVerification(voterId) {
  const [enteredPhone, setEnteredPhone] = useState("");
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState("");

  /**
   * Verify phone number against registered number
   */
  const handleVerifyPhone = async () => {
    if (!enteredPhone) {
      setError("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyPhoneNumber(voterId, enteredPhone);

      if (result.success) {
        setIsPhoneVerified(true);
        toast.success("Phone number verified! You can now request OTP.");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to verify phone number");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send OTP to voter's phone
   */
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const result = await sendOtpToVoter(voterId);

      if (result.success) {
        setIsOtpSent(true);
        setMaskedPhone(result.maskedPhone);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP code
   */
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyVoterOtp(voterId, otp);

      if (result.success) {
        setIsVerified(true);
        toast.success("Phone number verified successfully!");
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (error) {
      setError("Failed to verify OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset the entire process
   */
  const handleStartOver = () => {
    setEnteredPhone("");
    setOtp("");
    setIsPhoneVerified(false);
    setIsOtpSent(false);
    setIsVerified(false);
    setMaskedPhone("");
  };

  return {
    // State
    enteredPhone,
    otp,
    isPhoneVerified,
    isOtpSent,
    isVerified,
    isLoading,
    maskedPhone,
    error,

    // Actions
    setEnteredPhone,
    setOtp,
    handleVerifyPhone,
    handleSendOtp,
    handleVerifyOtp,
    handleStartOver,
  };
}
