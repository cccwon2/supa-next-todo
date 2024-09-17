import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      supabase.auth
        .exchangeCodeForSession(String(code))
        .then(({ data, error }) => {
          if (error) {
            console.error("Error exchanging code for session:", error);
            router.push("/login?error=AuthenticationFailed");
          } else {
            console.log("Successfully authenticated:", data);
            router.push("/"); // 인증 성공 후 홈페이지로 리다이렉트
          }
        });
    }
  }, [router, supabase]);

  return <div>인증 처리 중...</div>; // 로딩 상태를 표시할 수 있습니다
}
