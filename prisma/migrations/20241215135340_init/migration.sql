/*
  Warnings:

  - Made the column `musicSource` on table `Map` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Map" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "musicSource" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT ARRAY[]::TEXT[];
