import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DayData {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Props { data: DayData[] }

export function NutritionChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        <Line type="monotone" dataKey="calories" stroke="#ff6b6b" strokeWidth={2} dot={false} name="Calories" />
        <Line type="monotone" dataKey="protein"  stroke="#60a5fa" strokeWidth={2} dot={false} name="Protein (g)" />
        <Line type="monotone" dataKey="carbs"    stroke="#4ade80" strokeWidth={2} dot={false} name="Carbs (g)" />
        <Line type="monotone" dataKey="fat"      stroke="#facc15" strokeWidth={2} dot={false} name="Fat (g)" />
      </LineChart>
    </ResponsiveContainer>
  )
}
