import { useState } from "react";
import { useRouter } from "next/navigation"; // App Router에서는 useRouter 대신 next/navigation에서 가져옴
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Login() {
  const supabase = useSupabaseClient();
  const router = useRouter(); // Router 사용
  const [email, setEmail] = useState(""); // email 상태
  const [password, setPassword] = useState(""); // password 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  // 이메일 로그인 함수
  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("로그인에 실패했습니다: " + error.message);
    } else {
      router.push("/"); // 로그인 성공 시 메인 페이지로 이동
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>

        {/* 이메일 입력 필드 */}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* 비밀번호 입력 필드 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* 로그인 버튼 */}
        <button
          onClick={signInWithEmail}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          로그인
        </button>

        {/* 에러 메시지 */}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}

        {/* 회원가입 링크 */}
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
