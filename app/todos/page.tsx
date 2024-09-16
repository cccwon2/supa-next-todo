"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { todoListAtom } from "@/atoms";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const TodoList: React.FC = () => {
  const router = useRouter();
  const [todos, setTodos] = useAtom(todoListAtom);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(
    async (userId: string) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Todo 목록을 가져오는 중 오류 발생:", error);
      } else {
        setTodos(data || []);
      }
      setLoading(false);
    },
    [setTodos]
  );

  useEffect(() => {
    const supabase = createClient();

    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        fetchTodos(session.user.id);
      } else {
        setLoading(false);
        router.push("/login");
      }
    };

    checkUserSession();
  }, [fetchTodos, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todo 리스트</h1>
      <Link
        href="/todos/create"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        새 Todo 추가
      </Link>
      {loading ? (
        <p className="text-gray-600">로딩 중...</p>
      ) : (
        <ul className="space-y-2">
          {todos?.map((todo) => (
            <li key={todo.id} className="bg-white shadow rounded-lg p-4">
              <Link
                href={`/todos/${todo.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {todo.task}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
