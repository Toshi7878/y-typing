/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Map` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Map" DROP COLUMN "difficulty",
ADD COLUMN     "kanaKpmMax" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "kanaKpmMedian" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "playCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rankingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "romaKpmMax" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "romaKpmMedian" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTime" INTEGER NOT NULL DEFAULT 0;
