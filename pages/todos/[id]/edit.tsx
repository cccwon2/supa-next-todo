import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_TODO } from "@/constants/supabase";
import { Todo } from "../../../types";

const TodoEdit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // useMemo로 supabase 생성
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const getTodo = async (id: number) => {
      const { data, error } = await supabase
        .from(SUPABASE_TODO)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching todo:", error);
        throw error;
      }

      return data;
    };

    if (id) {
      getTodo(Number(id)).then((todoData) => {
        setTodo(todoData);
        setTitle(todoData.title);
        setDescription(todoData.description);
      });
    }
  }, [id, supabase]);

  const updateTodo = async (
    id: number,
    { title, description }: { title: string; description: string }
  ) => {
    const { data, error } = await supabase
      .from(SUPABASE_TODO)
      .update({ title, description })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
      throw error;
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateTodo(Number(id), { title, description });
      router.push(`/todos/${id}`);
    }
  };

  if (!todo) return <div>로딩 중...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Todo 수정</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명"
      />
      <button type="submit">수정</button>
    </form>
  );
};

export default TodoEdit;
