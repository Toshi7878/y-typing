/*
  Warnings:

  - A unique constraint covering the columns `[visitor_id,visited_id,mapId,action]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_visitor_id_visited_id_mapId_action_key" ON "Notification"("visitor_id", "visited_id", "mapId", "action");
