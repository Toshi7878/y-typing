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

    return new Response(JSON.stringify(rankingList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
