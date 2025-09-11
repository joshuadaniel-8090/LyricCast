// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    // you can add custom fields here if needed
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
