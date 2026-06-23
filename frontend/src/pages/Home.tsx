import { useState } from 'react'
import { SearchBar } from '../components/recipe/SearchBar'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeModal } from '../components/recipe/RecipeModal'
import { RecommendationList } from '../components/ai/RecommendationList'
import { useRandomRecipes, useRecipeSearch } from '../hooks/useRecipes'
import { useAuth } from '../hooks/useAuth'
import type { MealDBMeal } from '../types/recipe.types'

export function Home() {
  const [query, setQuery] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<MealDBMeal | null>(null)
  const { user } = useAuth()

  const { data: randomMeals = [], isLoading: randomLoading } = useRandomRecipes()
  const { data: searchMeals = [], isLoading: searchLoading } = useRecipeSearch(query)

  const meals = query.length > 1 ? searchMeals : randomMeals
  const isLoading = query.length > 1 ? searchLoading : randomLoading

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Discover Your Next <span className="text-brand-500">Favourite Recipe</span>
        </h1>
        <p className="text-gray-500 max-w-md">Search by ingredient, explore AI picks, and plan your entire week.</p>
        <SearchBar onSearch={setQuery} />
      </div>

      {user && !query && <RecommendationList onCardClick={(meal) => meal && setSelectedMeal(meal as unknown as MealDBMeal)} />}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {query ? `Results for "${query}"` : '✨ Today\'s Picks'}
        </h2>
        <RecipeGrid meals={meals} isLoading={isLoading} onCardClick={setSelectedMeal} />
      </div>

      <RecipeModal meal={selectedMeal} isOpen={!!selectedMeal} onClose={() => setSelectedMeal(null)} />
    </main>
  )
}
