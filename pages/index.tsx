import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { todoListAtom } from "../atoms";
import { getTodos } from "../api/axios-todos";
import Link from "next/link";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useAtom(todoListAtom);

  useEffect(() => {
    getTodos().then(setTodos);
  }, [setTodos]);

  return (
    <div>
      <h1>Todo 리스트</h1>
      <Link href="/todos/create">새 Todo 추가</Link>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Link href={`/todos/${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
