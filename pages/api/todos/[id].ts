import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

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

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const todoId = Number(id);

  if (req.method === "GET") {
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });
    res.status(200).json(todo);
  } else if (req.method === "PUT") {
    const { title, description, completed } = req.body;
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { title, description, completed },
    });
    res.status(200).json(updatedTodo);
  } else if (req.method === "PATCH") {
    const data = req.body;
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data,
    });
    res.status(200).json(updatedTodo);
  } else if (req.method === "DELETE") {
    await prisma.todo.delete({
      where: { id: todoId },
    });
    res.status(200).json({ message: "Todo deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
