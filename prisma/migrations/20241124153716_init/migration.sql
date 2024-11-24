-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_visited_id_fkey";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_visitor_id_mapId_fkey" FOREIGN KEY ("visitor_id", "mapId") REFERENCES "Result"("userId", "mapId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_visited_id_mapId_fkey" FOREIGN KEY ("visited_id", "mapId") REFERENCES "Result"("userId", "mapId") ON DELETE CASCADE ON UPDATE CASCADE;
