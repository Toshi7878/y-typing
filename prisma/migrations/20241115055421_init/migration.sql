-- DropIndex
DROP INDEX "ix_maps_search";

-- DropIndex
DROP INDEX "ix_user_name_search";

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "clapCount" INTEGER NOT NULL DEFAULT 0;
