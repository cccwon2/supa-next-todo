import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  const formatExpiresAt = (expiresAt: number) => {
    const date = new Date(expiresAt * 1000);
    return date
      .toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(".", "");
  };

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
            <p className="text-gray-600">사용자 Role</p>
            <p className="font-semibold">{session.user.role}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">인증 수단</p>
            <p className="font-semibold">
              {session.user.app_metadata.provider}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">토큰 만료 시간</p>
            <p className="font-semibold">
              {formatExpiresAt(session.expires_at ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
