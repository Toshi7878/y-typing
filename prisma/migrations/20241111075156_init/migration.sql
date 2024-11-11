-- DropForeignKey
ALTER TABLE "Map" DROP CONSTRAINT "Map_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
