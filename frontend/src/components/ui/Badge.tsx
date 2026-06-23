import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray'
}

const colors = {
  red:    'bg-red-100 text-red-700',
  green:  'bg-green-100 text-green-700',
  blue:   'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
  gray:   'bg-gray-100 text-gray-700',
}

export function Badge({ children, color = 'gray' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
