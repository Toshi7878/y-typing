import { auth } from "../../../lib/auth"; // updateSessionNameをインポート
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
// export const runtime = "edge";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "認証されていません" }, { status: 401 });
  }

  const { name } = await req.json();
  const id = session?.user?.id; // セッションからidを取得

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: { name },
      });

      return NextResponse.json({ message: "名前が更新されました" });
    } else {
      return NextResponse.json(
        { error: "メールアドレスが見つかりません" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "名前の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export const GET = async (req: NextRequest) => {
  return NextResponse.json(
    { message: "GETメソッドはサポートされていません" },
    { status: 405 }
  );
};
