export interface Team {
  id: string
  name: string
  ownerId: string
  createdAt: string
  members: string[]
}

export const TeamStore: Team[] = []
