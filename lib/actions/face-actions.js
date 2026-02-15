"use server";

import prisma from "@/lib/prisma";

// Face++ API credentials
const api_key = process.env.FACE_API_KEY;
const api_secret = process.env.FACE_API_SECRET;
const endpoint = "https://api-us.faceplusplus.com/facepp/v3/compare";

/**
 * Compare two faces using Face++ API
 * @param {string} voterId - The voter's unique ID
 * @param {FormData} formData - FormData containing image_file1 and image_file2
 * @returns {Promise<{success: boolean, confidence?: number, error?: string}>}
 */
export async function compareFaces(voterId, capturedImage) {
  try {
    // Get voter data to verify they exist
    const voter = await prisma.voter.findUnique({
      where: { voterId: voterId },
      select: {
        id: true,
        name: true,
        faceToken: true,
        imageUrl: true,
      },
    });

    if (!voter) {
      return {
        success: false,
        error: "Voter not found",
      };
    }

    // Check if both images are provided
    if (!capturedImage) {
      return {
        success: false,
        error: "Both images are required for comparison",
      };
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(capturedImage.type)) {
      return {
        success: false,
        error: "Only JPEG and PNG images are allowed",
      };
    }

    // Validate file sizes (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (capturedImage.size > maxSize) {
      return {
        success: false,
        error: "Image size must be less than 2MB",
      };
    }

    // convert image url to image file
    const imageFileFetch = await fetch(voter.imageUrl);
    const imageBlob = await imageFileFetch.blob();
    const imageFile = new File([imageBlob], "voter-image.jpg", {
      type: "image/jpeg",
    });

    // Create new FormData for API call
    const apiFormData = new FormData();
    apiFormData.append("api_key", api_key);
    apiFormData.append("api_secret", api_secret);
    apiFormData.append("image_file1", imageFile);
    apiFormData.append("image_file2", capturedImage);

    // Make API call to Face++
    const response = await fetch(endpoint, {
      method: "POST",
      body: apiFormData,
    });

    const data = await response.json();

    console.log("Face API response: ", data);

    if (!response.ok) {
      throw new Error(`Face++ API error: ${response.status}`);
    }

    // Check if comparison was successful
    if (data.error_message) {
      return {
        success: false,
        error: `Face comparison failed: ${data.error_message}`,
      };
    }

    // Check confidence threshold (you can adjust this)
    const confidenceThreshold = 70; // 70% confidence
    const confidence = data.confidence || 0;

    if (confidence < confidenceThreshold) {
      return {
        success: false,
        confidence,
        error: `Face is not matching. Please try again!`,
      };
    }

    return {
      success: true,
      confidence,
      message: `Faces matched with ${confidence}% confidence`,
      data: data,
    };
  } catch (error) {
    console.error("Face comparison error:", error);
    return {
      success: false,
      error: error.message || "Failed to compare faces",
    };
  }
}

/**
 * Detect face in a single image using Face++ API
 * @param {string} voterId - The voter's unique ID
 * @param {FormData} formData - FormData containing image_file
 * @returns {Promise<{success: boolean, faceToken?: string, error?: string}>}
 */
export async function detectFace(voterId, formData) {
  try {
    // Get voter data
    const voter = await prisma.voter.findUnique({
      where: { voterId: voterId },
      select: {
        id: true,
        name: true,
        faceToken: true,
      },
    });

    if (!voter) {
      return {
        success: false,
        error: "Voter not found",
      };
    }

    const imageFile = formData.get("image_file");

    if (!imageFile) {
      return {
        success: false,
        error: "Image file is required",
      };
    }

    // Validate file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(imageFile.type)) {
      return {
        success: false,
        error: "Only JPEG and PNG images are allowed",
      };
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (imageFile.size > maxSize) {
      return {
        success: false,
        error: "Image size must be less than 2MB",
      };
    }

    // Face++ Detect API
    const api_key = "WGNq-_FzkyfRpQd5kOwHPD76x8KFXgwr";
    const api_secret = "-IpogXymHgC9UWW5VGwTV5NzOJAjLZxU";
    const endpoint = "https://api-us.faceplusplus.com/facepp/v3/detect";

    const detectFormData = new FormData();
    detectFormData.append("api_key", api_key);
    detectFormData.append("api_secret", api_secret);
    detectFormData.append("image_file", imageFile);
    detectFormData.append("return_landmark", "0");
    detectFormData.append("return_attributes", "none");

    const response = await fetch(endpoint, {
      method: "POST",
      body: detectFormData,
    });

    if (!response.ok) {
      throw new Error(`Face++ API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error_message) {
      return {
        success: false,
        error: `Face detection failed: ${data.error_message}`,
      };
    }

    if (!data.faces || data.faces.length === 0) {
      return {
        success: false,
        error: "No face detected in the image",
      };
    }

    if (data.faces.length > 1) {
      return {
        success: false,
        error:
          "Multiple faces detected. Please use an image with only one face.",
      };
    }

    const faceToken = data.faces[0].face_token;

    // Update voter's faceToken
    await prisma.voter.update({
      where: { id: voter.id },
      data: {
        faceToken: faceToken,
      },
    });

    return {
      success: true,
      faceToken,
      message: "Face detected and stored successfully",
      data: data,
    };
  } catch (error) {
    console.error("Face detection error:", error);
    return {
      success: false,
      error: error.message || "Failed to detect face",
    };
  }
}
