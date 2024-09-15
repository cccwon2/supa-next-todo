"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { todoAtom } from "@/atoms";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { SUPABASE_TODO } from "@/app/types/supabase";

const TodoDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [todo, setTodo] = useAtom(todoAtom);
  const supabase = createClient();

  useEffect(() => {
    if (id) {
      const getTodo = async (todoId: number) => {
        const { data, error } = await supabase
          .from(SUPABASE_TODO)
          .select("*")
          .eq("id", todoId)
          .single();

        if (error) {
          console.error("Todo 가져오기 오류:", error);
        } else {
          setTodo(data);
        }
      };

      getTodo(Number(id));
    }
  }, [id, supabase, setTodo]);

  const handleDelete = async () => {
    if (id) {
      const { error } = await supabase
        .from(SUPABASE_TODO)
        .delete()
        .eq("id", Number(id));

      if (error) {
        console.error("Error deleting todo:", error);
      } else {
        setTodo(null); // atom 상태 초기화
        router.push("/");
      }
    }
  };

  if (!todo) return <div>로딩 중...</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{todo.task}</h1>
      <p className="mb-4">
        완료 여부:
        <span className={todo.is_complete ? "text-green-600" : "text-red-600"}>
          {todo.is_complete ? "완료" : "미완료"}
        </span>
      </p>
      <div className="flex justify-between">
        <Link
          href={`/todos/${todo.id}/edit`}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          수정하기
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default TodoDetail;
