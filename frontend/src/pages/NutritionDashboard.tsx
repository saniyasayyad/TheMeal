import { useQuery } from '@tanstack/react-query'
import { nutritionApi } from '../api/nutrition.api'
import { MacroBar } from '../components/nutrition/MacroBar'
import { NutritionChart } from '../components/nutrition/NutritionChart'
import { PageSpinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { useNutritionTips } from '../hooks/useAI'

const EMPTY = { calories: 0, protein: 0, carbs: 0, fat: 0 }

export function NutritionDashboard() {
  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ['nutrition', 'today'],
    queryFn: () => nutritionApi.getToday().then((r) => r.data.data?.log),
  })

  const { data: weekLogs = [], isLoading: weekLoading } = useQuery({
    queryKey: ['nutrition', 'week'],
    queryFn: () => nutritionApi.getWeek().then((r) => r.data.data?.logs ?? []),
  })

  const { data: tips = [] } = useNutritionTips()

  if (todayLoading || weekLoading) return <PageSpinner />

  const today = todayData?.totals ?? EMPTY

  const chartData = weekLogs.map((log) => ({
    date: log.date,
    ...log.totals,
  }))

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Nutrition Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Today's Macros</h2>
          <MacroBar {...today} />
        </div>

        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">7-Day Calorie Trend</h2>
          {chartData.length > 0 ? <NutritionChart data={chartData} /> : (
            <p className="text-sm text-gray-400 text-center py-8">Log meals for 2+ days to see trends</p>
          )}
        </div>
      </div>

      {todayData?.meals && todayData.meals.length > 0 && (
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Today's Logged Meals</h2>
          <div className="space-y-3">
            {todayData.meals.map((meal, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={meal.recipeId.thumbnail} alt={meal.recipeId.title} className="h-12 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{meal.recipeId.title}</p>
                  <p className="text-xs text-gray-400">{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{meal.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tips.length > 0 && (
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">🤖 AI Nutrition Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color={tip.priority === 'high' ? 'red' : tip.priority === 'medium' ? 'yellow' : 'green'}>
                    {tip.priority}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-gray-900">{tip.title}</p>
                <p className="text-xs text-gray-600 mt-1">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
