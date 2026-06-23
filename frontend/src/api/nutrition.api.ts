import client from './client'
import type { ApiResponse } from '../types/api.types'
import type { NutritionTip } from '../types/mealplan.types'

export interface NutritionLog {
  _id: string
  date: string
  meals: { recipeId: { title: string; thumbnail: string }; servings: number; calories: number; protein: number; carbs: number; fat: number }[]
  totals: { calories: number; protein: number; carbs: number; fat: number }
}

export const nutritionApi = {
  getToday: () =>
    client.get<ApiResponse<{ log: NutritionLog | null }>>('/nutrition/today'),

  getWeek: () =>
    client.get<ApiResponse<{ logs: NutritionLog[] }>>('/nutrition/week'),

  logMeal: (mealDbId: string, servings: number) =>
    client.post<ApiResponse<{ log: NutritionLog }>>('/nutrition/log', { mealDbId, servings }),

  getAITip: (goal?: string) =>
    client.get<ApiResponse<{ tips: NutritionTip[] }>>(`/nutrition/ai-tip${goal ? `?goal=${goal}` : ''}`),
}
