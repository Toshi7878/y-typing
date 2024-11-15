import { supabase } from "@/lib/supabaseClient";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const count = 533; // resultテーブルの総数を取得
    for (let i = 513; i < count; i++) {
      const result = await prisma.result.findFirst({
        where: {
          id: i,
        },
        select: {
          lineResult: true,
        },
      });

      if (!result) {
        continue;
      }

      const jsonString = JSON.stringify(result.lineResult, null, 2);

      if (result) {
        // Supabaseストレージにアップロード
        const { data, error } = await supabase.storage
          .from("user-result") // バケット名を指定
          .upload(`public/${i}.json`, new Blob([jsonString], { type: "application/json" }), {
            upsert: true, // 既存のファイルを上書きするオプションを追加
          });

        if (error) {
          console.error("Error uploading to Supabase:", error);
          throw error;
        }

        console.log(i + "done");
      }
    }

    return "all done";
  } catch (error) {
    console.error("リプレイデータの取得中にエラーが発生しました:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
