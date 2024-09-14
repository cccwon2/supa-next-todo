import React, { useState } from "react";
import { createTodo } from "../../api/axios-todos";
import { useRouter } from "next/router";

const TodoCreate: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
