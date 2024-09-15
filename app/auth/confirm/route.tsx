import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // 사용자를 지정된 리다이렉트 URL 또는 앱의 루트로 리다이렉트
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // 사용자를 오류 페이지로 리다이렉트
  return NextResponse.redirect(new URL("/error", request.url));
}
