import client from './client'
import type { MealDBMeal } from '../types/recipe.types'
import type { ApiResponse } from '../types/api.types'

export const recipesApi = {
  search: (ingredient: string) =>
    client.get<ApiResponse<{ meals: MealDBMeal[]; count: number }>>(`/recipes/search?ingredient=${encodeURIComponent(ingredient)}`),

  getRandom: () =>
    client.get<ApiResponse<{ meals: MealDBMeal[] }>>('/recipes/random'),

  getById: (id: string) =>
    client.get<ApiResponse<{ meal: MealDBMeal }>>(`/recipes/${id}`),

  getCategories: () =>
    client.get<ApiResponse<{ categories: string[] }>>('/recipes/categories'),
}
