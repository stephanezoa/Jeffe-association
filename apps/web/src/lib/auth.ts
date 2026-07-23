import axios from 'axios';

const TOKEN_KEY = 'vestige.accessToken';

/** Positionne (ou retire) l'en-tête `Authorization` sur toutes les requêtes axios. */
export function applyAuthHeader(token: string | null): void {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

/**
 * `remember` choisit la persistance : `localStorage` survit à la fermeture du
 * navigateur, `sessionStorage` s'efface avec l'onglet.
 */
export function saveSession(token: string, remember: boolean): void {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  applyAuthHeader(token);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  applyAuthHeader(null);
}

/** À appeler au démarrage pour réarmer l'en-tête depuis le jeton stocké. */
export function restoreSession(): void {
  applyAuthHeader(getStoredToken());
}
