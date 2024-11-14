import { makeTypedQueryFactory as $mkFactory } from "@prisma/client/runtime/library"
export const getMapTypingData = /*#__PURE__*/ $mkFactory("SELECT \"mapData\", \"previewTime\" FROM public.\"Map\" WHERE id = $1")
