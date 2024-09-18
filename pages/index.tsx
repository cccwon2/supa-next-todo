import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import TodoList from "@/components/TodoList";
import Link from "next/link";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter(); // Router 가져오기

  // 세션 확인 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };

    checkSession();
  }, [supabase.auth, router]);

  return (
    <>
      <Head>
        <title>Supa Next Todo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full bg-200">
        {session ? (
          // 로그인이 되어있을 경우 Todo 리스트와 프로필 보기, 로그아웃 버튼 표시
          <div
            className="w-full h-full flex flex-col justify-center items-center p-4"
            style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
          >
            <TodoList session={session} />
            <Link href="/profile" className="btn-black w-full mt-4">
              프로필 보기
            </Link>
            <button
              className="btn-black w-full mt-4"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) console.log("Error logging out:", error.message);
                router.push("/login");
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          // 세션이 없을 때 (잠깐 보여줄 로딩 메시지 등)
          <p>로딩 중...</p>
        )}
      </div>
    </>
  );
}
