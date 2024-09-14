import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Todo } from "../../types";
import { getTodo, deleteTodo } from "../../api/axios-todos";
import Link from "next/link";

const TodoDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (id) {
      getTodo(Number(id)).then(setTodo);
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      await deleteTodo(Number(id));
      router.push("/");
    }
  };

  if (!todo) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>{todo.title}</h1>
      <p>{todo.description}</p>
      <Link href={`/todos/${todo.id}/edit`}>수정하기</Link>
      <button onClick={handleDelete}>삭제하기</button>
    </div>
  );
};

export default TodoDetail;
