export interface AddOn {
  id: string
  name: string
  description: string
  price: number
  type: 'voice' | 'template' | 'lut' | 'render_speed'
}

export const AddOnStore: AddOn[] = []
