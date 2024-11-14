-- AlterTable
ALTER TABLE "Map" ALTER COLUMN "artistName" DROP NOT NULL,
ALTER COLUMN "musicSource" DROP NOT NULL;

CREATE EXTENSION IF NOT EXISTS pgroonga;
create index ix_maps_search on public."Map" using pgroonga ("title", "artistName", "musicSource", "tags");
create index ix_user_name_search on public."User" using pgroonga ("name");