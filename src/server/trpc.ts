import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router; // ルーターを作成するための関数
export const publicProcedure = t.procedure; // 公開プロシージャを定義（認証不要のエンドポイント用）
