import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import nodemailer from "nodemailer"
import Redis from "ioredis"

// Rate limiter: prefer Redis when REDIS_URL is provided, else fallback to in-memory map.
const redisUrl = process.env.REDIS_URL
let redisClient: Redis | null = null
try {
  // Guard against placeholder values that may be present in env during builds
  const isPlaceholder = !redisUrl || redisUrl.includes("<REPLACE") || redisUrl.includes("%3C")
  if (!isPlaceholder) {
    redisClient = new Redis(redisUrl as string)
    // Prevent unhandled error events from crashing the build; log instead
    redisClient.on("error", (err) => {
      console.warn("Redis client error (suppressed):", err?.message ?? err)
    })
  }
} catch (err) {
  console.warn("Failed to initialize Redis client; continuing without Redis:", err)
  redisClient = null
}
const emailRateMap = new Map<string, { count: number; firstTs: number }>()
const EMAIL_RATE_LIMIT = Number(process.env.EMAIL_RATE_LIMIT ?? 5) // max sends
const EMAIL_RATE_WINDOW_MS = Number(process.env.EMAIL_RATE_WINDOW_MS ?? 1000 * 60 * 60) // default 1 hour

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When the user logs in for the first time in a session
      if (user) {
        // Ensure token.sub is the user id
        // @ts-ignore - NextAuth user type is generic
        token.sub = user.id;
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Expose userId on the session for server routes
        // @ts-ignore - we are extending the session user type
        session.user.id = token.sub;
      }
      return session
    },
  },
}

// Providers including EmailProvider with a custom sendVerificationRequest
;(authOptions as any).providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID ?? "",
    clientSecret: process.env.GITHUB_SECRET ?? "",
  }),
  EmailProvider({
    server: process.env.EMAIL_SERVER ?? undefined,
    from: process.env.EMAIL_FROM ?? process.env.SMTP_FROM ?? "no-reply@opsvantagedigital.online",
    // Custom sender for magic links with lightweight rate-limiting and branded templates
    async sendVerificationRequest({ identifier, url, provider, token }: any) {
      try {
        const email = identifier

        // rate limit: try Redis, otherwise fallback to in-memory map
        if (redisClient) {
          try {
            const key = `email:verify:${email}`
            const count = await redisClient.incr(key)
            if (count === 1) {
              await redisClient.pexpire(key, EMAIL_RATE_WINDOW_MS)
            }
            if (count > EMAIL_RATE_LIMIT) {
              console.warn(`Rate limit hit for ${email} (redis)`)
              return
            }
          } catch (err) {
            console.warn("Redis rate limiter failed, falling back to memory", err)
          }
        } else {
          const now = Date.now()
          const entry = emailRateMap.get(email)
          if (!entry) {
            emailRateMap.set(email, { count: 1, firstTs: now })
          } else {
            if (now - entry.firstTs > EMAIL_RATE_WINDOW_MS) {
              emailRateMap.set(email, { count: 1, firstTs: now })
            } else {
              entry.count += 1
              if (entry.count > EMAIL_RATE_LIMIT) {
                // too many sends — skip sending to prevent spam
                console.warn(`Rate limit hit for ${email}`)
                return
              }
              emailRateMap.set(email, entry)
            }
          }
        }

        // Build transporter: prefer EMAIL_SERVER (smtp url) but fall back to SMTP_* vars
        let transporter
        if (process.env.EMAIL_SERVER) {
          transporter = nodemailer.createTransport(process.env.EMAIL_SERVER)
        } else if (process.env.SMTP_HOST) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: !!(process.env.SMTP_SECURE === "true"),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          })
        } else {
          // As a fallback, try direct send (may fail in many environments)
          transporter = nodemailer.createTransport({ jsonTransport: true })
        }

        const from = provider.from
        const site = process.env.NEXTAUTH_URL ?? new URL(url).origin

        // Branded HTML + text templates
        const text = `Sign in to OpsVantage\n\nClick this link to sign in:\n${url}\n\nIf you didn't request this, ignore this email.`

        const html = `
          <div style="font-family:system-ui,Arial,sans-serif;color:#0f172a">
            <div style="padding:24px;background:#081026;border-radius:8px;color:#e6eef6">
              <h2 style="margin:0 0 8px;font-weight:700">OpsVantage Digital</h2>
              <p style="margin:0 0 12px;color:#cfe9ff">Sign in to your workspace</p>
              <a href="${url}" style="display:inline-block;padding:10px 14px;border-radius:6px;background:#00A676;color:#041021;text-decoration:none;font-weight:600">Sign in</a>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin-top:12px">If you did not request this, you can safely ignore this email.</p>
            <p style="color:#64748b;font-size:12px;margin-top:8px">Sent from ${site}</p>
          </div>
        `

        await transporter.sendMail({
          to: email,
          from,
          subject: `Your OpsVantage sign-in link`,
          text,
          html,
        })
      } catch (err) {
        console.error("Error sending verification email", err)
      }
    },
  }),
]
