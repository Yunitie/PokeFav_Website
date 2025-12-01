/**
 * Petit helper pour gérer proprement les erreurs dans les handlers async Express.
 * Il garantit que toute erreur (throw / rejet de promesse) passe bien par
 * le middleware d'erreur global (index.js).
 */

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };


