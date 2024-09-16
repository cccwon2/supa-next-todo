// pages/api/todos.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await getTodos(req, res); // 기존 GET 요청 처리
  } else if (req.method === "POST") {
    return await createTodo(req, res); // POST 요청 처리
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

// GET 요청 처리 함수 (인증된 사용자의 Todo 리스트 반환)
async function getTodos(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
  }

  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    return res
      .status(500)
      .json({ error: "Todo 목록을 가져오는 데 실패했습니다." });
  }

  return res.status(200).json(todos);
}

// POST 요청 처리 함수 (새로운 Todo 생성)
async function createTodo(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
  }

  const { task, is_complete } = req.body;

  // 필수 필드 확인
  if (!task) {
    return res
      .status(400)
      .json({ error: "작업 내용(task)은 필수 항목입니다." });
  }

  // Todo 생성
  const { data, error } = await supabase
    .from("todos")
    .insert([
      { user_id: session.user.id, task, is_complete: is_complete || false },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: "Todo 항목 생성에 실패했습니다." });
  }

  return res.status(201).json(data);
}
