import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

// User shape attached to the JWT / session
export type AuthUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: "MEMBER" | "ADMIN";
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "شماره موبایل و کد تایید",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        otp: { label: "کد تایید", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;

        const phone = credentials.phone.trim();
        const code = credentials.otp.trim();

        // 1. Find a valid (non-expired) token for this phone
        const token = await prisma.otpToken.findFirst({
          where: {
            phone,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        // 2. No valid token or wrong code → reject
        if (!token || token.code !== code) return null;

        // 3. Delete the used token (one-time use)
        await prisma.otpToken.delete({ where: { id: token.id } });

        // 4. Find user by phone; create on first login (register + login combined)
        let user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: "کاربر آوا",
              phone,
              email: null,
              passwordHash: null,
            },
          });
        }

        // 5. Return the user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role === "ADMIN" ? "ADMIN" : "MEMBER",
        };
      },
    }),
  ],
  callbacks: {
    // Persist role and id into the JWT on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as AuthUser).id;
        token.role = (user as AuthUser).role;
      }
      return token;
    },
    // Expose id and role on the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "MEMBER" | "ADMIN";
      }
      return session;
    },
  },
};
