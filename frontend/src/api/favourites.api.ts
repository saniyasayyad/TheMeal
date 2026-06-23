import client from './client'
import type { ApiResponse } from '../types/api.types'

export const favouritesApi = {
  getAll: () => client.get<ApiResponse<{ favourites: { recipeId: { mealDbId: string; title: string; thumbnail: string }; savedAt: string; _id: string }[] }>>('/favourites'),

  add: (mealDbId: string) =>
    client.post<ApiResponse<unknown>>('/favourites', { mealDbId }),

  remove: (mealDbId: string) =>
    client.delete<ApiResponse<unknown>>(`/favourites/${mealDbId}`),
}
