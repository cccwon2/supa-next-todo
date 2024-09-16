import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("세션 확인:", session); // 세션 정보 출력

  if (!session) {
    return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
  }

  const todoId = req.query.id;

  switch (req.method) {
    // GET 요청: 특정 Todo 항목 조회
    case "GET":
      try {
        const { data: todo, error } = await supabase
          .from("todos")
          .select("*")
          .eq("id", todoId)
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;

        return res.status(200).json(todo);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Todo 항목을 가져오는 데 실패했습니다." });
      }

    // PUT 요청: 특정 Todo 항목 수정
    case "PUT":
      try {
        const { task, is_complete, user_id } = req.body;

        if (!task) {
          return res.status(400).json({ error: "Task 항목이 필요합니다." });
        }

        if (!user_id) {
          return res.status(400).json({ error: "UserId 항목이 필요합니다." });
        }

        const { data: updatedTodo, error } = await supabase
          .from("todos")
          .update({ task, is_complete })
          .eq("id", todoId)
          .eq("user_id", user_id);

        if (error) throw error;

        return res.status(200).json({ task, is_complete, user_id });
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Todo 항목을 수정하는 데 실패했습니다." });
      }

    // DELETE 요청: 특정 Todo 항목 삭제
    case "DELETE":
      try {
        if (!session) {
          return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
        }

        const { error } = await supabase
          .from("todos")
          .delete()
          .eq("id", todoId)
          .eq("user_id", session.user.id);

        if (error) {
          console.error("삭제 시 발생한 오류:", error.details, error.hint); // 에러 메시지를 더 자세히 로그
          throw error; // 여기서 오류를 다시 처리
        }

        return res
          .status(200)
          .json({ message: "Todo 항목이 성공적으로 삭제되었습니다." });
      } catch (error) {
        console.error("DELETE 요청 처리 중 오류:", error);
        return res
          .status(500)
          .json({ error: "Todo 항목을 삭제하는 데 실패했습니다." });
      }
    // 기타 요청에 대한 처리
    default:
      return res.status(405).json({ error: "허용되지 않은 메서드입니다." });
  }
}
