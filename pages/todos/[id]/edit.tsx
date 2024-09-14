import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getTodo, updateTodo } from "../../../api/axios-todos";
import { Todo } from "../../../types";

const TodoEdit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (id) {
      getTodo(Number(id)).then(setTodo);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (todo && id) {
      await updateTodo(Number(id), {
        title: todo.title,
        description: todo.description,
      });
      router.push(`/todos/${id}`);
    }
  };

  if (!todo) return <div>로딩 중...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Todo 수정</h1>
      <input
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <textarea
        value={todo.description}
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
      />
      <button type="submit">수정</button>
    </form>
  );
};

export default TodoEdit;
