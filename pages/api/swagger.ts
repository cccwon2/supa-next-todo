import { NextApiRequest, NextApiResponse } from "next";
import swaggerSpec from "../../swagger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(swaggerSpec);
}
