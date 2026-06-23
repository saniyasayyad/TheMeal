import { Request, Response } from 'express'
import { User } from '../models/User.model'
import { Recipe } from '../models/Recipe.model'
import { Review } from '../models/Review.model'
import { NutritionLog } from '../models/NutritionLog.model'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, totalRecipes, totalReviews, pendingReviews] = await Promise.all([
    User.countDocuments(),
    Recipe.countDocuments(),
    Review.countDocuments(),
    Review.countDocuments({ isApproved: false }),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const activeToday = await NutritionLog.countDocuments({ date: { $gte: today } })

  res.json(new ApiResponse(200, 'Platform stats', {
    totalUsers, totalRecipes, totalReviews, pendingReviews, activeToday,
  }))
})

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page  = Number(req.query.page)  || 1
  const limit = Number(req.query.limit) || 20
  const search = req.query.search as string

  const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {}

  const [users, total] = await Promise.all([
    User.find(filter).select('-passwordHash -refreshToken').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ])

  res.json(new ApiResponse(200, 'Users', { users, total, page, pages: Math.ceil(total / limit) }))
})

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) throw new ApiError(400, 'Role must be user or admin')
  if (req.params.id === req.user!._id.toString()) throw new ApiError(400, 'Cannot change your own role')

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash')
  if (!user) throw new ApiError(404, 'User not found')

  res.json(new ApiResponse(200, 'Role updated', { user }))
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id === req.user!._id.toString()) throw new ApiError(400, 'Cannot delete yourself')

  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw new ApiError(404, 'User not found')

  res.json(new ApiResponse(200, 'User deleted'))
})

export const getPendingReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find({ isApproved: false })
    .populate('userId', 'name email')
    .populate('recipeId', 'title')
    .sort({ createdAt: -1 })
  res.json(new ApiResponse(200, 'Pending reviews', { reviews }))
})

export const approveReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true })
  if (!review) throw new ApiError(404, 'Review not found')
  res.json(new ApiResponse(200, 'Review approved', { review }))
})

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) throw new ApiError(404, 'Review not found')
  res.json(new ApiResponse(200, 'Review deleted'))
})
