import { User } from './user.types'

export interface Review {
  _id: string
  userId: Pick<User, '_id' | 'name' | 'avatar'>
  recipeId: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
}
