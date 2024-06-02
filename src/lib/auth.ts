import NextAuth, { NextAuthConfig } from "next-auth";
import Discord from "@auth/core/providers/discord";
import Google from "@auth/core/providers/google";
import { PrismaClient } from "@prisma/client";
import generateIdenticon from "./generateIdenticon";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const config: NextAuthConfig = {
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  basePath: "/api/auth",
  callbacks: {
    async signIn({ user, account, profile }) {
      const UserData = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!UserData) {
        try {
          // 初めてログインしたユーザーに対する処理
          const identicon = generateIdenticon(user.email);

          await prisma.user.create({
            data: {
              id: user.id!,
              email: user.email!,
              name: null,
              image: identicon,
            },
          });
        } catch (err) {
          console.error("Error generating identicon:", err);
          return false;
        }
      }

      return true;
    },
    authorized({ request, auth }) {
      try {
        const { pathname } = request.nextUrl;
        if (pathname === "/dashboard/register" && auth?.user?.name) {
          return false;
        }

        return true;
      } catch (err) {
        console.log(err);
      }
    },
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update") {
        token.name = session.name;
      }
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.uid = dbUser.id;
          token.picture = dbUser.image;
        } else {
          const identicon = generateIdenticon(user.email);
          token.picture = identicon;
        }
        token.name = dbUser?.name ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.name = token.name;
        session.user.email = "";
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
