import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { config } from "./lib/envConfig";

export default {
  providers: [
    Google({
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
    }),
  ],
} satisfies NextAuthConfig;
