import { z } from "zod";

export const TabFormSchema = z.object({
  time: z.string().min(1, "時間は必須です。"),
});