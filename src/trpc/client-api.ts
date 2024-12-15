import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server/api/root";

export const clientApi = createTRPCReact<AppRouter>({});
