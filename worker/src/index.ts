interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
}

// Persists across requests within the same isolate instance
let cachedToken: { value: string; expiresAt: number } | null = null;

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getAccessToken(env: Env): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(
    new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })),
  );
  const payload = base64url(
    new TextEncoder().encode(
      JSON.stringify({
        iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      }),
    ),
  );

  const signingInput = `${header}.${payload}`;

  const pem = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const pemBody = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sigBytes = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  const jwt = `${signingInput}.${base64url(new Uint8Array(sigBytes))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: access_token,
    expiresAt: Date.now() + expires_in * 1000,
  };
  return cachedToken.value;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/file\/([a-zA-Z0-9_-]+)$/);
    if (!match) {
      return new Response("Not found", { status: 404, headers: CORS_HEADERS });
    }

    const fileId = match[1];

    try {
      const token = await getAccessToken(env);

      const upstreamHeaders: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      const range = request.headers.get("Range");
      if (range) upstreamHeaders.Range = range;

      const upstream = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: upstreamHeaders },
      );

      if (!upstream.ok) {
        return new Response(`Upstream error: ${upstream.status}`, {
          status: upstream.status,
          headers: CORS_HEADERS,
        });
      }

      const responseHeaders = new Headers(CORS_HEADERS);
      const contentType = upstream.headers.get("Content-Type");
      if (contentType) responseHeaders.set("Content-Type", contentType);
      const contentLength = upstream.headers.get("Content-Length");
      if (contentLength) responseHeaders.set("Content-Length", contentLength);

      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      });
    } catch (err) {
      console.error(err);
      return new Response("Internal error", {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
  },
} satisfies ExportedHandler<Env>;
