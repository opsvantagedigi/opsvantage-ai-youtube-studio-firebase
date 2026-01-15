export interface AuditLog {
  id: string
  userId: string
  action: string
  metadata?: Record<string, any>
  timestamp: string
}

export const AuditLogStore: AuditLog[] = []
