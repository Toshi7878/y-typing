/*
  Warnings:

  - The primary key for the `Clap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Clap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clap" DROP CONSTRAINT "Clap_pkey",
DROP COLUMN "id";
