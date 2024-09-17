// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Supabase 클라이언트 생성
  const supabase = createPagesServerClient({ req, res });

  // Supabase를 사용해 로그인 시도
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 로그인 성공 시 세션 반환
  return res.status(200).json({ message: "Login successful", user: data.user });
}
