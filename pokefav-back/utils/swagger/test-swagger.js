const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./utils/swagger/swagger");

const app = express();

// Configuration Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PokeFav API Documentation",
  })
);

// Route de test simple
app.get("/", (req, res) => {
  res.json({
    message: "PokeFav API avec Swagger",
    documentation: "/api-docs",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `🚀 Serveur de test Swagger démarré sur http://localhost:${PORT}`
  );
  console.log(
    `📚 Documentation disponible sur http://localhost:${PORT}/api-docs`
  );
  console.log(`🏠 Page d'accueil sur http://localhost:${PORT}`);
});

module.exports = app;
