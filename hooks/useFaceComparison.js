"use client";

import { compareFaces, detectFace } from "@/lib/actions/face-actions";
import { useState, useRef } from "react";
import { toast } from "sonner";

/**
 * Custom hook for face comparison and verification process
 */
export function useFaceComparison(voterId) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image1Preview, setImage1Preview] = useState(null);
  const [image2Preview, setImage2Preview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [comparisonMode, setComparisonMode] = useState("compare"); // "compare" or "detect"

  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  /**
   * Handle file selection for first image
   */
  const handleImage1Select = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage1(file);
      setImage1Preview(URL.createObjectURL(file));
      setError(null);
    }
  };

  /**
   * Handle file selection for second image
   */
  const handleImage2Select = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage2(file);
      setImage2Preview(URL.createObjectURL(file));
      setError(null);
    }
  };

  /**
   * Clear first image
   */
  const clearImage1 = () => {
    setImage1(null);
    setImage1Preview(null);
    if (fileInput1Ref.current) {
      fileInput1Ref.current.value = "";
    }
  };

  /**
   * Clear second image
   */
  const clearImage2 = () => {
    setImage2(null);
    setImage2Preview(null);
    if (fileInput2Ref.current) {
      fileInput2Ref.current.value = "";
    }
  };

  /**
   * Clear all images
   */
  const clearAllImages = () => {
    clearImage1();
    clearImage2();
    setResult(null);
    setIsVerified(false);
    setConfidence(0);
    setError(null);
  };

  /**
   * Compare two faces using Face++ API
   */
  const handleCompareFaces = async () => {
    if (!image1 || !image2) {
      setError("দুইটা ছবি সিলেক্ট করো আগে!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image_file1", image1);
      formData.append("image_file2", image2);

      const comparisonResult = await compareFaces(voterId, formData);

      if (comparisonResult.success) {
        setResult(comparisonResult);
        setConfidence(comparisonResult.confidence);
        setIsVerified(true);
        toast.success(`Face matched with ${comparisonResult.confidence}% confidence!`);
      } else {
        setError(comparisonResult.error);
        toast.error(comparisonResult.error);
      }
    } catch (error) {
      console.error("Face comparison failed:", error);
      setError("Face comparison failed!");
      toast.error("Face comparison failed!");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Detect face in a single image using Face++ API
   */
  const handleDetectFace = async () => {
    if (!image1) {
      setError("একটা ছবি সিলেক্ট করো আগে!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image_file", image1);

      const detectResult = await detectFace(voterId, formData);

      if (detectResult.success) {
        setResult(detectResult);
        toast.success("Face detected successfully!");
      } else {
        setError(detectResult.error);
        toast.error(detectResult.error);
      }
    } catch (error) {
      console.error("Face detection failed:", error);
      setError("Face detection failed!");
      toast.error("Face detection failed!");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset verification status
   */
  const resetVerification = () => {
    setIsVerified(false);
    setResult(null);
    setConfidence(0);
    setError(null);
  };

  /**
   * Switch between comparison and detection modes
   */
  const switchMode = (mode) => {
    setComparisonMode(mode);
    clearAllImages();
    resetVerification();
  };

  return {
    // State
    image1,
    image2,
    image1Preview,
    image2Preview,
    isLoading,
    isVerified,
    result,
    error,
    confidence,
    comparisonMode,

    // Refs
    fileInput1Ref,
    fileInput2Ref,

    // Actions
    handleImage1Select,
    handleImage2Select,
    clearImage1,
    clearImage2,
    clearAllImages,
    handleCompareFaces,
    handleDetectFace,
    resetVerification,
    switchMode,
    setError,
  };
}
