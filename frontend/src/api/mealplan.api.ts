import client from './client'
import type { MealPlan, MealPlanRequest } from '../types/mealplan.types'
import type { ApiResponse } from '../types/api.types'

export const mealplanApi = {
  getAll: () =>
    client.get<ApiResponse<{ plans: MealPlan[] }>>('/mealplan'),

  generate: (req: MealPlanRequest) =>
    client.post<ApiResponse<{ plan: MealPlan }>>('/mealplan/generate', req),

  delete: (id: string) =>
    client.delete<ApiResponse<unknown>>(`/mealplan/${id}`),
}
