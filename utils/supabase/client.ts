import { createBrowserClient } from "@supabase/ssr";
import { getCookie, setCookie } from "cookies-next";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          return getCookie(name);
        },
        set: (name, value, options) => {
          setCookie(name, value, options);
        },
        remove: (name, options) => {
          setCookie(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}
