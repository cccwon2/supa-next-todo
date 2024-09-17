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

  const redirectUrl = `${window.location.origin}/auth/callback`;

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

  async function signInWithGoogle() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (!data.url) {
        throw new Error("로그인 URL을 받지 못했습니다.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Google 로그인 오류:", error);
      setErrorMessage(
        "Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요."
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
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 mt-4 disabled:opacity-50"
          aria-label="구글로 로그인"
        >
          {isLoading ? "처리 중..." : "구글로 로그인"}
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
