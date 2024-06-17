import { z } from "zod";

export const nameSchema = z.object({
  newName: z
    .string()
    .min(1, "このフィールドを入力してください。")
    .max(10, "最大１０文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_]+$/, "半角英数字とアンダーバー（_）のみ使うことができます"),
});
