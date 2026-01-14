import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const SERVICE_TOKEN = process.env.TEST_SERVICE_TOKEN
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

function base64url(input: Buffer | string) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function signHS256(message: string, secret: string) {
  return base64url(crypto.createHmac('sha256', secret).update(message).digest())
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  // Diagnostic logging helper
  function log(label: string, value: any) {
    try {
      console.error(`[pages-dev-session] ${label}:`, value)
    } catch (e) {
      // noop
    }
  }

  let body: Record<string, any> | null = null
  try {
    body = req.body || {}
    log('incoming body', body)
  } catch (err) {
    log('body parse error', String(err))
  }

  const serviceToken = body?.serviceToken
  const userId = body?.userId
  const email = body?.email
  const name = body?.name
  const globalRole = body?.globalRole
  const activeOrgId = body?.activeOrgId
  const activeWorkspaceId = body?.activeWorkspaceId

  log('NEXTAUTH_SECRET exists', !!process.env.NEXTAUTH_SECRET)
  log('TEST_SERVICE_TOKEN exists', !!process.env.TEST_SERVICE_TOKEN)

  if (!SERVICE_TOKEN) {
    log('missing TEST_SERVICE_TOKEN', 'undefined')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  if (!serviceToken || serviceToken !== SERVICE_TOKEN) {
    log('invalid service token', serviceToken)
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (!NEXTAUTH_SECRET) {
    log('missing NEXTAUTH_SECRET', 'undefined')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  if (!userId || !email) {
    log('missing userId/email', { userId, email })
    return res.status(400).json({ error: 'Missing required fields: userId, email' })
  }

  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 4 // 4 hours

  const header = { alg: 'HS256', typ: 'JWT' }
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
  }

  let token: string
  try {
    const encodedHeader = base64url(JSON.stringify(header))
    const encodedPayload = base64url(JSON.stringify(payload))
    const signingInput = `${encodedHeader}.${encodedPayload}`
    const signature = signHS256(signingInput, NEXTAUTH_SECRET as string)
    token = `${signingInput}.${signature}`
    log('jwt signed', { jti: payload.jti })
  } catch (err) {
    log('jwt sign error', String(err))
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  const maxAge = 60 * 60 * 4
  const cookie = `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`

  try {
    res.setHeader('Set-Cookie', cookie)
    log('set-cookie', 'written')
  } catch (err) {
    log('cookie set error', String(err))
  }

  res.status(200).json({ success: true })
}
