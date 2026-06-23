import { useState, ChangeEvent } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

interface Props {
  onSearch: (term: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = 'Search by ingredient...' }: Props) {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 400)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onSearch(debounced)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      <button
        type="submit"
        className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition"
      >
        Search
      </button>
    </form>
  )
}
