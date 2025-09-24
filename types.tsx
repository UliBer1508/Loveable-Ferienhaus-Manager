export interface Provider {
  id: string
  name: string
  service_type: string
  email?: string
  phone?: string
  is_active?: boolean
  has_portal?: boolean
}

export interface ServiceTask {
  id: string
  status: string
  scheduled_time?: string
  scheduled_date?: string
  provider_id?: string
  house_id?: string
  booking_id?: string
  houses?: {
    id?: string
    name: string
    address?: string
    city?: string
    postal_code?: string
  }
  bookings?: {
    id?: string
    check_in: string
    check_out: string
    guest_name?: string
    guest_count?: number
    house_id?: string
  }
}

export interface LinenOrder {
  id: string
  status: string
  provider_id?: string
  house_id?: string
  booking_id?: string
  order_date?: string
  delivery_date?: string
  items?: string[]
}

export interface Booking {
  id: string
  check_in: string
  check_out: string
  guest_name?: string
  guest_count?: number
  house_id?: string
  status?: string
}

export interface House {
  id: string
  name: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}
