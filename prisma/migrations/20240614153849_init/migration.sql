-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creatorComment" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "tags" TEXT[],
    "mapData" JSONB NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);
