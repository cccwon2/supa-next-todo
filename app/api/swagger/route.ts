import { NextResponse } from "next/server";
import { setupSwagger } from "./setupSwagger";

export async function GET() {
  const swaggerSpec = setupSwagger();
  return NextResponse.json(swaggerSpec);
}

// 다른 HTTP 메서드에 대한 처리가 필요한 경우 추가할 수 있습니다.
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
