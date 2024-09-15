"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { todoAtom } from "@/atoms";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_TODO } from "@/app/types/supabase";

const EditTodo: React.FC = () => {
  const router = useRouter();
  const [todo, setTodo] = useAtom(todoAtom);
  const [task, setTask] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (todo) {
      setTask(todo.task);
      setIsComplete(todo.is_complete);
    } else {
      const fetchTodo = async () => {
        const id = window.location.pathname.split("/").pop();
        const { data, error } = await supabase
          .from(SUPABASE_TODO)
          .select("*")
          .eq("id", Number(id))
          .single();

        if (error) {
          console.error("Todo 가져오기 오류:", error);
        } else {
          setTodo(data);
          setTask(data.task);
          setIsComplete(data.is_complete);
        }
      };

      fetchTodo();
    }
  }, [todo, setTodo, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    const { error } = await supabase
      .from(SUPABASE_TODO)
      .update({ task, is_complete: isComplete })
      .eq("id", todo.id);

    if (error) {
      console.error("Todo 수정 오류:", error);
    } else {
      router.push(`/todos/${todo.id}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Todo 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="할 일"
            required
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
          수정
        </button>
      </form>
    </div>
  );
};

export default EditTodo;
