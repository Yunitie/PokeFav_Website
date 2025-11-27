/**
 * Validation simple d'email côté backend
 * - Vérifie que c'est une chaîne non vide
 * - Vérifie un format email basique (quelquechose@domaine.tld)
 */

function validateEmail(email) {
  if (typeof email !== "string" || email.trim() === "") {
    return {
      valid: false,
      error: "Email is required.",
    };
  }

  const trimmed = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Email address is not valid.",
    };
  }

  return { valid: true, value: trimmed.toLowerCase() };
}

module.exports = { validateEmail };
