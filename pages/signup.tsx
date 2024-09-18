import { useState, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthError } from "@supabase/supabase-js";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

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
    if (password.length < 6) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }
    return true;
  };

  const signUpNewUser = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;

      router.push(
        "/login?message=회원가입이 완료되었습니다. 이메일을 확인해주세요."
      );
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage("회원가입에 실패했습니다: " + error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
        <form onSubmit={signUpNewUser}>
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
              className="w-full p-2 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signUpNewUser()}
              aria-label="비밀번호"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
            aria-label="회원가입"
          >
            {isLoading ? "처리 중..." : "회원가입"}
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

          <span>{isLoading ? "처리 중..." : "카카오로 로그인"}</span>
        </button>
        {errorMessage && (
          <p className="text-red-500 mt-4" role="alert">
            {errorMessage}
          </p>
        )}
        <p className="mt-4">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
