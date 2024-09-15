import { createBrowserClient } from "@supabase/ssr";

export const createClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get: (name: string) => {
        if (typeof window === "undefined") return null;
        try {
          const storedValue = sessionStorage.getItem(name); // sessionStorage에서 토큰 가져오기
          return storedValue ? JSON.parse(storedValue) : null;
        } catch (e) {
          console.error("Error reading from sessionStorage", e);
          return null;
        }
      },
      set: (name: string, value: string) => {
        if (typeof window === "undefined") return;
        try {
          sessionStorage.setItem(name, JSON.stringify(value)); // sessionStorage에 토큰 저장
        } catch (e) {
          console.error("Error setting sessionStorage", e);
        }
      },
      remove: (name: string) => {
        if (typeof window === "undefined") return;
        try {
          sessionStorage.removeItem(name); // sessionStorage에서 토큰 제거
        } catch (e) {
          console.error("Error removing from sessionStorage", e);
        }
      },
    },
    cookieOptions: {
      name: "sb-auth-token",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
      domain: "",
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }
);
