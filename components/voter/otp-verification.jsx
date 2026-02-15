"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOtpVerification } from "@/hooks/useOtpVerification";
import { maskPhoneNumber } from "@/lib/utils/phone-utils";
import { CheckCircle, Send, Smartphone } from "lucide-react";

export function OtpVerification({ voterData, onVerified, voterId }) {
  const registeredPhone = voterData?.phoneNumber || "";

  const {
    enteredPhone,
    otp,
    isPhoneVerified,
    isOtpSent,
    isVerified,
    isLoading,
    maskedPhone,
    error,
    setEnteredPhone,
    setOtp,
    handleVerifyPhone,
    handleSendOtp,
    handleVerifyOtp,
    handleStartOver,
  } = useOtpVerification(voterId);

  // Handle OTP verification completion
  const handleOtpVerificationComplete = async () => {
    const success = await handleVerifyOtp();
    if (success) {
      onVerified?.();
    }
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto bg-transparent">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Phone Verified!
          </h3>
          <p className="text-sm text-muted-foreground">
            Your phone number has been successfully verified.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent">
      <CardHeader className="text-center">
        {error && (
          <p className="text-red-500 bg-red-50 p-1 my-2 text-sm rounded">
            {error}
          </p>
        )}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Smartphone className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold">
          Phone Verification
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {!isPhoneVerified
            ? "First verify your phone number, then we'll send you an OTP"
            : isOtpSent
            ? "Enter the OTP sent to your phone"
            : "We'll send an OTP to your verified phone number"}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div
            className={`w-3 h-3 rounded-full ${
              !isPhoneVerified ? "bg-blue-500" : "bg-green-500"
            }`}
          ></div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div
            className={`w-3 h-3 rounded-full ${
              !isPhoneVerified
                ? "bg-gray-300"
                : !isOtpSent
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          ></div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div
            className={`w-3 h-3 rounded-full ${
              !isOtpSent ? "bg-gray-300" : "bg-blue-500"
            }`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
          <span>Verify Phone</span>
          <span>Send OTP</span>
          <span>Enter OTP</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPhoneVerified ? (
          <>
            <div>
              <Label htmlFor="registered-phone">
                Your Registered Phone Number
              </Label>
              <Input
                id="registered-phone"
                type="text"
                value={maskPhoneNumber(registeredPhone)}
                readOnly
                className="mt-1 bg-gray-50/60 text-center font-mono text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Enter your complete phone number to verify
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Enter Your Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your complete phone number"
                value={enteredPhone}
                onChange={(e) => setEnteredPhone(e.target.value)}
                className="mt-1 bg-gray-50/60 text-lg"
              />
            </div>

            <Button
              onClick={handleVerifyPhone}
              disabled={!enteredPhone}
              className="w-full"
            >
              Verify Phone Number
            </Button>
          </>
        ) : !isOtpSent ? (
          <>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">
                Phone Number Verified!
              </p>
              <p className="text-xs text-green-600 mt-1">
                {maskedPhone || maskPhoneNumber(registeredPhone)}
              </p>
            </div>

            <Button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send OTP
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="mt-1 text-center text-lg tracking-widest"
              />
            </div>
            <Button
              onClick={handleOtpVerificationComplete}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="w-full"
            >
              Start Over
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
