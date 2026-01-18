import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import { getToken } from 'next-auth/jwt';
/**
 * Returns a Supabase client using the Service Role key.
 * This should only be used server-side for adapter operations.
 */
export function getSupabaseClient() {
    const url = process.env.SUPABASE_URL ?? '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
    return createClient(url, key);
}
export const authOptions = {
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
            const safeUser = { ...session.user, id: user.id };
            return { ...session, user: safeUser };
        },
    },
};
export default authOptions;
/**
 * Minimal auth wrapper used by middleware to validate the session from cookies.
 * Returns the token/session object or null.
 */
export async function auth(req) {
    return await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
}
//# sourceMappingURL=config.js.map