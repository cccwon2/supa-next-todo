import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: "Todo 리스트 조회"
 *     description: "모든 Todo 리스트를 조회합니다."
 *     responses:
 *       200:
 *         description: "성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *   post:
 *     summary: "Todo 생성"
 *     description: "새로운 Todo를 생성합니다."
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
 */

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const todos = await prisma.todo.findMany();
    res.status(200).json(todos);
  } else if (req.method === "POST") {
    const { title, description } = req.body;
    const todo = await prisma.todo.create({
      data: { title, description },
    });
    res.status(200).json(todo);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
