import { userRouter } from "./router/user-router";
import { router } from "./trpc";

export const appRouter = router({
  // 全ユーザーを取得
  user: userRouter, // ユーザー関連のルーターを追加
});
export type AppRouter = typeof appRouter; // クライアント側で型推論するために型をエクスポート
