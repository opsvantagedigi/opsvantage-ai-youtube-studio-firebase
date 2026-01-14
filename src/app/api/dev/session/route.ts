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
    const body = await req.json();
    const {
      serviceToken,
      userId,
      email,
      name,
      globalRole,
      activeOrgId,
      activeWorkspaceId,
    } = body as Record<string, any>;

    if (!SERVICE_TOKEN) {
      console.error("TEST_SERVICE_TOKEN not configured");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Validate service token
    if (!serviceToken || serviceToken !== SERVICE_TOKEN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!NEXTAUTH_SECRET) {
      console.error("NEXTAUTH_SECRET not configured");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields: userId, email" }, { status: 400 });
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 4; // 4 hours

    const header = { alg: "HS256", typ: "JWT" };
    const payload: Record<string, any> = {
      sub: userId,
      email,
      name: name ?? null,
      globalRole: globalRole ?? "MEMBER",
      activeOrgId: activeOrgId ?? null,
      activeWorkspaceId: activeWorkspaceId ?? null,
      jti: crypto.randomBytes(8).toString("hex"),
      iat,
      exp,
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = signHS256(signingInput, NEXTAUTH_SECRET);
    const token = `${signingInput}.${signature}`;

    const maxAge = 60 * 60 * 4;
    const cookie = `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("dev/session error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
