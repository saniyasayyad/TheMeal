interface Props {
  label: string
  value: number | string
  icon: string
  color: string
}

export function StatsCard({ label, value, icon, color }: Props) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border p-6 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
