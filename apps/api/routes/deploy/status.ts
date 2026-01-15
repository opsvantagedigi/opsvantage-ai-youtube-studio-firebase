import { DeployMetadataStore } from '../../models/DeployMetadata.js'

export default function handler(req: any, res: any) {
  const latest =
    DeployMetadataStore.length > 0 ? DeployMetadataStore[DeployMetadataStore.length - 1] : null
  if (!latest) {
    return res.status(200).json({ status: 'live' })
  }
  let status = latest.status
  if (!['live', 'deploying', 'failed'].includes(status)) status = 'live'
  res.status(200).json({
    status,
    timestamp: latest.timestamp,
    branch: latest.branch,
    commitMessage: latest.commitMessage,
  })
}
