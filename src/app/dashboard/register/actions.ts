"use server";

import { auth } from "../../../lib/auth"; // updateSessionNameをインポート
import { PrismaClient } from "@prisma/client";
import { nameSchema } from "./validationSchema";
import { redirect } from "next/navigation";
// export const runtime = "edge";

const prisma = new PrismaClient();
const sendUserName = async (email_hash: string, newName: string) => {
  if (email_hash) {
    await prisma.user.update({
      where: { email_hash },
      data: { name: newName },
    });
  }
};
export async function actions(state: { message: string | null }, formData: FormData) {
  const session = await auth();

  const validatedFields = nameSchema.safeParse({
    newName: formData.get("newName"),
  });

  if (!validatedFields.success) {
    return {
      newName: "",
      message: validatedFields.error.errors[0].message,
      status: 400, // ステータスコードを追加
    };
  }

  const email_hash = session?.user?.email; // セッションからidを取得

  try {
    const newName = validatedFields.data!.newName;
    await sendUserName(email_hash!, newName);
    return { newName, message: "名前が更新されました", status: 200 };
  } catch (error) {
    return { newName: "", message: "名前の更新中にエラーが発生しました", status: 500 };
  }
}
