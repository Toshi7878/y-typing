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
  defaultSpeed: z.number(),
});

export const lineResultObjSchema = z.object({
  status: z.object({
    p: z.number(),
    tBonus: z.number(),
    type: z.number(),
    miss: z.number(),
    combo: z.number(),
    cTime: z.number(),
    kpm: z.number(),
    lRkpm: z.number(),
    lKpm: z.number(),
    mode: z.string(),
    lostW: z.string(),
  }),
  typeResult: z.array(
    z.object({
      c: z.string().optional(),
      is: z.boolean().optional(),
      op: z.string().optional(),
      t: z.number(),
    }),
  ),
});

export const resultSendSchema = z.object({
  mapId: z.number(),
  lineResult: z.array(lineResultObjSchema),
  status: statusSchema,
});
