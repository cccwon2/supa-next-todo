"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom, todoListAtom } from "@/atoms";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_TODO } from "@/app/types/supabase";
import Link from "next/link";

const TodoList: React.FC = () => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [todos, setTodos] = useAtom(todoListAtom);
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      const fetchTodos = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from(SUPABASE_TODO)
          .select("*")
          .eq("user_id", user.id)
          .order("inserted_at", { ascending: false });

        if (error) {
          console.error("Todo 목록 가져오기 오류:", error);
        } else {
          setTodos(data || []);
        }
        setLoading(false);
      };

      fetchTodos();
    }
  }, [user, router, supabase, setTodos]);

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
