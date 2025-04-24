import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import { config } from "./lib/envConfig";
import { UserRole } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter, // Explicitly cast to Adapter
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true, role: true },
        });

        if (user) {
          session.user = {
            ...session.user,
            id: user.id,
            role: user.role as UserRole,
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
      }
      return token;
    },
  },
  trustHost: true,
});
