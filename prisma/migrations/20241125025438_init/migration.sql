/*
  Warnings:

  - The primary key for the `MapLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MapLike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MapLike" DROP CONSTRAINT "MapLike_pkey",
DROP COLUMN "id";
