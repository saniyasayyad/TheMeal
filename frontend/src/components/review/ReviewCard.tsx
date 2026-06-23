import { Review } from '../../types/review.types'
import { StarRating } from '../ui/StarRating'

interface Props { review: Review }

export function ReviewCard({ review }: Props) {
  const initials = review.userId.name?.charAt(0).toUpperCase() || '?'
  const date = new Date(review.createdAt).toLocaleDateString()

  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      <div className="h-9 w-9 shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">{review.userId.name}</span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <StarRating value={review.rating} size="sm" />
        {review.comment && <p className="mt-1 text-sm text-gray-600">{review.comment}</p>}
      </div>
    </div>
  )
}
