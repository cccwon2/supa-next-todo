"use client";

import React from "react";
import { Nanum_Myeongjo, Caveat } from "next/font/google";
import "swagger-ui-react/swagger-ui.css";
import "@/styles/app.css";
import ClientWrapper from "./ClientWrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const nanumMyeongjoScript = Nanum_Myeongjo({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(session);
        if (!session) {
          router.push("/login");
        }
      } catch (error) {
        console.error("세션 확인 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
        setIsClient(true);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <html lang="ko">
        <body>
          <div>로딩 중...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body className={`${nanumMyeongjoScript.className}`}>
        {isClient && (
          <div className={caveat.className}>Next Supa Todo List</div>
        )}
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
