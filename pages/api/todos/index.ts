import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "Todo 항목에 대한 고유 식별자"
 *         title:
 *           type: string
 *           description: "Todo 항목의 제목"
 *         description:
 *           type: string
 *           description: "Todo 항목에 대한 상세 설명"
 *         completed:
 *           type: boolean
 *           description: "Todo가 완료되었는지 여부"
 *     TodoInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: "생성할 Todo 항목의 제목"
 *         description:
 *           type: string
 *           description: "생성할 Todo 항목에 대한 상세 설명"
 *
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
