// app/layout.tsx
import React from "react";
import "swagger-ui-react/swagger-ui.css";
import "@/styles/app.css";
import AuthWrapper from "@/components/AuthWrapper";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  // 서버에서 세션 복구
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="ko">
      <body>
        <AuthWrapper initialSession={session}>{children}</AuthWrapper>
      </body>
    </html>
  );
}
