/*
  Warnings:

  - A unique constraint covering the columns `[userId,mapId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_mapId_key" ON "Result"("userId", "mapId");
