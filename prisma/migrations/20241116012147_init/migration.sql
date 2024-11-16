/*
  Warnings:

  - You are about to drop the column `mapId` on the `Clap` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clap" DROP CONSTRAINT "Clap_mapId_fkey";

-- AlterTable
ALTER TABLE "Clap" DROP COLUMN "mapId";
