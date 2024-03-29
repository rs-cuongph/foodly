interface Room {
  id: string;
  room_id: string;
  name: string;
}
interface Creator {
  email: string;
  role: string;
  id: string;
}

export interface Order {
  deleted_at: string | null;
  content: string;
  room: Room;
  creator: Creator;
  quanlity: number;
  price: number;
  discount: number;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface CreateOrderI {
  room_id: string;
  content: string;
  quanlity: number;
  price: number;
  payment_method: string | null;
  coupon_code: string | null;
}

export interface EditOrderI {
  room_id: string;
  order_id: string;
  content: string;
  quanlity: number;
  price: number;
}

export interface ListOrderI {
  room_id: string;
  page: string | number;
  page_size: string | number;
  sort_by?: string;
  sort_type?: "DESC" | "ASC";
  keywords?: string;
  status: string[];
  search_by?: string | null;
}

export interface ListOrderResponseI {
  data: Order[];
  pagination: {
    page: number;
    total_record: number;
  };
}

export interface DeleteOrderI {
  room_id: string;
  order_id: string;
}

export interface ChangeStatusOrderI {
  room_id: string;
  order_id: string;
  payment_method?: string;
  coupon_code?: string | null;
}
