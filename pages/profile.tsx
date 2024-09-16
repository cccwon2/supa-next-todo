import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">프로필</h1>
        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-gray-600">이메일</p>
            <p className="font-semibold">{session.user.email}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">사용자 ID</p>
            <p className="font-semibold">{session.user.id}</p>
          </div>
          {/* 필요한 경우 추가 프로필 정보를 여기에 넣으세요 */}
        </div>
      </div>
    </div>
  );
}
