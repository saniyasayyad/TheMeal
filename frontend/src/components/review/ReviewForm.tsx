import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviews.api'
import { StarRating } from '../ui/StarRating'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

interface Props {
  recipeId: string
  onSuccess: () => void
}

export function ReviewForm({ recipeId, onSuccess }: Props) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const mutation = useMutation({
    mutationFn: () => reviewsApi.create(recipeId, rating, comment),
    onSuccess: () => { toast.success('Review submitted!'); onSuccess() },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to submit review'),
  })

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Your rating</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        maxLength={1000}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          isLoading={mutation.isPending}
          disabled={rating === 0}
          onClick={() => mutation.mutate()}
        >
          Submit Review
        </Button>
      </div>
    </div>
  )
}
