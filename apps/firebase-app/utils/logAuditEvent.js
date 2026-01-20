import { AuditLogStore } from '@/models/AuditLog'
export async function logAuditEvent(userId, action, metadata = {}) {
  AuditLogStore.push({
    id: `${userId}-${Date.now()}`,
    userId,
    action,
    metadata,
    timestamp: Date.now(),
  })
}
//# sourceMappingURL=logAuditEvent.js.map
