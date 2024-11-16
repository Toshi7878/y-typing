/*
  Warnings:

  - A unique constraint covering the columns `[userId,resultId]` on the table `Clap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clap_userId_resultId_key" ON "Clap"("userId", "resultId");
