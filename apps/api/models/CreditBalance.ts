export interface CreditBalance {
  id: string
  userId: string
  balance: number
  updatedAt: string
}

export const CreditBalanceStore: CreditBalance[] = []
