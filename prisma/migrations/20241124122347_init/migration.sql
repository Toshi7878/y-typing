/*
  Warnings:

  - The primary key for the `TypingOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TypingOption` table. All the data in the column will be lost.
  - The primary key for the `UserTypingData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserTypingData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TypingOption" DROP CONSTRAINT "TypingOption_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "UserTypingData" DROP CONSTRAINT "UserTypingData_pkey",
DROP COLUMN "id";

-- CreateTable
CREATE TABLE "UserOption" (
    "userId" INTEGER NOT NULL,
    "mapLikeNotify" BOOLEAN NOT NULL DEFAULT true,
    "overTakeNotify" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "visitor_id" INTEGER NOT NULL,
    "visited_id" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOption_userId_key" ON "UserOption"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_visited_id_fkey" FOREIGN KEY ("visited_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
