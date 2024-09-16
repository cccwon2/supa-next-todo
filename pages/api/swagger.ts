import { NextApiRequest, NextApiResponse } from "next";
import swaggerSpec from "../../lib/swagger";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         user_metadata:
 *           type: object
 *           properties:
 *             full_name:
 *               type: string
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         inserted_at:
 *           type: string
 *           format: date-time
 *         is_complete:
 *           type: boolean
 *           nullable: true
 *         task:
 *           type: string
 *           nullable: true
 *         user_id:
 *           type: string
 *     NewTodo:
 *       type: object
 *       properties:
 *         task:
 *           type: string
 *           nullable: true
 *         user_id:
 *           type: string
 *       required:
 *         - user_id
 *     UpdateTodo:
 *       type: object
 *       properties:
 *         is_complete:
 *           type: boolean
 *           nullable: true
 *         task:
 *           type: string
 *           nullable: true
 *         user_id:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *         token_type:
 *           type: string
 *         expires_in:
 *           type: integer
 *         refresh_token:
 *           type: string
 *
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: 인증 실패
 *
 * /api/users/me:
 *   get:
 *     summary: 현재 인증된 사용자의 정보를 가져옵니다
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증되지 않음
 *
 * /api/todos:
 *   get:
 *     summary: 모든 할 일 목록을 가져옵니다
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: 인증되지 않음
 *   post:
 *     summary: 새로운 할 일을 추가합니다
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTodo'
 *     responses:
 *       201:
 *         description: 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: 인증되지 않음
 *
 * /api/todos/{id}:
 *   get:
 *     summary: 특정 ID의 할 일을 가져옵니다
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: 인증되지 않음
 *       404:
 *         description: 찾을 수 없음
 *   put:
 *     summary: 특정 ID의 할 일을 수정합니다
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodo'
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: 인증되지 않음
 *       404:
 *         description: 찾을 수 없음
 *   delete:
 *     summary: 특정 ID의 할 일을 삭제합니다
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 성공적으로 삭제됨
 *       401:
 *         description: 인증되지 않음
 *       404:
 *         description: 찾을 수 없음
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(swaggerSpec);
}
