import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (code) {
    const supabase = createPagesServerClient({ req, res });
    try {
      await supabase.auth.exchangeCodeForSession(String(code));
      return res.redirect("/");
    } catch (error) {
      console.error("Error exchanging code for session:", error);
      return res.redirect("/login?error=AuthenticationFailed");
    }
  }

  return res.status(400).json({ error: "No code provided" });
}
