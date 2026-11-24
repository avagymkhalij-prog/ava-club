import type { DefaultSession, DefaultUser } from "next-auth";

// Augment the default NextAuth types with our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "MEMBER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: "MEMBER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "MEMBER" | "ADMIN";
  }
}
