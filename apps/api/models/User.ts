export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
  teamId?: string
  role: string
  subscriptionId?: string
}

// Temporary JSON adapter
export const UserStore: User[] = []
