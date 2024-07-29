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
    p: z.number().optional(),
    tBonus: z.number().optional(),
    lType: z.number().optional(),
    lMiss: z.number().optional(),
    cTime: z.number().optional(),
    lRkpm: z.number().optional(),
    lKpm: z.number().optional(),
    lostW: z.string().optional(),
    tTime: z.number(),
    combo: z.number(),
    mode: z.string(),
    sp: z.number(),
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
