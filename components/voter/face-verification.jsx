"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  initializeFaceDetection,
  performLivenessCheck,
} from "@/lib/utils/faceDetection";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FaceVerification({ voterId, voterData, onVerified }) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [matchingFace, setMatchingFace] = useState(false);
  const [livenessStep, setLivenessStep] = useState({
    step: 0,
    message: "মুখ সোজা রাখুন",
    direction: "CENTER",
    progress: 0,
  });

  const videoRef = useRef(null);

  // Effect to handle stream changes
  useEffect(() => {
    if (stream && videoRef.current && isCameraOn) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => {
        console.error("Video play failed:", e);
        setError("ভিডিও প্লে করতে সমস্যা হয়েছে।");
      });
    }
  }, [stream, isCameraOn]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  /**
   * Start camera and initialize face detection
   */
  const startCamera = async () => {
    try {
      setError(null);
      setIsInitializing(true);

      // Initialize face detection models
      const initResult = await initializeFaceDetection("/models");
      if (!initResult.success) {
        throw new Error("ফেস ডিটেকশন মডেল লোড করতে ব্যর্থ।");
      }

      // Start camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      setStream(mediaStream);
      setIsCameraOn(true);
      setIsInitializing(false);
    } catch (error) {
      console.error("Camera access error:", error);
      setIsInitializing(false);
      setError(
        error.message ||
          "ক্যামেরা অ্যাক্সেস করতে পারছি না। অনুগ্রহ করে ক্যামেরা অনুমতি দিন।"
      );
    }
  };

  /**
   * Stop camera
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraOn(false);
      setIsVerifying(false);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  /**
   * Handle liveness check step change
   */
  const handleStepChange = (step, stepData) => {
    setLivenessStep({
      step,
      message: stepData.message,
      direction: stepData.direction,
      progress: 0,
    });
  };

  /**
   * Handle liveness check progress
   */
  const handleProgress = (progressData) => {
    setLivenessStep((prev) => ({
      ...prev,
      ...progressData,
    }));
  };

  /**
   * Start face verification with liveness check
   */
  const handleFaceVerification = async () => {
    if (!videoRef.current) return;

    try {
      setIsVerifying(true);
      setError(null);

      setLivenessStep({
        step: 0,
        message: "মুখ সোজা রাখুন",
        direction: "CENTER",
        progress: 0,
      });

      // Perform liveness check
      const result = await performLivenessCheck(
        videoRef.current,
        handleStepChange,
        handleProgress
      );

      if (result.success) {
        setCapturedImage(result.image);
        // Call onVerified callback with captured image
        setMatchingFace(true);

        const formData = new FormData();
        formData.append("voterId", voterId);
        formData.append("capturedImage", result.file);

        const resultOfCompare = await fetch("/api/voter/compare", {
          method: "POST",
          body: formData,
        });

        const data = await resultOfCompare.json();

        if (data.success) {
          onVerified?.(result.file);
          setIsVerified(true);
        } else {
          setError(data.error);
          setIsVerified(false);
        }

        stopCamera();
        setMatchingFace(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.message || "যাচাইকরণে ত্রুটি হয়েছে।");
      setIsVerifying(false);
    }
  };

  /**
   * Get direction icon
   */
  const getDirectionIcon = (direction) => {
    switch (direction) {
      case "LEFT":
        return <ArrowLeft className="h-8 w-8" />;
      case "RIGHT":
        return <ArrowRight className="h-8 w-8" />;
      case "CENTER":
      default:
        return <Circle className="h-8 w-8" />;
    }
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto bg-transparent">
        <CardContent className="p-6 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Face Verified!
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your identity has been successfully verified.
          </p>

          {/* Show captured image */}
          {capturedImage && (
            <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden border-2 border-green-500">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (matchingFace) {
    return (
      <Card className="w-full max-w-md mx-auto bg-transparent">
        <CardContent className="p-6 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Face Matching.....
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please wait while we verify your face.
          </p>

          {/* Show captured image */}
          {capturedImage && (
            <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden border-2 border-green-500">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/* Loader */}
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm text-muted-foreground">Verifying...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-center">Face Verification</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Follow the on-screen instructions for liveness verification
          </p>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Section */}
      <Card className="bg-transparent">
        <CardContent className="p-6 text-center space-y-4">
          {!isCameraOn ? (
            <>
              {/* Camera Icon */}
              <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto border-4 border-blue-300 shadow-lg">
                {isInitializing ? (
                  <Loader2 className="h-20 w-20 text-blue-600 animate-spin" />
                ) : (
                  <Camera className="h-20 w-20 text-blue-600" />
                )}
              </div>

              <p className="text-sm text-gray-600">
                {isInitializing
                  ? "মডেল লোড হচ্ছে..."
                  : "Click the button below to start your camera"}
              </p>

              <Button
                onClick={startCamera}
                disabled={isInitializing}
                className="w-full max-w-xs h-12 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    লোড হচ্ছে...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Start Camera
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Live Camera Feed */}
              <div className="relative w-full max-w-sm mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-lg bg-black shadow-lg"
                  style={{ transform: "scaleX(-1)" }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch((e) => {
                        console.error("Play on metadata failed:", e);
                      });
                    }
                  }}
                />

                {/* Liveness Check Overlay */}
                {isVerifying && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-3">
                      {/* Direction Icon */}
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                        {getDirectionIcon(livenessStep.direction)}
                      </div>

                      {/* Message */}
                      <p className="text-white font-semibold text-lg bg-opacity-50 px-4 py-2 rounded">
                        {livenessStep.message}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-48 mx-auto">
                        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-200"
                            style={{ width: `${livenessStep.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Step Indicator */}
                      <p className="text-white text-xs">
                        Step {livenessStep.step + 1} of 3
                      </p>
                    </div>
                  </div>
                )}

                {/* Camera Controls */}
                {!isVerifying && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      onClick={handleFaceVerification}
                      size="sm"
                      className="rounded-full bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Start Verification
                    </Button>
                    <Button
                      onClick={stopCamera}
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                    >
                      Stop
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">
                {isVerifying
                  ? "নির্দেশনা অনুসরণ করুন"
                  : 'Position your face clearly and click "Start Verification"'}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click the camera button to start</li>
            <li>• Allow camera access when prompted</li>
            <li>• Follow 3 steps: Face Center → Turn Left → Turn Right</li>
            <li>• Remove your glasses or cap before starting</li>
            <li>• Keep your face clearly visible throughout</li>
            <li>• Verification completes automatically</li>
          </ul>
        </CardContent>
      </Card>

      {/* Camera Permission Notice */}
      {!isCameraOn && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  Camera Permission Required
                </p>
                <p className="text-sm text-yellow-700">
                  Please allow camera access to proceed with face verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
