import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server/root";

// クライアント側でtRPCを使用するためのフックを作成
export const trpc = createTRPCReact<AppRouter>({});
