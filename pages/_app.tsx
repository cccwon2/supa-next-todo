import "@/styles/app.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState<SupabaseClient>(() =>
    createPagesBrowserClient({
      cookieOptions: {
        name: "sb:token",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXT_PUBLIC_DOMAIN,
        path: "/",
      },
    })
  );

  return (
    <ErrorBoundary>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </ErrorBoundary>
  );
}
