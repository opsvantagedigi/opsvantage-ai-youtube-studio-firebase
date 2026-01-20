export interface Purchase {
  id: string
  userId: string
  itemId: string
  type: 'addon' | 'marketplace' | 'credit' | 'subscription'
  amount: number
  timestamp: string
}
export declare const PurchaseStore: Purchase[]
//# sourceMappingURL=Purchase.d.ts.map
