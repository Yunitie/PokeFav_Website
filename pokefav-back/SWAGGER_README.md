# Documentation Swagger - PokeFav API

## Vue d'ensemble

Ce projet utilise Swagger pour documenter l'API REST. Swagger fournit une interface interactive pour tester et explorer les endpoints de l'API.

## Installation

Les dépendances Swagger sont déjà installées dans le projet :

```bash
npm install swagger-jsdoc swagger-ui-express
```

## Accès à la documentation

Une fois le serveur démarré, vous pouvez accéder à la documentation Swagger à l'adresse :

```
http://localhost:3001/api-docs
```

## Structure de la documentation

### Configuration

Le fichier `swagger.js` contient la configuration principale de Swagger :

- **Informations de base** : Titre, version, description de l'API
- **Serveurs** : URLs des environnements (développement, production)
- **Schémas** : Définitions des modèles de données (User, LoginRequest, etc.)
- **Sécurité** : Configuration de l'authentification JWT

### Endpoints documentés

#### Authentification (`/api/auth/*`)

- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/forgot-password` - Demande de réinitialisation de mot de passe
- `POST /api/auth/reset-password` - Réinitialisation de mot de passe
- `POST /api/auth/refresh` - Rafraîchissement du token d'accès
- `POST /api/auth/logout` - Déconnexion

#### Utilisateurs (`/api/users`)

- `GET /api/users` - Récupération de tous les utilisateurs

#### Profil (`/api/profile`)

- `GET /api/profile` - Récupération du profil utilisateur connecté

## Utilisation de l'interface Swagger

1. **Navigation** : Utilisez les onglets pour naviguer entre les différentes sections
2. **Test des endpoints** : Cliquez sur un endpoint pour l'étendre et voir les détails
3. **Authentification** : Cliquez sur le bouton "Authorize" en haut pour configurer votre token JWT
4. **Test des requêtes** : Utilisez le bouton "Try it out" pour tester les endpoints directement
5. **Exemples** : Les schémas incluent des exemples de données pour faciliter les tests

## Authentification

Pour tester les endpoints protégés :

1. Connectez-vous via `/api/auth/login`
2. Copiez le `accessToken` de la réponse
3. Cliquez sur "Authorize" dans l'interface Swagger
4. Entrez `Bearer <votre_token>` dans le champ
5. Cliquez sur "Authorize"

## Ajout de nouveaux endpoints

Pour documenter un nouvel endpoint, ajoutez un commentaire JSDoc au-dessus de la route :

```javascript
/**
 * @swagger
 * /api/nouvelle-route:
 *   get:
 *     summary: Description courte
 *     description: Description détaillée
 *     tags: [Nom du groupe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NomDuSchema'
 */
```

## Schémas disponibles

- `User` - Modèle utilisateur
- `LoginRequest` - Données de connexion
- `RegisterRequest` - Données d'inscription
- `ForgotPasswordRequest` - Demande de réinitialisation
- `ResetPasswordRequest` - Réinitialisation de mot de passe
- `AuthResponse` - Réponse d'authentification
- `Error` - Modèle d'erreur

## Personnalisation

Vous pouvez personnaliser l'apparence de l'interface Swagger en modifiant les options dans `index.js` :

```javascript
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PokeFav API Documentation",
  })
);
```

## Export de la documentation

La documentation peut être exportée au format JSON ou YAML pour une utilisation externe :

```javascript
// Dans swagger.js
console.log(JSON.stringify(specs, null, 2));
```
