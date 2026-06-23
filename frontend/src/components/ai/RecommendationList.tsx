import { useAIRecommendations } from '../../hooks/useAI'
import { Badge } from '../ui/Badge'
import { PageSpinner } from '../ui/Spinner'
import type { AIRecommendation } from '../../types/mealplan.types'

interface Props {
  onCardClick: (meal: AIRecommendation['meal']) => void
}

export function RecommendationList({ onCardClick }: Props) {
  const { data, isLoading, error } = useAIRecommendations()

  if (isLoading) return <PageSpinner />
  if (error) return <p className="text-red-500 text-sm">Failed to load AI recommendations</p>
  if (!data?.length) return null

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Picks For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((rec) => (
          <div
            key={rec.mealName}
            className="rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition cursor-pointer p-4"
            onClick={() => rec.meal && onCardClick(rec.meal)}
          >
            {rec.meal && (
              <img src={rec.meal.strMealThumb} alt={rec.meal.strMeal}
                   className="w-full h-36 object-cover rounded-xl mb-3" />
            )}
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">{rec.mealName}</p>
              <Badge color="purple">AI</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500 line-clamp-2">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
