// app/login/page.tsx
"use client";

import React from "react";
import { login, signup } from "./actions";

// 동적 렌더링을 강제하여 정적 생성을 방지
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="w-full max-w-xs" action={login}>
        <h1 className="text-2xl mb-4">로그인/회원가입</h1>
        <label htmlFor="email" className="block mb-2">
          이메일:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <label htmlFor="password" className="block mb-2">
          비밀번호:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button className="w-full p-2 mb-2 bg-blue-500 text-white rounded">
          로그인
        </button>
        <button
          formAction={signup}
          className="w-full p-2 bg-green-500 text-white rounded"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
