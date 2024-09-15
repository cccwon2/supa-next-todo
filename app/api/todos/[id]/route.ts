import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { SUPABASE_TODO } from "../../../types/supabase";

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
 * /api/todos/{id}:
 *   get:
 *     summary: "특정 ID의 Todo 조회"
 *     description: "특정 ID를 가진 Todo 항목을 조회합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "조회할 Todo 항목의 ID"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "성공적으로 Todo 항목을 조회했습니다."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: "Todo 항목을 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
 *   put:
 *     summary: "특정 ID의 Todo 수정"
 *     description: "특정 ID를 가진 Todo 항목을 수정합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "수정할 Todo 항목의 ID"
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       200:
 *         description: "성공적으로 Todo 항목이 수정되었습니다."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: "잘못된 요청입니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
 *   delete:
 *     summary: "특정 ID의 Todo 삭제"
 *     description: "특정 ID를 가진 Todo 항목을 삭제합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "삭제할 Todo 항목의 ID"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "성공적으로 Todo 항목이 삭제되었습니다."
 *       404:
 *         description: "Todo 항목을 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
 */

export async function GET(request: Request) {
  const idString = request.url.split("/").pop();
  const id = idString ? parseInt(idString, 10) : null;
  const supabase = createClient();

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID가 제공되지 않았습니다." }),
      { status: 400 }
    );
  }

  const { data: todo, error } = await supabase
    .from(SUPABASE_TODO)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(todo);
}

export async function PUT(request: Request) {
  const idString = request.url.split("/").pop();
  const id = idString ? parseInt(idString, 10) : null;
  const supabase = createClient();
  const { task, is_complete } = await request.json();

  if (!task) {
    return NextResponse.json({ error: "Task is required." }, { status: 400 });
  }

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID가 제공되지 않았습니다." }),
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from(SUPABASE_TODO)
    .update({ task, is_complete })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const idString = request.url.split("/").pop();
  const id = idString ? parseInt(idString, 10) : null;
  const supabase = createClient();

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID가 제공되지 않았습니다." }),
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from(SUPABASE_TODO)
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("Deleted data: ", data);

  return NextResponse.json({ message: "Todo successfully deleted" });
}
