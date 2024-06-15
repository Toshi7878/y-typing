import { z } from "zod";

const lineSchema = z.object({
  time: z.string(),
  lyrics: z.string().optional(),
  word: z.string().optional(),
});

export const mapSendSchema = z.object({
  title: z.string().min(1, { message: "タイトルは１文字以上必要です" }),
  creatorComment: z.string().optional(),
  genre: z.string().min(1, { message: "ジャンルが選択されていません" }),
  tags: z.array(z.string()).min(2, { message: "タグは2つ以上必要です" }),
  mapData: z
    .array(lineSchema)
    .refine(
      (lines) =>
        !lines.some((line) =>
          Object.values(line).some((value) => typeof value === "string" && value.includes("http"))
        ),
      {
        message: "mapDataにはhttpから始まる文字を含めることはできません",
      }
    )
    .refine((lines) => lines.some((line) => line.word && line.word.length > 0), {
      message: "タイピングワードが設定されていません",
    }),
  videoId: z.string(),
});
