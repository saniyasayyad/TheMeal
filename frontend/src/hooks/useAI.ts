import { useQuery, useMutation } from '@tanstack/react-query'
import { aiApi } from '../api/ai.api'
import { mealplanApi } from '../api/mealplan.api'
import { nutritionApi } from '../api/nutrition.api'
import type { MealPlanRequest } from '../types/mealplan.types'
import toast from 'react-hot-toast'

export function useAIRecommendations() {
  return useQuery({
    queryKey: ['ai', 'recommendations'],
    queryFn: () => aiApi.getRecommendations().then((r) => r.data.data?.recommendations ?? []),
    staleTime: 10 * 60 * 1000,
  })
}

export function useGenerateMealPlan() {
  return useMutation({
    mutationFn: (req: MealPlanRequest) => mealplanApi.generate(req).then((r) => r.data.data?.plan),
    onSuccess: () => toast.success('Meal plan generated!'),
    onError: () => toast.error('Failed to generate meal plan'),
  })
}

export function useNutritionTips(goal?: string) {
  return useQuery({
    queryKey: ['ai', 'nutrition-tips', goal],
    queryFn: () => nutritionApi.getAITip(goal).then((r) => r.data.data?.tips ?? []),
    staleTime: 30 * 60 * 1000,
    retry: false,
  })
}
