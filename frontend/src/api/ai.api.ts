import client from './client'
import type { AIRecommendation, NutritionTip } from '../types/mealplan.types'
import type { ApiResponse } from '../types/api.types'

export const aiApi = {
  getRecommendations: () =>
    client.get<ApiResponse<{ recommendations: AIRecommendation[] }>>('/ai/recommend'),

  getRecipeSummary: (recipeId: string) =>
    client.get<ApiResponse<{ summary: string }>>(`/ai/summary/${recipeId}`),
}
