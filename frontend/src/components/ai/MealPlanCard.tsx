import { DayMeals } from '../../types/mealplan.types'

interface Props { day: DayMeals }

function MealRow({ label, recipe }: { label: string; recipe?: DayMeals['breakfast'] }) {
  if (!recipe) return null
  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <span className="w-20 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">{label}</span>
      <img src={recipe.thumbnail} alt={recipe.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
      <span className="text-sm text-gray-800 line-clamp-1">{recipe.title}</span>
    </div>
  )
}

export function MealPlanCard({ day }: Props) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-3">{day.dayName}</h3>
      <MealRow label="Breakfast" recipe={day.breakfast} />
      <MealRow label="Lunch"     recipe={day.lunch} />
      <MealRow label="Dinner"    recipe={day.dinner} />
    </div>
  )
}
