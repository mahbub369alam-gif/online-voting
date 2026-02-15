"use client";

import { updateStatus } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  MessageSquareOff,
  MessageSquareShare,
  ScanFace,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";

export default function ElectionSecurity({ election }) {
  const handleFaceVerification = async (electionId, currentStatus) => {
    const status = await updateStatus(electionId, {
      faceVerification: !currentStatus,
    });
    if (status) {
      return toast.success(
        currentStatus
          ? "Face verification disabled"
          : "Face verification enabled"
      );
    }
    if (status.error) return toast.error(status.error);

    return toast.error("Failed to update election status");
  };

  const handleOtpVerification = async (electionId, currentStatus) => {
    const status = await updateStatus(electionId, {
      otpVerification: !currentStatus,
    });
    if (status) {
      return toast.success(
        currentStatus ? "OTP verification disabled" : "OTP verification enabled"
      );
    }
    if (status.error) return toast.error(status.error);

    return toast.error("Failed to update election status");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        title="Toggle Face Verification"
        className={`p-0 border rounded-full hover:bg-teal-600 hover:text-white text-teal-600 border-teal-600`}
        onClick={() =>
          handleFaceVerification(election.id, election.faceVerification)
        }
      >
        {election.faceVerification ? <ScanFace /> : <ScanLine />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Toggle OTP Verification"
        className={`p-0 border rounded-full hover:bg-teal-600 hover:text-white text-teal-600 border-teal-600`}
        onClick={() =>
          handleOtpVerification(election.id, election.otpVerification)
        }
      >
        {election.otpVerification ? (
          <MessageSquareShare />
        ) : (
          <MessageSquareOff />
        )}
      </Button>
    </>
  );
}
