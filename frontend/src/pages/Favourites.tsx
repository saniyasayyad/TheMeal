import { useState } from 'react'
import { useFavourites } from '../hooks/useFavourites'
import { RecipeModal } from '../components/recipe/RecipeModal'
import { PageSpinner } from '../components/ui/Spinner'
import type { MealDBMeal } from '../types/recipe.types'

export function Favourites() {
  const { data: favs = [], isLoading } = useFavourites()
  const [selected, setSelected] = useState<MealDBMeal | null>(null)

  if (isLoading) return <PageSpinner />

  if (favs.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-xl font-semibold text-gray-900">No favourites yet</h2>
        <p className="text-gray-500 mt-2">Heart any recipe to save it here.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Favourites ({favs.length})</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favs.map((fav) => {
          const r = fav.recipeId
          return (
            <div
              key={fav._id}
              className="cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl transition overflow-hidden"
              onClick={() => setSelected({ idMeal: r.mealDbId, strMeal: r.title, strMealThumb: r.thumbnail } as MealDBMeal)}
            >
              <img src={r.thumbnail} alt={r.title} className="h-40 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{r.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <RecipeModal meal={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
    </main>
  )
}
