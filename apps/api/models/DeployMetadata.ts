export interface DeployMetadata {
  id: string
  userId: string
  branch: string
  environment: string
  timestamp: string
  status: string
  commitMessage: string
}

export const DeployMetadataStore: DeployMetadata[] = []
