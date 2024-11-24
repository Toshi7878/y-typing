/*
  Warnings:

  - You are about to drop the `UserTypingData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTypingData" DROP CONSTRAINT "UserTypingData_userId_fkey";

-- DropTable
DROP TABLE "UserTypingData";

-- CreateTable
CREATE TABLE "UserTypingStats" (
    "userId" INTEGER NOT NULL,
    "totalTypingTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kanaTypeTotalCount" INTEGER NOT NULL DEFAULT 0,
    "romaTypeTotalCount" INTEGER NOT NULL DEFAULT 0,
    "totalPlayCount" INTEGER NOT NULL DEFAULT 0,
    "maxCombo" INTEGER NOT NULL DEFAULT 0,
    "clapCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTypingStats_userId_key" ON "UserTypingStats"("userId");

-- AddForeignKey
ALTER TABLE "UserTypingStats" ADD CONSTRAINT "UserTypingStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
