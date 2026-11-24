// NextAuth runs on the Node.js runtime in local/dev and standard builds
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
