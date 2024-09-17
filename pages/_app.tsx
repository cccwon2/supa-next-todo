import "@/styles/app.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions: {
        name: "sb:token",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        path: "/",
      },
    })
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
