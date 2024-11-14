"use strict"
const { makeTypedQueryFactory: $mkFactory } = require("@prisma/client/runtime/library")
exports.getMapTypingData = /*#__PURE__*/ $mkFactory("SELECT \"mapData\", \"previewTime\" FROM public.\"Map\" WHERE id = $1")
