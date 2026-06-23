import { Recipe } from './recipe.types'

export interface DayMeals {
  dayName: string
  breakfast?: Recipe
  lunch?: Recipe
  dinner?: Recipe
}

export interface MealPlan {
  _id: string
  userId: string
  title: string
  weekStartDate: string
  days: DayMeals[]
  aiGenerated: boolean
  aiPrompt?: string
  createdAt: string
}

export interface MealPlanRequest {
  goal: string
  calorieTarget: number
  restrictions: string[]
}

export interface AIRecommendation {
  mealName: string
  reason: string
  cuisine: string
  tags: string[]
  meal: {
    idMeal: string
    strMeal: string
    strMealThumb: string
  } | null
}

export interface NutritionTip {
  title: string
  body: string
  priority: 'high' | 'medium' | 'low'
}
