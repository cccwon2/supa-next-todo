import React, { useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { todoListAtom } from "../atoms";
import Link from "next/link";
import { SUPABASE_TODO } from "@/constants/supabase";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useAtom(todoListAtom);
  // useMemo로 supabase 생성
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: fetchedTodos, error } = await supabase
        .from(SUPABASE_TODO)
        .select();
      if (error) {
        console.error("Error fetching todos:", error);
      } else {
        setTodos(fetchedTodos || []); // Atom에 데이터 업데이트
      }
    };

    fetchTodos(); // 비동기로 데이터를 가져옴
  }, [setTodos, supabase]);

  return (
    <div>
      <h1>Todo 리스트</h1>
      <Link href="/todos/create">새 Todo 추가</Link>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <Link href={`/todos/${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
