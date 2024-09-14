import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_TODO } from "@/constants/supabase";
/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: "Todo 상세 조회"
 *     description: "특정 ID의 Todo를 조회합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *   put:
 *     summary: "Todo 수정 (전체)"
 *     description: "특정 ID의 Todo를 전체 수정합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       200:
 *         description: "성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *   patch:
 *     summary: "Todo 수정 (부분)"
 *     description: "특정 ID의 Todo를 부분 수정합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoPartialInput'
 *     responses:
 *       200:
 *         description: "성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *   delete:
 *     summary: "Todo 삭제"
 *     description: "특정 ID의 Todo를 삭제합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "성공"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient();
  const { id } = req.query;
  const todoId = Number(id);

  if (req.method === "GET") {
    const { data: todo, error } = await supabase
      .from(SUPABASE_TODO)
      .select("*")
      .eq("id", todoId)
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json(todo);
    }
  } else if (req.method === "PUT") {
    const { title, description, completed } = req.body;
    const { data: updatedTodo, error } = await supabase
      .from("todos")
      .update({ title, description, completed })
      .eq("id", todoId)
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json(updatedTodo);
    }
  } else if (req.method === "PATCH") {
    const data = req.body;
    const { data: updatedTodo, error } = await supabase
      .from("todos")
      .update(data)
      .eq("id", todoId)
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json(updatedTodo);
    }
  } else if (req.method === "DELETE") {
    const { error } = await supabase.from("todos").delete().eq("id", todoId);

    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json({ message: "Todo deleted" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
