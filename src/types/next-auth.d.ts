import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      globalRole?: string;
      activeOrgId?: string;
      activeWorkspaceId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    globalRole?: string;
    activeOrgId?: string;
    activeWorkspaceId?: string;
  }
}
