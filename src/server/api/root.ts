import { authRouter } from "./routers/authRouter";
import { mapRouter } from "./routers/mapRouter";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
});

export type AppRouter = typeof appRouter;
