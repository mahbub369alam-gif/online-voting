/**
 * Phone number utility functions
 */

/**
 * Mask phone number showing only first 3 and last 3 digits
 * @param {string} phone - The phone number to mask
 * @returns {string} - Masked phone number
 */
export function maskPhoneNumber(phone) {
  if (!phone || phone.length < 6) return phone;
  const first3 = phone.substring(0, 3);
  const last3 = phone.substring(phone.length - 3);
  const middle = "*".repeat(phone.length - 6);
  return `${first3}${middle}${last3}`;
}

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export function isValidPhoneNumber(phone) {
  if (!phone) return false;

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it's a valid length (adjust based on your country's format)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Format phone number for display
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Format based on length (adjust based on your country's format)
  if (cleanPhone.length === 11) {
    // Format: 01X-XXXX-XXXX (Bangladesh format)
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(
      3,
      7
    )}-${cleanPhone.slice(7)}`;
  }

  return cleanPhone;
}

/**
 * Clean phone number (remove all non-digit characters)
 * @param {string} phone - The phone number to clean
 * @returns {string} - Clean phone number with only digits
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}
