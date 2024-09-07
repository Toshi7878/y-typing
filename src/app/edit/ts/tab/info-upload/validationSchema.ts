import { z } from "zod";

const lineSchema = z.object({
  time: z.string(),
  lyrics: z.string().optional(),
  word: z.string().optional(),
  options: z
    .object({ eternalCSS: z.string().optional(), changeCSS: z.string().optional() })
    .optional(), // 追加
});

export const mapSendSchema = z.object({
  title: z.string().min(1, { message: "タイトルは１文字以上必要です" }),
  creatorComment: z.string().optional(),
  tags: z.array(z.string()).min(2, { message: "タグは2つ以上必要です" }),
  thumbnailQuality: z.enum(["maxresdefault", "mqdefault"]),
  mapData: z
    .array(lineSchema)
    .refine(
      (lines) =>
        !lines.some((line) =>
          Object.values(line).some((value) => typeof value === "string" && value.includes("http")),
        ),
      {
        message: "譜面データにはhttpから始まる文字を含めることはできません",
      },
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
          endAfterLineIndex < index ? line.lyrics === "end" : true,
        );
      },
      {
        message: "endの後に無効な行があります",
      },
    )
    .refine(
      (lines) => {
        let allCustomStyleLength = 0;

        for (let i = 0; i < lines.length; i++) {
          const eternalCSS = lines[i].options?.eternalCSS;
          const changeCSS = lines[i].options?.changeCSS;
          if (eternalCSS) {
            allCustomStyleLength += eternalCSS.length;
          }

          if (changeCSS) {
            allCustomStyleLength += changeCSS.length;
          }
        }
        return allCustomStyleLength < 10000;
      },
      {
        message: "カスタムCSSの合計文字数は10000文字以下になるようにしてください",
      },
    ),
  videoId: z.string(),
});
