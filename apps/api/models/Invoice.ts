export interface Invoice {
  id: string
  userId: string
  amount: number
  status: 'pending' | 'paid' | 'failed'
  createdAt: string
  paidAt?: string
  plan?: string
}

export const InvoiceStore: Invoice[] = []
