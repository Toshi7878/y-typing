import { mapRouter } from "./routers/mapRouter";
import { notificationRouter } from "./routers/notificationRouter";
import { userOptionRouter } from "./routers/userOptionRouter";
import { router } from "./trpc";

export const appRouter = router({
  map: mapRouter,
  userOption: userOptionRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
