"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // Supabase 객체가 올바르게 생성되었는지 확인
  if (!supabase || !supabase.auth) {
    console.error("Supabase 클라이언트 초기화 실패");
    redirect("/error");
  }

  // 입력 값 가져오기 및 검증
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    console.error("이메일 또는 비밀번호가 누락되었습니다.");
    redirect("/error");
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("로그인 오류:", error.message);
      redirect("/error");
    }

    // 로그인 성공 후 경로를 갱신하고 todos 페이지로 리디렉션
    revalidatePath("/");
    redirect("/todos");
  } catch (error) {
    console.error("예상치 못한 오류:", error);
    redirect("/error");
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Supabase 객체가 올바르게 생성되었는지 확인
  if (!supabase || !supabase.auth) {
    console.error("Supabase 클라이언트 초기화 실패");
    redirect("/error");
  }

  // 입력 값 가져오기 및 검증
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    console.error("이메일 또는 비밀번호가 누락되었습니다.");
    redirect("/error");
  }

  try {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("회원가입 오류:", error.message);
      redirect("/error");
    }

    // 회원가입 성공 후 경로를 갱신하고 todos 페이지로 리디렉션
    revalidatePath("/");
    redirect("/todos");
  } catch (error) {
    console.error("예상치 못한 오류:", error);
    redirect("/error");
  }
}
