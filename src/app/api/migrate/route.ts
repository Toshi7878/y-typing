import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateStatus() {
  try {
    const results = await prisma.result.findMany();

    for (const result of results) {
      const status = result.status as {
        romaType: number;
        kanaType: number;
        flickType: number;
        kpm: number;
        rkpm: number;
        miss: number;
        lost: number;
        maxCombo: number;
        defaultSpeed: number;
      };

      await prisma.result.update({
        where: { id: result.id },
        data: {
          romaType: status.romaType,
          kanaType: status.kanaType,
          flickType: status.flickType,
          kpm: status.kpm,
          rkpm: status.rkpm,
          romaKpm: status.kpm,
          miss: status.miss,
          lost: status.lost,
          maxCombo: status.maxCombo,
          defaultSpeed: status.defaultSpeed,
        },
      });
      console.log(`Updated result with id: ${result.id}`);
    }
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    await migrateStatus();
    return NextResponse.json({ message: "Migration completed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error during migration" }, { status: 500 });
  }
}
