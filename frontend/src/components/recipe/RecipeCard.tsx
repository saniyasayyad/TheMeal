import { MealDBMeal } from '../../types/recipe.types'
import { useToggleFavourite } from '../../hooks/useFavourites'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../ui/Badge'
import { StarRating } from '../ui/StarRating'

interface Props {
  meal: MealDBMeal
  onClick: () => void
  avgRating?: number
}

export function RecipeCard({ meal, onClick, avgRating = 0 }: Props) {
  const { user } = useAuth()
  const { toggle, isFavourited } = useToggleFavourite()
  const faved = isFavourited(meal.idMeal)

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {user && (
          <button
            onClick={(e) => { e.stopPropagation(); toggle(meal.idMeal) }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow transition hover:scale-110"
            aria-label={faved ? 'Remove from favourites' : 'Add to favourites'}
          >
            {faved ? '❤️' : '🤍'}
          </button>
        )}
        {meal.strCategory && (
          <div className="absolute bottom-2 left-2">
            <Badge color="blue">{meal.strCategory}</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug">{meal.strMeal}</h3>
        <div className="mt-2 flex items-center justify-between">
          {avgRating > 0 ? (
            <StarRating value={Math.round(avgRating)} size="sm" />
          ) : (
            <span className="text-xs text-gray-400">{meal.strArea || 'International'}</span>
          )}
        </div>
      </div>
    </div>
  )
}
