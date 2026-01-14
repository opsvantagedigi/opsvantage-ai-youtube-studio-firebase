import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export default NextAuth({
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
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({ data: { email, name: email.split('@')[0] } });
        }
        // NextAuth expects an object with at least an `id` property
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
