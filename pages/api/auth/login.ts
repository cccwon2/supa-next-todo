import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, provider } = req.body;
  const redirectUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`;

  // Supabase 클라이언트 생성
  const supabase = createPagesServerClient({ req, res });

  if (provider === "google" || provider === "github") {
    // Google 로그인 처리
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ url: data.url });
  } else {
    // 이메일/비밀번호 로그인 처리
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 로그인 성공 시 세션 반환
    return res
      .status(200)
      .json({ message: "Login successful", user: data.user });
  }
}
