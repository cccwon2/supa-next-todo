import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { SUPABASE_TODO } from "../../types/supabase";

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
 *         user_id:
 *           type: string
 *           description: "Todo 항목을 소유한 사용자 ID"
 *         task:
 *           type: string
 *           description: "Todo 항목의 작업 내용"
 *         is_complete:
 *           type: boolean
 *           description: "Todo 항목이 완료되었는지 여부"
 *         inserted_at:
 *           type: string
 *           format: date-time
 *           description: "Todo 항목이 생성된 시각"
 *     TodoInput:
 *       type: object
 *       properties:
 *         task:
 *           type: string
 *           description: "생성할 Todo 항목의 작업 내용"
 *         is_complete:
 *           type: boolean
 *           description: "Todo 항목이 완료되었는지 여부"
 *
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
 *     description: "새로운 Todo 항목을 생성합니다."
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

export async function GET() {
  const supabase = createClient();
  const { data: todos, error } = await supabase.from(SUPABASE_TODO).select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { task, is_complete } = await request.json();

  if (!task) {
    return NextResponse.json({ error: "Task is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(SUPABASE_TODO)
    .insert([{ task, is_complete }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
