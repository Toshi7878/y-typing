-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;
