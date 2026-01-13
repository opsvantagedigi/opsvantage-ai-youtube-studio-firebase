import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { buildUserClaims } from "@/lib/auth/claims";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (!token.email) return token;

      const user = await prisma.user.findUnique({
        where: { email: token.email },
        include: {
          memberships: {
            include: { organization: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!user) return token;

      const defaultOrg = user.memberships[0]?.organization;

      const claims = buildUserClaims({
        userId: user.id,
        globalRole: user.role,
        activeOrgId: defaultOrg?.id,
      });

      return {
        ...token,
        ...claims,
      };
    },
    async session({ session, token }) {
      if (!session.user) return session;

      session.user.id = token.userId as string;
      session.user.globalRole = token.globalRole as string;
      session.user.activeOrgId = token.activeOrgId as string | undefined;
      session.user.activeWorkspaceId = token.activeWorkspaceId as string | undefined;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
