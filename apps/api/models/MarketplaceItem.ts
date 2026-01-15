export interface MarketplaceItem {
  id: string
  name: string
  creatorId: string
  type: 'template' | 'voice_pack' | 'lut' | 'motion_preset'
  price: number
  description: string
  revenueShare: number
}

export const MarketplaceItemStore: MarketplaceItem[] = []
