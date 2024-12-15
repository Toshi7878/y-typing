"use server";

import { RouterOutPuts } from "@/server/api/trpc";
import { auth } from "@/server/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

async function updateTypingOption(
  userId: number,
  updateData: RouterOutPuts["userOption"]["getUserTypingOptions"],
) {
  const updated = await prisma.typingOption.upsert({
    where: {
      userId,
    },
    update: {
      ...updateData,
    },
    create: {
      userId,
      ...updateData,
    },
  });

  return updated;
}

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();

  const updateData: RouterOutPuts["userOption"]["getUserTypingOptions"] = await req.json();

  try {
    const userId = Number(session?.user?.id);

    const id = await updateTypingOption(userId, updateData);

    return new Response(
      JSON.stringify({
        id,
        title: "アップデート完了",
        message: "",
        status: 200,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        id: null,
        title: "サーバー側で問題が発生しました",
        message: "しばらく時間をおいてから再度お試しください。",
        status: 500,
        errorObject: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}
