import CryptoJS from "crypto-js";
import { z } from "zod";
import { db } from "../../db";
import { publicProcedure } from "../trpc";

export const authRouter = {
  create: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input }) => {
    const email_hash = CryptoJS.MD5(input.email).toString();
    const UserData = await db.user.findUnique({
      where: { email_hash },
    });

    if (!UserData) {
      try {
        await db.user.create({
          data: {
            email_hash,
            name: null,
            role: "user",
          },
        });
      } catch (err) {
        console.error("Error generating identicon:", err);
        return false;
      }
    }

    return true;
  }),

  findUser: publicProcedure.input(z.object({ email: z.string() })).query(async ({ input }) => {
    const email_hash = CryptoJS.MD5(input.email).toString();
    const UserData = await db.user.findUnique({
      where: { email_hash },
    });

    return UserData;
  }),
};
