import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Todo } from "../../types";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { SUPABASE_TODO } from "@/constants/supabase";

const TodoDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState<Todo | null>(null);
  // useMemo로 supabase 생성
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (id) {
      const getTodo = async (todoId: number) => {
        const { data, error } = await supabase
          .from(SUPABASE_TODO)
          .select("*")
          .eq("id", todoId)
          .single();

        if (error) {
          console.error("Error fetching todo:", error);
        } else {
          setTodo(data);
        }
      };

      getTodo(Number(id));
    }
  }, [id, supabase]);

  // Supabase를 사용하여 특정 Todo 아이템 삭제하기
  const handleDelete = async () => {
    if (id) {
      const { error } = await supabase
        .from(SUPABASE_TODO)
        .delete()
        .eq("id", Number(id));

      if (error) {
        console.error("Error deleting todo:", error);
      } else {
        router.push("/");
      }
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
