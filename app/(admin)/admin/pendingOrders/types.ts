import { OrderStatus } from '@prisma/client'

export interface Order {
  id: string
  referenceNumber: string | null
  firstName: string
  lastName: string
  companyName: string
  totalAmount: number
  status: OrderStatus
  createdAt: Date
}

export interface PendingOrdersData {
  orders: Order[]
  totalPages: number
}