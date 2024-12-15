/*
  Warnings:

  - Made the column `artistName` on table `Map` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Map" ALTER COLUMN "artistName" SET NOT NULL;
