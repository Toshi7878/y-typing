import { z } from "zod";

export const nameSchema = z.object({
  newName: z
    .string()
    .min(1, "このフィールドを入力してください。")
    .max(10, "最大１０文字以内で入力してください"),
});
