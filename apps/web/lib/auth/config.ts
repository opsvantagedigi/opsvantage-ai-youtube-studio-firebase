import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns a Supabase client using the Service Role key.
 * This should only be used server-side for adapter operations.
 */
export function getSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return createClient(url, key)
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  // SupabaseAdapter expects an options object with url and secret (service role key).
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL ?? '',
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  }),
  callbacks: {
    async session({ session, user }) {
      // Ensure session.user includes id for client-side code
      const safeUser = { ...session.user, id: user.id }
      return { ...session, user: safeUser }
    },
  },
}

export default authOptions
