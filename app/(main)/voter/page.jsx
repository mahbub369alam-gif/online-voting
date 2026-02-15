"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaceVerification } from "@/components/voter/face-verification";
import { LiveVotingCount } from "@/components/voter/live-voting-count";
import { OtpVerification } from "@/components/voter/otp-verification";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Function to check voter eligibility based on election requirements
const checkVoterEligibility = (electionSettings, voterData) => {
  const missingRequirements = [];

  // Check face verification requirements
  if (electionSettings.faceVerification) {
    if (!voterData.imageUrl || voterData.imageUrl.trim() === "") {
      missingRequirements.push("profile image for face verification");
    }
    if (!voterData.faceToken || voterData.faceToken.trim() === "") {
      missingRequirements.push("face token for verification");
    }
  }

  // Check OTP verification requirements
  if (electionSettings.otpVerification) {
    if (!voterData.phoneNumber || voterData.phoneNumber.trim() === "") {
      missingRequirements.push("phone number for OTP verification");
    }
  }

  if (missingRequirements.length > 0) {
    return {
      eligible: false,
      message: `You are not eligible for this election. Missing: ${missingRequirements.join(
        ", "
      )}. For voting, contact your election administrator.`,
    };
  }

  return {
    eligible: true,
    message: "Voter is eligible for this election.",
  };
};

export default function VoterDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const voterId = searchParams.get("voterId");

  const [electionSettings, setElectionSettings] = useState(null);
  const [voterData, setVoterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityError, setEligibilityError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Fetch election settings and voter data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch election settings
        const electionResponse = await fetch("/api/elections/active");
        let electionData = null;
        if (electionResponse.ok) {
          electionData = await electionResponse.json();
          setElectionSettings(electionData);
        } else {
          console.error("No active election found");
          setLoading(false);
          return;
        }

        // Fetch voter data
        const voterResponse = await fetch(`/api/voters/${voterId}`);
        if (voterResponse.ok) {
          const voterInfo = await voterResponse.json();
          setVoterData(voterInfo);

          // Check eligibility based on election requirements
          const eligibilityCheck = checkVoterEligibility(
            electionData,
            voterInfo
          );
          if (!eligibilityCheck.eligible) {
            setEligibilityError(eligibilityCheck.message);
          }
        } else {
          setEligibilityError(
            "Voter not found in the system. Please contact your election administrator."
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setEligibilityError(
          "Failed to load voter information. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (voterId) {
      fetchData();
    }
  }, [voterId]);

  // Create verification steps based on election settings
  const getVerificationSteps = () => {
    if (!electionSettings) return [];

    const steps = [];

    if (electionSettings.faceVerification) {
      steps.push({
        id: "face",
        title: "Face Verification",
        description: "Verify your identity using facial recognition",
        component: FaceVerification,
      });
    }

    if (electionSettings.otpVerification) {
      steps.push({
        id: "otp",
        title: "Phone Verification",
        description: "Verify your phone number with OTP",
        component: OtpVerification,
      });
    }

    return steps;
  };

  const verificationSteps = getVerificationSteps();
  const totalSteps = verificationSteps.length;
  const allStepsCompleted = completedSteps.size === totalSteps;

  const handleStepCompleted = (stepId) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));

    // Move to next step if available
    const currentStepIndex = verificationSteps.findIndex(
      (step) => step.id === stepId
    );
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStep(currentStepIndex + 1);
    }
  };

  const handleNext = () => {
    router.push(`/voter/vote?voterId=${voterId}`);
  };

  if (!voterId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Invalid Access
            </h2>
            <p className="text-sm text-muted-foreground">
              Voter ID is required to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Loading election settings...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!electionSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">
              No Active Election
            </h2>
            <p className="text-sm text-muted-foreground">
              There is no active election at the moment. Please check back
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show eligibility error if voter is not eligible
  if (eligibilityError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Not Eligible for Voting
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {eligibilityError}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>What to do next:</strong>
                <br />
                • Contact your election administrator
                <br />
                • Ensure your profile information is complete
                <br />• Verify your registration details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {electionSettings.title}
            </CardTitle>
            {voterData && (
              <p className="text-lg font-medium text-indigo-600 mb-2">
                Welcome, {voterData.name}
              </p>
            )}
            <p className="text-muted-foreground">
              Complete the verification steps to proceed with voting
            </p>
          </CardHeader>
        </Card>

        {/* Progress Steps */}
        {totalSteps > 0 && (
          <Card className="bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Verification Progress</h3>
                <Badge variant={allStepsCompleted ? "success" : "secondary"}>
                  {completedSteps.size} of {totalSteps} completed
                </Badge>
              </div>

              <div className="space-y-3">
                {verificationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      completedSteps.has(step.id)
                        ? "bg-green-50/10 border-green-200"
                        : currentStep === index
                        ? "bg-blue-50/10 border-blue-200"
                        : "bg-gray-50/10 border-gray-200"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        completedSteps.has(step.id)
                          ? "bg-green-500 text-white"
                          : currentStep === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {completedSteps.has(step.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {completedSteps.has(step.id) && (
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Verification Step */}
        {totalSteps > 0 && currentStep < totalSteps && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Step {currentStep + 1}: {verificationSteps[currentStep].title}
              </h2>
              <p className="text-muted-foreground">
                {verificationSteps[currentStep].description}
              </p>
            </div>

            <div className="flex justify-center">
              {React.createElement(verificationSteps[currentStep].component, {
                voterId,
                voterData,
                onVerified: () =>
                  handleStepCompleted(verificationSteps[currentStep].id),
              })}
            </div>
          </div>
        )}

        {/* No Verification Required or All Steps Completed */}
        {(totalSteps === 0 || allStepsCompleted) && (
          <div className="space-y-6">
            <Card className="bg-transparent">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-green-700 mb-2">
                  {totalSteps === 0
                    ? "Ready to Vote!"
                    : "Verification Complete!"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {totalSteps === 0
                    ? "No additional verification is required for this election."
                    : "All verification steps have been completed successfully."}
                </p>
                <Button
                  onClick={handleNext}
                  className="w-full max-w-xs h-12 bg-green-500 hover:bg-green-600 font-semibold text-lg"
                >
                  Proceed to Vote
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Voting Count */}
        <LiveVotingCount />
      </div>
    </div>
  );
}
