import { appRouter } from "@/server/api/root";
import { createCallerFactory } from "@/server/api/trpc";
import { httpBatchLink } from "@trpc/client";

export const serverApi = createCallerFactory(appRouter)({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/trpc`,
    }),
  ],
});
