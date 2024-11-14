SELECT
"Map"."id",
"Map"."title",
"Map"."artistName",
"Map"."musicSource",
"Map"."romaKpmMedian",
"Map"."romaKpmMax",
"Map"."videoId",
"Map"."updatedAt",
"Map"."previewTime",
"Map"."totalTime",
"Map"."thumbnailQuality",
json_build_object('id', "User"."id", 'name', "User"."name") as "user"
FROM "Map"
JOIN "User" ON "Map"."creatorId" = "User"."id"
ORDER BY "Map"."id" DESC
LIMIT $1 OFFSET $2