import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { ReviewForm } from '../review/ReviewForm'
import { ReviewCard } from '../review/ReviewCard'
import { MealDBMeal } from '../../types/recipe.types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviews.api'
import { nutritionApi } from '../../api/nutrition.api'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

interface Props {
  meal: MealDBMeal | null
  isOpen: boolean
  onClose: () => void
}

function parseIngredients(meal: MealDBMeal) {
  const list: { name: string; measure: string }[] = []
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (name) list.push({ name, measure: measure || '' })
  }
  return list
}

export function RecipeModal({ meal, isOpen, onClose }: Props) {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [servings, setServings] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', meal?.idMeal],
    queryFn: () => reviewsApi.getByRecipe(meal!.idMeal).then((r) => r.data.data),
    enabled: !!meal?.idMeal && isOpen,
  })

  const logMutation = useMutation({
    mutationFn: () => nutritionApi.logMeal(meal!.idMeal, servings),
    onSuccess: () => { toast.success('Meal logged to nutrition diary!'); qc.invalidateQueries({ queryKey: ['nutrition'] }) },
    onError: () => toast.error('Log the recipe detail page first to cache it'),
  })

  if (!meal) return null
  const ingredients = parseIngredients(meal)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meal.strMeal}>
      <div className="space-y-6">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full rounded-xl object-cover h-56" />

        <div className="flex flex-wrap gap-2">
          {meal.strCategory && <Badge color="blue">{meal.strCategory}</Badge>}
          {meal.strArea && <Badge color="purple">{meal.strArea}</Badge>}
          {meal.strTags?.split(',').map((t) => <Badge key={t}>{t.trim()}</Badge>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
            <ul className="space-y-1.5">
              {ingredients.map((ing) => (
                <li key={ing.name} className="flex justify-between text-sm">
                  <span className="text-gray-800">{ing.name}</span>
                  <span className="text-gray-500">{ing.measure}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line line-clamp-[12]">
              {meal.strInstructions}
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
            <span className="text-sm font-medium text-gray-700">Log to nutrition:</span>
            <select
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {[0.5, 1, 1.5, 2, 3].map((s) => <option key={s} value={s}>{s} serving{s !== 1 ? 's' : ''}</option>)}
            </select>
            <Button size="sm" isLoading={logMutation.isPending} onClick={() => logMutation.mutate()}>
              Log Meal
            </Button>
          </div>
        )}

        {meal.strYoutube && (
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition w-fit">
            ▶ Watch on YouTube
          </a>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Reviews {reviewData?.reviewCount ? `(${reviewData.reviewCount})` : ''}
            </h3>
            {user && !showReviewForm && (
              <Button size="sm" variant="secondary" onClick={() => setShowReviewForm(true)}>Write a review</Button>
            )}
          </div>

          {showReviewForm && (
            <ReviewForm
              recipeId={meal.idMeal}
              onSuccess={() => { setShowReviewForm(false); qc.invalidateQueries({ queryKey: ['reviews', meal.idMeal] }) }}
            />
          )}

          <div className="space-y-3 mt-3">
            {reviewData?.reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            {reviewData?.reviews.length === 0 && (
              <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
