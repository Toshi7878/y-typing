import { z } from "zod";

import { db } from "./db";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  // 全ユーザーを取得
  getUsers: publicProcedure.query(async () => {
    return db.user.findMany();
  }),
  getUser: publicProcedure.input(z.number()).query(async ({ input }) => {
    // 特定のユーザーを id で検索
    const user = await db.user.findUnique({
      where: { id: input },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),
  updateUser: publicProcedure
    .input(z.object({ auth_id: z.number(), name: z.string() }))
    .mutation((req) => {
      // ユーザー名を更新
      return db.user.update({
        where: { id: req.input.auth_id },
        data: { name: req.input.name },
      });
    }),
});
export type AppRouter = typeof appRouter; // クライアント側で型推論するために型をエクスポート
