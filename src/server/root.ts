import { userRouter } from "./router/user-router";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
});
export type AppRouter = typeof appRouter; // クライアント側で型推論するために型をエクスポート
