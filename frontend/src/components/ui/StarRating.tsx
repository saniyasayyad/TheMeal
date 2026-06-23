interface Props {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md'
}

export function StarRating({ value, onChange, size = 'md' }: Props) {
  const sz = size === 'sm' ? 'text-base' : 'text-2xl'
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`transition-transform ${onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
