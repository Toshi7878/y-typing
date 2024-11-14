"use strict"
const { makeTypedQueryFactory: $mkFactory } = require("@prisma/client/runtime/library")
exports.getMapList = /*#__PURE__*/ $mkFactory("SELECT\n\"Map\".\"id\",\n\"Map\".\"title\",\n\"Map\".\"artistName\",\n\"Map\".\"musicSource\",\n\"Map\".\"romaKpmMedian\",\n\"Map\".\"romaKpmMax\",\n\"Map\".\"videoId\",\n\"Map\".\"updatedAt\",\n\"Map\".\"previewTime\",\n\"Map\".\"totalTime\",\n\"Map\".\"thumbnailQuality\",\njson_build_object('id', \"User\".\"id\", 'name', \"User\".\"name\") as \"user\"\nFROM \"Map\"\nJOIN \"User\" ON \"Map\".\"creatorId\" = \"User\".\"id\"\nORDER BY \"Map\".\"id\" DESC\nLIMIT $1 OFFSET $2")