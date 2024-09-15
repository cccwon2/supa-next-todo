"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_TODO } from "@/app/types/supabase";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms";

const TodoCreate: React.FC = () => {
  const [task, setTask] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [user] = useAtom(userAtom);

  const createTodo = async ({
    task,
    isComplete,
  }: {
    task: string;
    isComplete: boolean;
  }) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const { data, error } = await supabase.from(SUPABASE_TODO).insert([
      {
        user_id: user.id,
        task,
        is_complete: isComplete,
      },
    ]);

    if (error) {
      console.error("Todo 생성 중 오류 발생:", error);
      alert(`오류: ${error.message}`);
      return;
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) {
      alert("할 일을 입력해주세요.");
      return;
    }

    await createTodo({ task, isComplete });
    router.push("/todos");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-2xl font-bold mb-4">할 일 생성</h1>
      <div className="mb-4">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isComplete}
            onChange={(e) => setIsComplete(e.target.checked)}
            className="mr-2"
          />
          <span>완료됨</span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        생성
      </button>
    </form>
  );
};

export default TodoCreate;
