import { DeployMetadataStore } from '../../models/DeployMetadata.js'
import { logAuditEvent } from '../../utils/logAuditEvent.js'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end()
  const { userId, branch, environment, status, commitMessage, timestamp } = req.body
  if (!userId || !branch || !environment || !status || !commitMessage || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  const metadata = { branch, environment, status, commitMessage, timestamp }
  DeployMetadataStore.push({
    id: `${userId}-${timestamp}`,
    userId,
    branch,
    environment,
    status,
    commitMessage,
    timestamp,
  })
  await logAuditEvent(userId, 'deploy', metadata)
  res.status(200).json({ success: true })
}
