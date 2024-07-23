import { z } from "zod";

export const statusSchema = z.object({
  score: z.number(),
  kanaType: z.number(),
  romaType: z.number(),
  flickType: z.number(),
  miss: z.number(),
  lost: z.number(),
  maxCombo: z.number(),
  kpm: z.number(),
  rkpm: z.number(),
  playSpeed: z.number(),
});

export const lineResultObjSchema = z.object({
  status: z.object({
    point: z.number(),
    timeBonus: z.number(),
    type: z.number(),
    miss: z.number(),
    combo: z.number(),
    clearTime: z.number(),
    kpm: z.number(),
    rkpm: z.number(),
    lineKpm: z.number(),
  }),
  typeResult: z.array(
    z.object({
      type: z
        .object({
          keys: z.array(z.string()),
          code: z.string(),
          shift: z.boolean().optional(),
          isSuccess: z.boolean(),
        })
        .optional(),

      option: z.string().optional(),
      time: z.number(),
    }),
  ),
});

export const resultSendSchema = z.object({
  mapId: z.number(),
  lineResult: z.array(lineResultObjSchema),
  status: statusSchema,
});
