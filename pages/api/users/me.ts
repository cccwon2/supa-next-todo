import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Supabase 클라이언트 생성
  const supabase = createPagesServerClient({ req, res });

  // 현재 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
  }

  // 사용자 세션에서 이미 필요한 정보가 제공될 수 있습니다.
  console.log("사용자 정보: ", session.user);

  // 사용자 정보 반환
  res.status(200).json({ user: session.user });
}
