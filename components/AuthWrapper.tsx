// components/AuthWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Session } from "@supabase/supabase-js";

export default function AuthWrapper({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 세션 확인 후 리디렉션
    const checkSession = async () => {
      if (!initialSession && pathname !== "/login") {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    };

    checkSession();

    // 세션 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event) => {
      if (_event === "SIGNED_IN") {
        setIsLoading(false);
      } else if (_event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    // 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, initialSession, supabase.auth]);

  // 로그인 페이지가 아닌 곳에서 로딩 중일 때
  if (isLoading && pathname !== "/login") {
    return <div>로딩 중...</div>;
  }

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
