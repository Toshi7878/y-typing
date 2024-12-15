import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/root";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc", // tRPCのエンドポイントを指定
    req,
    router: appRouter, // 定義したappRouterを使用
    createContext: () => ({}), // コンテキストを作成（認証情報などを追加可能）
  });

export { handler as GET, handler as POST };
