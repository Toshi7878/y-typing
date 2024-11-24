import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get("userId"));

  try {
    const userTypingOptions = await prisma.typingOption.findUnique({
      where: { userId },
      select: null, // 全てのカラムを取得するためにselectをnullに設定
    });
    return new Response(JSON.stringify(userTypingOptions), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
