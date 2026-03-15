const TOKEN_STORAGE_KEY = "auth-token-v1";

interface StoredToken {
  token: string;
  expiresAt: number;
}

let accessToken: string | null = null;

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function persistAccessToken(token: string, expiresIn: number): void {
  setAccessToken(token);
  try {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      JSON.stringify({
        token,
        expiresAt: Date.now() + expiresIn * 1000,
      } satisfies StoredToken),
    );
  } catch {
    // storage unavailable or quota exceeded
  }
}

export function loadPersistedToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    const { token, expiresAt }: StoredToken = JSON.parse(raw);
    if (Date.now() >= expiresAt) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function clearPersistedToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // storage unavailable
  }
}
