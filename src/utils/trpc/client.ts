import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server";

// クライアント側でtRPCを使用するためのフックを作成
export const trpc = createTRPCReact<AppRouter>({});
