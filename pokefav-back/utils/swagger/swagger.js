const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PokeFav API",
      version: "1.0.0",
      description:
        "API pour l'application PokeFav - Gestion des favoris Pokémon",
      contact: {
        name: "Support PokeFav",
        email: "support@pokefav.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID unique de l'utilisateur",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
            displayName: {
              type: "string",
              description: "Nom d'affichage de l'utilisateur",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création du compte",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
            password: {
              type: "string",
              description: "Mot de passe de l'utilisateur",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "displayName"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
            password: {
              type: "string",
              description: "Mot de passe de l'utilisateur",
            },
            displayName: {
              type: "string",
              description: "Nom d'affichage de l'utilisateur",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: {
              type: "string",
              description: "Token de réinitialisation",
            },
            newPassword: {
              type: "string",
              description: "Nouveau mot de passe",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "Token d'accès JWT",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Message d'erreur",
            },
          },
        },
      },
    },
  },
  apis: ["./api/**/*.js", "./index.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
