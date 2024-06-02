import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import generateIdenticon from "./generateIdenticon";
// export const runtime = "edge";

const prisma = new PrismaClient();

export const config: NextAuthConfig = {
  providers: [GoogleProvider],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const UserData = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!UserData) {
        try {
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
        const url = new URL(request.url);
        const pathname = url.pathname;
        if (pathname === "/dashboard/register" && !auth?.user?.name) {
          return !!auth;
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
