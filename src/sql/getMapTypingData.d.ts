import * as $runtime from "@prisma/client/runtime/library"

/**
 * @param int4
 */
export const getMapTypingData: (int4: number) => $runtime.TypedSql<getMapTypingData.Parameters, getMapTypingData.Result>

export namespace getMapTypingData {
  export type Parameters = [int4: number]
  export type Result = {
    mapData: $runtime.JsonValue
    previewTime: string
  }
}
