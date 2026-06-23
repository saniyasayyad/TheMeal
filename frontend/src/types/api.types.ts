export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pages: number
}
