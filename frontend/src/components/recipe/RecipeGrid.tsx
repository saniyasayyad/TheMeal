import { MealDBMeal } from '../../types/recipe.types'
import { RecipeCard } from './RecipeCard'
import { PageSpinner } from '../ui/Spinner'

interface Props {
  meals: MealDBMeal[]
  isLoading: boolean
  onCardClick: (meal: MealDBMeal) => void
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

export function RecipeGrid({ meals, isLoading, onCardClick }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="text-6xl mb-4">🍽️</div>
        <p className="text-lg font-medium">No recipes found</p>
        <p className="text-sm">Try a different ingredient</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {meals.map((meal) => (
        <RecipeCard key={meal.idMeal} meal={meal} onClick={() => onCardClick(meal)} />
      ))}
    </div>
  )
}
