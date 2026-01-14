import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
const { getPrisma } = require('@/lib/getPrisma');

function createHandler() {
  const prisma = getPrisma();

  return NextAuth({
    adapter: PrismaAdapter(prisma as any),
    providers: [
      CredentialsProvider({
        name: 'Email',
        credentials: {
          email: { label: 'Email', type: 'text' },
        },
        async authorize(credentials) {
          if (!credentials?.email) return null;
          const email = credentials.email.toLowerCase();
          const prisma = getPrisma();
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({ data: { email, name: email.split('@')[0] } });
          }
          return { id: user.id, email: user.email, name: user.name } as any;
        },
      }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      async session({ session, token }) {
        if (token?.sub) session.user = { ...(session.user || {}), id: token.sub } as any;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

const handler = (...args: any[]) => createHandler().apply(null, args as any);

export { handler as GET, handler as POST };