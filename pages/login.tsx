import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { AuthError } from "@supabase/supabase-js";

export default function Login() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL;

  const validateForm = (): boolean => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return false;
    }
    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return false;
    }
    return true;
  };

  async function signInWithEmail(e?: FormEvent) {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/");
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage("로그인에 실패했습니다: " + error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithOAuth(provider: "google" | "github" | "kakao") {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      setErrorMessage(
        `${provider} 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          console.log("로그인된 사용자:", user);
          router.push("/");
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
        <form onSubmit={signInWithEmail}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              aria-label="이메일 주소"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signInWithEmail()}
              className="w-full p-2 border rounded"
              aria-label="비밀번호"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            aria-label="이메일로 로그인"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <button
          onClick={() => signInWithOAuth("google")}
          disabled={isLoading}
          className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 mt-4 disabled:opacity-50 flex items-center justify-center"
          aria-label="구글로 로그인"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>{isLoading ? "처리 중..." : "구글로 로그인"}</span>
        </button>
        <button
          onClick={() => signInWithOAuth("github")}
          disabled={isLoading}
          className="w-full bg-gray-800 text-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-700 mt-4 disabled:opacity-50 flex items-center justify-center"
          aria-label="GitHub로 로그인"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFE812"
              d="M24 22.12c0 .985-.8 1.785-1.785 1.785H1.785A1.785 1.785 0 010 22.12V1.785C0 .8.8 0 1.785 0h20.43C23.2 0 24 .8 24 1.785v20.43z"
            />
            <path d="M12 3.375C6.601 3.375 2.25 6.807 2.25 11c0 2.731 1.815 5.124 4.543 6.466-.149.511-.96 3.288-.993 3.51 0 0-.019.164.083.227s.217.014.217.014c.287-.04 3.324-2.18 3.843-2.55.524.075 1.065.114 1.617.114 5.399 0 9.75-3.432 9.75-7.625 0-4.194-4.351-7.625-9.75-7.625z" />
          </svg>

          <span>{isLoading ? "처리 중..." : "GitHub로 로그인"}</span>
        </button>
        <button
          onClick={() => signInWithOAuth("kakao")}
          disabled={isLoading}
          className="w-full bg-yellow-300 text-gray-800 border border-gray-300 py-2 px-4 rounded hover:bg-yellow-400 mt-4 disabled:opacity-50 flex items-center justify-center"
          aria-label="카카오로 로그인"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3C6.477 3 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zM12 4.75c4.136 0 7.5 3.364 7.5 7.5 0 4.136-3.364 7.5-7.5 7.5-4.136 0-7.5-3.364-7.5-7.5 0-4.136 3.364-7.5 7.5-7.5zm-1.534 3.384v4.716l-2.889-1.479.005 2.025 2.884 1.479 2.884-1.479.005-2.025-2.889 1.479V8.134h-2z"
              fill="currentColor"
            />
          </svg>
          <span>{isLoading ? "처리 중..." : "카카오로 로그인"}</span>
        </button>
        {errorMessage && (
          <p className="mt-4 text-red-500" role="alert">
            {errorMessage}
          </p>
        )}
        <p className="mt-4">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
