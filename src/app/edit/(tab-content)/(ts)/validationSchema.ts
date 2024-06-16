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
        message: "譜面データにはhttpから始まる文字を含めることはできません",
      }
    )
    .refine((lines) => lines.some((line) => line.word && line.word.length > 0), {
      message: "タイピングワードが設定されていません",
    })
    .refine((lines) => lines[lines.length - 1]?.lyrics === "end", {
      message: "最後の歌詞は'end'である必要があります",
    })
    .refine((lines) => lines[0]?.time === "0", {
      message: "最初の時間は0である必要があります",
    })
    .refine((lines) => lines.every((line) => !isNaN(Number(line.time))), {
      message: "timeはすべて数値である必要があります",
    })
    .refine(
      (lines) => {
        const endAfterLineIndex = lines.findIndex((line) => line.lyrics === "end");
        return lines.every((line, index) =>
          endAfterLineIndex < index ? line.lyrics === "end" : true
        );
      },
      {
        message: "endの後に無効な行があります",
      }
    ),
  videoId: z.string(),
});
