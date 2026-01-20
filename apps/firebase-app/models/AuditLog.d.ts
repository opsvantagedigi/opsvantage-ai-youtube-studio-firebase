export interface AuditLog {
  id: string
  userId: string
  action: string
  metadata?: Record<string, any>
  timestamp: string
}
export declare const AuditLogStore: AuditLog[]
//# sourceMappingURL=AuditLog.d.ts.map
