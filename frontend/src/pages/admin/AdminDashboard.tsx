import { useQuery } from '@tanstack/react-query'
import client from '../../api/client'
import { StatsCard } from '../../components/admin/StatsCard'
import { PageSpinner } from '../../components/ui/Spinner'

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => client.get('/admin/stats').then((r) => r.data.data),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Users"    value={data?.totalUsers    ?? 0} icon="👥" color="bg-blue-50" />
        <StatsCard label="Total Recipes"  value={data?.totalRecipes  ?? 0} icon="🍳" color="bg-green-50" />
        <StatsCard label="Total Reviews"  value={data?.totalReviews  ?? 0} icon="⭐" color="bg-yellow-50" />
        <StatsCard label="Active Today"   value={data?.activeToday   ?? 0} icon="📊" color="bg-purple-50" />
      </div>
      {data?.pendingReviews > 0 && (
        <div className="rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700">
          ⚠️ {data.pendingReviews} review{data.pendingReviews > 1 ? 's' : ''} pending approval
        </div>
      )}
    </div>
  )
}
