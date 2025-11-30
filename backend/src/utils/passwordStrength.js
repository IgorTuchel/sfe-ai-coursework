export function evaulatePassword(password) {
  if (password.length < 8) {
    return {
      valid: false,
      reason: "Password must be at least 8 characters long.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one lowercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one digit.",
    };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one special character.",
    };
  }
  return { valid: true, reason: "Password meets the criteria." };
}
