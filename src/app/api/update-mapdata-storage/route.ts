import { supabase } from "@/lib/supabaseClient";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log("test");
  try {
    const count = 260; // resultテーブルの総数を取得
    for (let i = 1; i < count; i++) {
      const result = await prisma.map.findFirst({
        where: {
          id: i,
        },
        select: {
          mapData: true,
        },
      });

      if (!result) {
        continue;
      }

      const jsonString = JSON.stringify(result.mapData, null, 2);

      if (result) {
        // Supabaseストレージにアップロード
        const { data, error } = await supabase.storage
          .from("map-data") // バケット名を指定
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

    return NextResponse.json({ message: "all done" }, { status: 200 });
  } catch (error) {
    console.error("リプレイデータの取得中にエラーが発生しました:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
