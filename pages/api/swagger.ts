import { NextApiRequest, NextApiResponse } from "next";
import swaggerSpec from "../../swagger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.status(200).json(swaggerSpec);
}
