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

  async function signInWithOAuth(provider: "google" | "github") {
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
          className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 mt-4 disabled:opacity-50"
          aria-label="구글로 로그인"
        >
          {isLoading ? "처리 중..." : "구글로 로그인"}
        </button>
        <button
          onClick={() => signInWithOAuth("github")}
          disabled={isLoading}
          className="w-full bg-gray-800 text-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-700 mt-4 disabled:opacity-50"
          aria-label="GitHub로 로그인"
        >
          {isLoading ? "처리 중..." : "GitHub로 로그인"}
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
