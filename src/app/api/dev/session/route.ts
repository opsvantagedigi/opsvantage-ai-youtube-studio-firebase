import { NextResponse } from "next/server";
import crypto from "crypto";

const SERVICE_TOKEN = process.env.TEST_SERVICE_TOKEN;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

function base64url(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signHS256(message: string, secret: string) {
  return base64url(crypto.createHmac("sha256", secret).update(message).digest());
}

export async function POST(req: Request) {
  try {
    // Defensive logging helpers
    function log(label: string, value: any) {
      try {
        console.error(`[dev-session] ${label}:`, value);
      } catch (e) {
        // noop
      }
    }

    // Parse body safely and log
    let body: Record<string, any> | null = null;
    try {
      body = await req.json();
      log('incoming body', body);
    } catch (err) {
      log('body parse error', String(err));
    }

    log('NEXTAUTH_SECRET exists', !!process.env.NEXTAUTH_SECRET);
    log('TEST_SERVICE_TOKEN exists', !!process.env.TEST_SERVICE_TOKEN);

    const serviceToken = body?.serviceToken;
    const userId = body?.userId;
    const email = body?.email;
    const name = body?.name;
    const globalRole = body?.globalRole;
    const activeOrgId = body?.activeOrgId;
    const activeWorkspaceId = body?.activeWorkspaceId;

    if (!SERVICE_TOKEN) {
      log('missing TEST_SERVICE_TOKEN', 'undefined');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!serviceToken || serviceToken !== SERVICE_TOKEN) {
      log('invalid or missing service token', serviceToken);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!NEXTAUTH_SECRET) {
      log('missing NEXTAUTH_SECRET', 'undefined');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!userId || !email) {
      log('missing userId/email', { userId, email });
      return NextResponse.json({ error: 'Missing required fields: userId, email' }, { status: 400 });
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 4; // 4 hours

    const header = { alg: 'HS256', typ: 'JWT' };
    const payload: Record<string, any> = {
      sub: userId,
      email,
      name: name ?? null,
      globalRole: globalRole ?? 'MEMBER',
      activeOrgId: activeOrgId ?? null,
      activeWorkspaceId: activeWorkspaceId ?? null,
      jti: crypto.randomBytes(8).toString('hex'),
      iat,
      exp,
    };

    let token: string;
    try {
      const encodedHeader = base64url(JSON.stringify(header));
      const encodedPayload = base64url(JSON.stringify(payload));
      const signingInput = `${encodedHeader}.${encodedPayload}`;
      const signature = signHS256(signingInput, NEXTAUTH_SECRET as string);
      token = `${signingInput}.${signature}`;
      log('jwt signed', { jti: payload.jti });
    } catch (err) {
      log('jwt sign error', String(err));
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const maxAge = 60 * 60 * 4;
    const cookie = `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    const resp = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      resp.headers.set('Set-Cookie', cookie);
      log('set-cookie', 'written');
    } catch (err) {
      log('cookie set error', String(err));
    }

    return resp;
  } catch (err: any) {
    try {
      console.error('[dev-session] unhandled error', err);
      console.error('[dev-session] stack', err?.stack);
    } catch (e) {
      // noop
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
