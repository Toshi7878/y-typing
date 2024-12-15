import { inferRouterInputs, inferRouterOutputs, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { AppRouter } from "./root";

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutPuts = inferRouterOutputs<AppRouter>;
