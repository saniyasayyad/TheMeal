import client from './client'
import type { Review } from '../types/review.types'
import type { ApiResponse } from '../types/api.types'

export const reviewsApi = {
  getByRecipe: (recipeId: string) =>
    client.get<ApiResponse<{ reviews: Review[]; averageRating: number; reviewCount: number }>>(`/reviews/${recipeId}`),

  create: (recipeId: string, rating: number, comment: string) =>
    client.post<ApiResponse<{ review: Review }>>(`/reviews/${recipeId}`, { rating, comment }),

  update: (reviewId: string, rating: number, comment: string) =>
    client.put<ApiResponse<{ review: Review }>>(`/reviews/${reviewId}`, { rating, comment }),

  delete: (reviewId: string) =>
    client.delete<ApiResponse<unknown>>(`/reviews/${reviewId}`),
}
