import React, { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_TODO } from "@/constants/supabase";

const TodoCreate: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const createTodo = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const { data, error } = await supabase.from(SUPABASE_TODO).insert([
      {
        title,
        description,
      },
    ]);

    if (error) {
      console.error("Error creating todo:", error);
      alert(`Error: ${error.message}`);
      return;
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    await createTodo({ title, description });
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Todo 생성</h1>
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
      <button type="submit">생성</button>
    </form>
  );
};

export default TodoCreate;
