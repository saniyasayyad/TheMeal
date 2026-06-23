import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../../api/client'
import { PageSpinner } from '../../components/ui/Spinner'
import { StarRating } from '../../components/ui/StarRating'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'

export function AdminReviews() {
  const qc = useQueryClient()

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin', 'reviews', 'pending'],
    queryFn: () => client.get('/admin/reviews/pending').then((r) => r.data.data.reviews),
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => client.put(`/admin/reviews/${id}/approve`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }); toast.success('Review approved') },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => client.delete(`/admin/reviews/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }); toast.success('Review deleted') },
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Pending Reviews ({reviews.length})</h1>

      {reviews.length === 0 ? (
        <div className="rounded-2xl bg-white border shadow-sm p-12 text-center text-gray-400">
          ✅ All caught up — no pending reviews
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <div key={r._id} className="rounded-2xl bg-white border shadow-sm p-4 flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{r.userId?.name}</span>
                  <span className="text-xs text-gray-400">on {r.recipeId?.title}</span>
                </div>
                <StarRating value={r.rating} size="sm" />
                {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => approveMutation.mutate(r._id)} isLoading={approveMutation.isPending}>
                  Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(r._id)} isLoading={deleteMutation.isPending}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
