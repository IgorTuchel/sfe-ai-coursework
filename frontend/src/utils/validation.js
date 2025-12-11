/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if two passwords match
 * @param {string} password1 - First password
 * @param {string} password2 - Second password
 * @returns {boolean} - True if passwords match and not empty
 */
export function validatePasswordMatch(password1, password2) {
  return password1 === password2 && password1.length > 0;
}

/**
 * Validates minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if meets minimum length
 */
export function validateMinLength(value, minLength) {
  return value.length >= minLength;
}
