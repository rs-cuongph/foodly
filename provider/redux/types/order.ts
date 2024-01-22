export interface CreateOrderI {
  room_id: string
  content: string
  quanlity: number
  price: number
  payment_method: string
  coupon_code: string | null
}