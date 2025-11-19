// Client HTTP qui gère token, refresh et retry de façon centralisée
// Objectif:
// - Injecter automatiquement le Bearer token dans les requêtes sortantes
// - Sur réponse 401: tenter un refresh token puis rejouer la requête une fois
// - En cas d'échec du refresh: déclencher la déconnexion via onAuthFailed()
// - Exposer une API simple (get/post/put/delete/request)

import { API_BASE_URL } from "./config";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Dépendances injectées par le contexte d'authentification
// - getAccessToken: lit l'access token courant (si disponible)
// - refreshAccessToken: tente d'obtenir un nouvel access token via le cookie httpOnly
// - onAuthFailed: callback appelée quand le refresh échoue (logout + redirect)
// - baseURL: URL de base de l'API (optionnelle, par défaut localhost:3001)
export interface HttpClientDeps {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onAuthFailed: () => void; // logout + redirect
  baseURL?: string;
}

// Fabrique de client HTTP. On la paramètre avec les dépendances ci-dessus.
export function createHttpClient(deps: HttpClientDeps) {
  const baseURL = deps.baseURL ?? API_BASE_URL;

  // Méthode générique qui alimente toutes les autres (get/post/put/delete)
  // Elle gère:
  // 1) l'injection du token
  // 2) un cycle de retry unique après un refresh en cas de 401
  // 3) la normalisation des erreurs
  async function request<T = unknown>(
    path: string,
    options: RequestInit & { method?: HttpMethod } = {}
  ): Promise<T> {
    // doFetch encapsule l'exécution de la requête avec ou sans tentative de refresh
    const doFetch = async (withFreshToken: boolean) => {
      // Sélection du token: soit on tente un refresh (withFreshToken),
      // soit on lit simplement le token courant depuis le contexte
      const token = withFreshToken
        ? await deps.refreshAccessToken()
        : deps.getAccessToken();

      // Construction des headers: Content-Type par défaut + Authorization si token
      const headers = new Headers(options.headers ?? {});
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      if (token) headers.set("Authorization", `Bearer ${token}`);

      // Exécution de la requête; credentials: "include" pour envoyer les cookies httpOnly
      const res = await fetch(`${baseURL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });

      // Si 401 et qu'on n'a pas encore tenté de refresh, on tente un refresh puis on rejoue la requête
      if (res.status === 401 && !withFreshToken) {
        // premier 401 -> tente refresh et retry
        return doFetch(true);
      }

      // Gestion normalisée des erreurs non OK
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as Record<string, unknown>));
        const message =
          (data && typeof data.error === "string" && data.error) ||
          `HTTP ${res.status}: ${res.statusText}`;
        // Si 401 après refresh (ou 401 direct quand pas de refresh possible): onAuthFailed
        if (res.status === 401) {
          deps.onAuthFailed();
        }
        throw new Error(message);
      }

      // Réponse OK: on tente d'interpréter en JSON si présent, sinon texte
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return (await res.json()) as T;
      }
      return (await res.text()) as unknown as T;
    };

    // Premier passage: on essaie sans refresh; doFetch gèrera le retry si besoin
    return doFetch(false);
  }

  // API pratique basée sur request()
  return {
    get: <T = unknown>(p: string, o?: RequestInit) => request<T>(p, { ...o, method: "GET" }),
    post: <T = unknown>(p: string, b?: unknown, o?: RequestInit) =>
      request<T>(p, { ...o, method: "POST", body: b ? JSON.stringify(b) : undefined }),
    put: <T = unknown>(p: string, b?: unknown, o?: RequestInit) =>
      request<T>(p, { ...o, method: "PUT", body: b ? JSON.stringify(b) : undefined }),
    delete: <T = unknown>(p: string, o?: RequestInit) => request<T>(p, { ...o, method: "DELETE" }),
    request,
  };
}
