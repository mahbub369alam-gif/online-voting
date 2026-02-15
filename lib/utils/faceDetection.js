/**
 * Face Detection Utils with Liveness Check
 * Uses face-api.js for face detection and pose estimation
 *
 * Installation required:
 * npm install face-api.js
 *
 * Download models from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
 * Place models in: /public/models/
 */

import * as faceapi from "face-api.js";

// Model loading state
let modelsLoaded = false;

/**
 * Load face-api.js models
 * Call this once when app initializes
 */
export async function loadFaceModels(modelPath = "/models") {
  if (modelsLoaded) return true;

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    ]);

    modelsLoaded = true;
    console.log("Face detection models loaded successfully");
    return true;
  } catch (error) {
    console.error("Error loading face models:", error);
    return false;
  }
}

/**
 * Detect face in video frame
 */
async function detectFace(videoElement) {
  if (!modelsLoaded) {
    throw new Error("Models not loaded. Call loadFaceModels() first.");
  }

  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();

  return detection;
}

/**
 * Calculate head pose (yaw angle) from landmarks
 * Returns angle in degrees (-90 to 90)
 * Negative = Left turn, Positive = Right turn
 */
function calculateHeadPose(landmarks) {
  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Get nose tip and eye centers
  const noseTip = nose[3]; // Nose tip point
  const leftEyeCenter = {
    x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
    y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length,
  };
  const rightEyeCenter = {
    x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
    y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length,
  };

  // Calculate eye midpoint
  const eyeMidpoint = {
    x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
    y: (leftEyeCenter.y + rightEyeCenter.y) / 2,
  };

  // Calculate horizontal offset
  const horizontalOffset = noseTip.x - eyeMidpoint.x;
  const eyeDistance = Math.abs(rightEyeCenter.x - leftEyeCenter.x);

  // Normalize and convert to angle (approximate)
  const normalizedOffset = horizontalOffset / eyeDistance;
  const yawAngle = normalizedOffset * 60; // Scale to ~±60 degrees

  return yawAngle;
}

/**
 * Determine face direction based on yaw angle
 */
function getFaceDirection(yawAngle) {
  const THRESHOLD = 15; // degrees

  if (yawAngle < -THRESHOLD) {
    return "LEFT";
  } else if (yawAngle > THRESHOLD) {
    return "RIGHT";
  } else {
    return "CENTER";
  }
}

/**
 * Capture image from video element
 */
function captureFrame(videoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext("2d");
  // Mirror the image back (since video is mirrored)
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoElement, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.95);
}

/**
 * Convert data URL to Blob
 */
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Convert data URL to File
 */
export function dataURLtoFile(dataURL, filename = "face-capture.jpg") {
  const blob = dataURLtoBlob(dataURL);
  return new File([blob], filename, { type: "image/jpeg" });
}

/**
 * Main liveness detection function
 * Performs 4-step verification: Center -> Left -> Right -> Center (for capture)
 * Returns captured image if successful
 */
export async function performLivenessCheck(
  videoElement,
  onStepChange,
  onProgress
) {
  const STEPS = [
    { direction: "CENTER", message: "মুখ সোজা রাখুন", duration: 2000 },
    { direction: "LEFT", message: "ডানে ঘুরুন", duration: 2000 },
    { direction: "RIGHT", message: "বামে ঘুরুন", duration: 2000 },
    { direction: "CENTER", message: "আবার মুখ সোজা রাখুন", duration: 2000 },
  ];

  let currentStep = 0;
  let stepStartTime = Date.now();
  let stepConfirmedFrames = 0;
  const REQUIRED_FRAMES = 20; // Need 20 consecutive frames to confirm

  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      try {
        // Detect face
        const detection = await detectFace(videoElement);

        if (!detection) {
          onProgress?.({
            step: currentStep,
            message: "মুখ সনাক্ত করা যাচ্ছে না",
            direction: STEPS[currentStep].direction,
            progress: 0,
            error: true,
          });
          stepConfirmedFrames = 0;
          return;
        }

        // Calculate head pose
        const yawAngle = calculateHeadPose(detection.landmarks);
        const currentDirection = getFaceDirection(yawAngle);

        // Check if direction matches current step
        if (currentDirection === STEPS[currentStep].direction) {
          stepConfirmedFrames++;

          const progress = Math.min(
            (stepConfirmedFrames / REQUIRED_FRAMES) * 100,
            100
          );

          onProgress?.({
            step: currentStep,
            message: STEPS[currentStep].message,
            direction: currentDirection,
            progress,
            yawAngle: yawAngle.toFixed(1),
            error: false,
          });

          // Step completed
          if (stepConfirmedFrames >= REQUIRED_FRAMES) {
            stepConfirmedFrames = 0;
            currentStep++;

            // All steps completed
            if (currentStep >= STEPS.length) {
              clearInterval(checkInterval);

              // Capture final image
              const capturedImage = captureFrame(videoElement);

              resolve({
                success: true,
                image: capturedImage,
                file: dataURLtoFile(capturedImage),
                timestamp: new Date().toISOString(),
              });

              return;
            }

            // Move to next step
            onStepChange?.(currentStep, STEPS[currentStep]);
            stepStartTime = Date.now();
          }
        } else {
          // Wrong direction
          stepConfirmedFrames = Math.max(0, stepConfirmedFrames - 2);

          onProgress?.({
            step: currentStep,
            message: STEPS[currentStep].message,
            direction: currentDirection,
            progress: (stepConfirmedFrames / REQUIRED_FRAMES) * 100,
            yawAngle: yawAngle.toFixed(1),
            error: false,
          });
        }

        // Timeout check (30 seconds per step)
        if (Date.now() - stepStartTime > 30000) {
          clearInterval(checkInterval);
          reject(new Error("সময় শেষ। আবার চেষ্টা করুন।"));
        }
      } catch (error) {
        console.error("Detection error:", error);
        onProgress?.({
          step: currentStep,
          message: "সনাক্তকরণে ত্রুটি",
          error: true,
        });
      }
    }, 100); // Check every 100ms

    // Overall timeout (2 minutes)
    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error("যাচাইকরণ সময় শেষ।"));
    }, 120000);
  });
}

/**
 * Quick face detection check (without liveness)
 * Useful for initial validation
 */
export async function detectSingleFace(videoElement) {
  try {
    const detection = await detectFace(videoElement);

    if (detection) {
      return {
        detected: true,
        confidence: detection.detection.score,
        landmarks: detection.landmarks,
      };
    }

    return { detected: false };
  } catch (error) {
    console.error("Face detection error:", error);
    return { detected: false, error: error.message };
  }
}

/**
 * Initialize face detection system
 * Call this before using any face detection features
 */
export async function initializeFaceDetection(modelPath = "/models") {
  try {
    const loaded = await loadFaceModels(modelPath);
    return {
      success: loaded,
      message: loaded ? "Face detection ready" : "Failed to load models",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
