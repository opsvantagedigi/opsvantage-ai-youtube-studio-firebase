import type { NextAuthOptions } from 'next-auth';
import { type SupabaseClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
/**
 * Returns a Supabase client using the Service Role key.
 * This should only be used server-side for adapter operations.
 */
export declare function getSupabaseClient(): SupabaseClient;
export declare const authOptions: NextAuthOptions;
export default authOptions;
/**
 * Minimal auth wrapper used by middleware to validate the session from cookies.
 * Returns the token/session object or null.
 */
export declare function auth(req: NextRequest): Promise<import("next-auth/jwt").JWT | null>;
//# sourceMappingURL=config.d.ts.map