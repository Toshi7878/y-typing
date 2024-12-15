import { inferRouterInputs, inferRouterOutputs, initTRPC } from "@trpc/server";
import { AppRouter } from "./root";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutPuts = inferRouterOutputs<AppRouter>;
