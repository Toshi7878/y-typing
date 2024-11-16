-- CreateTable
CREATE TABLE "MapLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL,
    "isLiked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MapLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MapLike_userId_mapId_key" ON "MapLike"("userId", "mapId");

-- AddForeignKey
ALTER TABLE "MapLike" ADD CONSTRAINT "MapLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapLike" ADD CONSTRAINT "MapLike_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;
