import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await auth();
  const userId = Number(session?.user?.id);
  const id = parseInt(url.searchParams.get("id") || "0", 10); // クエリからidを取得

  try {
    const rankingList = await prisma.$queryRaw`
    SELECT
      "Result"."id",
      "Result"."userId",
      "Result"."score",
      "Result"."defaultSpeed",
      "Result"."kpm",
      "Result"."rkpm",
      "Result"."romaKpm",
      "Result"."romaType",
      "Result"."kanaType",
      "Result"."flickType",
      "Result"."miss",
      "Result"."lost",
      "Result"."maxCombo",
      "Result"."clapCount",
      "Result"."clearRate",
      "Result"."updatedAt",
      json_build_object(
        'id', "Player"."id",
        'name', "Player"."name"
      ) as "user",
      (
        SELECT "isClaped"
        FROM "Clap"
        WHERE "Clap"."resultId" = "Result"."id"
        AND "Clap"."userId" = ${userId}
        LIMIT 1
      ) as "hasClap"
    FROM
      "Result"
    JOIN "User" AS "Player" ON "Result"."userId" = "Player"."id"
    WHERE
      "Result"."mapId" = ${id}
    ORDER BY
      "Result"."score" DESC
  `;

    // const rankingList = await prisma.result.findMany({
    //   where: {
    //     mapId: id, // mapIdが1のカラムを取得
    //   },
    //   select: {
    //     id: true,
    //     mapId: false,
    //     userId: true,
    //     score: true,
    //     defaultSpeed: true,
    //     kpm: true,
    //     rkpm: true,
    //     romaKpm: true,
    //     romaType: true,
    //     kanaType: true,
    //     flickType: true,
    //     miss: true,
    //     lost: true,
    //     maxCombo: true,
    //     clapCount: true,
    //     clearRate: true,
    //     updatedAt: true,
    //     user: {
    //       select: {
    //         name: true, // userからnameを取得
    //       },
    //     },
    //   },
    //   orderBy: { score: "desc" },
    // });

    return new Response(JSON.stringify(rankingList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
