import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'
import { Worker } from 'bullmq'
import { connection } from '../../packages/queue'
import { logUsageEvent } from '../../packages/common/logUsageEvent.js'

async function uploadToYouTube(job: any) {
  const { accessToken, refreshToken, title, description, filePath } = job.data

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    'postmessage',
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
  if (!fs.existsSync(resolvedPath)) throw new Error('File not found: ' + resolvedPath)

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: { title, description },
      status: { privacyStatus: 'public' },
    },
    media: {
      body: fs.createReadStream(resolvedPath) as any,
    },
  })

  // Log upload usage if we can identify a user
  try {
    const userId = job?.data?.userId || job?.data?.uploaderId || job?.data?.ownerId
    if (userId) {
      await logUsageEvent(userId, 'youtube_upload', 1)
      if (job?.data?.publish) {
        await logUsageEvent(userId, 'youtube_publish', 1)
      }
    }
  } catch {
    // best-effort logging; don't interrupt upload result
  }

  return res.data
}

new Worker(
  'youtube-publish',
  async (job) => {
    return await uploadToYouTube(job)
  },
  { connection: connection as any },
)

console.log('YouTube Worker is running...')
