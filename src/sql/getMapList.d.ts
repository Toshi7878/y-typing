import * as $runtime from "@prisma/client/runtime/library"

/**
 * @param int8
 * @param int8
 */
export const getMapList: (int8: number | bigint, int8: number | bigint) => $runtime.TypedSql<getMapList.Parameters, getMapList.Result>

export namespace getMapList {
  export type Parameters = [int8: number | bigint, int8: number | bigint]
  export type Result = {
    id: number
    title: string
    artistName: string | null
    musicSource: string | null
    romaKpmMedian: number
    romaKpmMax: number
    videoId: string
    updatedAt: Date
    previewTime: string
    totalTime: number
    thumbnailQuality: string
    user: $runtime.JsonValue | null
  }
}
