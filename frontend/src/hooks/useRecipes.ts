import { useQuery } from '@tanstack/react-query'
import { recipesApi } from '../api/recipes.api'

export function useRandomRecipes() {
  return useQuery({
    queryKey: ['recipes', 'random'],
    queryFn: () => recipesApi.getRandom().then((r) => r.data.data?.meals ?? []),
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecipeSearch(ingredient: string) {
  return useQuery({
    queryKey: ['recipes', 'search', ingredient],
    queryFn: () => recipesApi.search(ingredient).then((r) => r.data.data?.meals ?? []),
    enabled: ingredient.length > 1,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecipeById(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipesApi.getById(id).then((r) => r.data.data?.meal ?? null),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => recipesApi.getCategories().then((r) => r.data.data?.categories ?? []),
    staleTime: 60 * 60 * 1000,
  })
}
