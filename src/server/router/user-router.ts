import CryptoJS from "crypto-js";
import { z } from "zod";
import { db } from "../db";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {

  createUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const email_hash = CryptoJS.MD5(input.email).toString();
      const existingUser = await db.user.findUnique({
        where: { email_hash },
      });

      if (!existingUser) {
        return await db.user.create({
          data: {
            email_hash,
            name: null,
            role: "user",
          },
        });
      } else {
        throw new Error("User already exists");
      }
    }),
});
