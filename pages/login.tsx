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
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
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
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="24px"
            height="24px"
            viewBox="0 0 24 23"
            version="1.1"
          >
            <g id="surface1">
              <path
                className="fill-[#FEE500]"
                d="M 24 21.203125 C 24 22.195312 23.160156 23 22.125 23 L 1.875 23 C 0.839844 23 0 22.195312 0 21.203125 L 0 1.796875 C 0 0.804688 0.839844 0 1.875 0 L 22.125 0 C 23.160156 0 24 0.804688 24 1.796875 Z M 24 21.203125 "
              />
              <path
                className="fill-[#3C1E1E]"
                d="M 12 3.234375 C 6.613281 3.234375 2.25 6.53125 2.25 10.601562 C 2.25 13.230469 4.074219 15.539062 6.820312 16.84375 C 6.671875 17.335938 5.859375 20.019531 5.828125 20.230469 C 5.828125 20.230469 5.808594 20.386719 5.914062 20.449219 C 6.023438 20.507812 6.148438 20.460938 6.148438 20.460938 C 6.457031 20.421875 9.707031 18.234375 10.269531 17.851562 C 10.832031 17.929688 11.410156 17.96875 12 17.96875 C 17.386719 17.96875 21.75 14.671875 21.75 10.601562 C 21.75 6.53125 17.386719 3.234375 12 3.234375 Z M 12 3.234375 "
              />
              <path
                className="fill-[#FEE500]"
                d="M 6.609375 13.171875 C 6.300781 13.171875 6.046875 12.941406 6.046875 12.660156 L 6.046875 9.457031 L 5.167969 9.457031 C 4.863281 9.457031 4.617188 9.21875 4.617188 8.929688 C 4.617188 8.636719 4.863281 8.398438 5.167969 8.398438 L 8.050781 8.398438 C 8.355469 8.398438 8.601562 8.636719 8.601562 8.929688 C 8.601562 9.21875 8.355469 9.457031 8.050781 9.457031 L 7.171875 9.457031 L 7.171875 12.660156 C 7.171875 12.941406 6.917969 13.171875 6.609375 13.171875 Z M 11.542969 13.167969 C 11.308594 13.167969 11.128906 13.074219 11.074219 12.929688 L 10.796875 12.230469 L 9.078125 12.230469 L 8.800781 12.929688 C 8.746094 13.074219 8.566406 13.167969 8.332031 13.167969 C 8.210938 13.167969 8.089844 13.140625 7.976562 13.09375 C 7.820312 13.023438 7.671875 12.835938 7.84375 12.328125 L 9.1875 8.933594 C 9.28125 8.675781 9.570312 8.410156 9.9375 8.402344 C 10.304688 8.410156 10.59375 8.675781 10.6875 8.933594 L 12.03125 12.324219 C 12.203125 12.835938 12.054688 13.023438 11.898438 13.09375 C 11.785156 13.140625 11.664062 13.167969 11.542969 13.167969 Z M 10.5 11.273438 L 9.9375 9.746094 L 9.375 11.273438 Z M 12.9375 13.09375 C 12.640625 13.09375 12.398438 12.871094 12.398438 12.601562 L 12.398438 8.9375 C 12.398438 8.640625 12.65625 8.398438 12.972656 8.398438 C 13.289062 8.398438 13.546875 8.640625 13.546875 8.9375 L 13.546875 12.105469 L 14.742188 12.105469 C 15.039062 12.105469 15.28125 12.328125 15.28125 12.601562 C 15.28125 12.871094 15.039062 13.09375 14.742188 13.09375 Z M 16.0625 13.167969 C 15.753906 13.167969 15.5 12.925781 15.5 12.628906 L 15.5 8.9375 C 15.5 8.640625 15.753906 8.398438 16.0625 8.398438 C 16.371094 8.398438 16.625 8.640625 16.625 8.9375 L 16.625 10.097656 L 18.195312 8.59375 C 18.273438 8.515625 18.386719 8.472656 18.507812 8.472656 C 18.648438 8.472656 18.789062 8.53125 18.894531 8.632812 C 18.992188 8.726562 19.050781 8.847656 19.058594 8.976562 C 19.066406 9.101562 19.023438 9.21875 18.933594 9.304688 L 17.652344 10.53125 L 19.039062 12.289062 C 19.128906 12.402344 19.167969 12.546875 19.144531 12.6875 C 19.125 12.832031 19.046875 12.957031 18.925781 13.042969 C 18.828125 13.113281 18.710938 13.152344 18.589844 13.152344 C 18.414062 13.152344 18.246094 13.074219 18.140625 12.9375 L 16.820312 11.265625 L 16.625 11.449219 L 16.625 12.628906 C 16.625 12.925781 16.375 13.164062 16.0625 13.167969 Z M 16.0625 13.167969 "
              />
            </g>
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
