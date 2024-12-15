import { mapRouter } from "./routers/mapRouter";
import { router } from "./trpc";

export const appRouter = router({
  map: mapRouter,
});

export type AppRouter = typeof appRouter;
