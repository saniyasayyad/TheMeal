interface Props {
  calories: number
  protein: number
  carbs: number
  fat: number
  goal?: number
}

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-medium">{value}g</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function MacroBar({ calories, protein, carbs, fat, goal = 2000 }: Props) {
  const totalG = protein + carbs + fat || 1
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{calories}</span>
        <span className="text-sm text-gray-400">/ {goal} kcal</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
        <div className="bg-blue-400 h-full transition-all" style={{ width: `${(protein * 4 / Math.max(calories, 1)) * 100}%` }} />
        <div className="bg-green-400 h-full transition-all" style={{ width: `${(carbs * 4 / Math.max(calories, 1)) * 100}%` }} />
        <div className="bg-yellow-400 h-full transition-all" style={{ width: `${(fat * 9 / Math.max(calories, 1)) * 100}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Bar label="Protein" value={protein} total={totalG} color="bg-blue-400" />
        <Bar label="Carbs"   value={carbs}   total={totalG} color="bg-green-400" />
        <Bar label="Fat"     value={fat}      total={totalG} color="bg-yellow-400" />
      </div>
    </div>
  )
}
