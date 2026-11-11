import { createNeonAuth } from "@neon/auth/next/server";

type NeonAuth = ReturnType<typeof createNeonAuth>;

let instance: NeonAuth | null = null;

export function getAuth(): NeonAuth {
  if (!instance) {
    instance = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    });
  }
  return instance;
}

export const auth: NeonAuth = new Proxy({} as NeonAuth, {
  get(_target, prop) {
    return (getAuth() as any)[prop];
  },
});
