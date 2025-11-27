/**
 * Validation de mot de passe côté backend
 * Règles:
 * - Au moins 8 caractères
 * - Au moins une lettre minuscule
 * - Au moins une lettre majuscule
 * - Au moins un chiffre
 */

function validatePassword(password) {
  if (typeof password !== "string") {
    return {
      valid: false,
      error: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must contain at least 8 characters.",
    };
  }

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  if (!hasLowercase || !hasUppercase || !hasDigit) {
    return {
      valid: false,
      error:
        "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
    };
  }

  return { valid: true };
}

module.exports = { validatePassword };
