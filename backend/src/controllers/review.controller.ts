import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Review } from '../models/Review.model'
import { Recipe } from '../models/Recipe.model'
import { mealdbService } from '../services/mealdb.service'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

async function recalcRating(recipeId: mongoose.Types.ObjectId) {
  const stats = await Review.aggregate([
    { $match: { recipeId, isApproved: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  const avg = stats[0]?.avg ?? 0
  const count = stats[0]?.count ?? 0
  await Recipe.findByIdAndUpdate(recipeId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  })
}

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const recipe = await Recipe.findOne({ mealDbId: req.params.recipeId })
  if (!recipe) {
    return res.json(new ApiResponse(200, 'No reviews yet', { reviews: [], averageRating: 0 }))
  }

  const reviews = await Review.find({ recipeId: recipe._id, isApproved: true })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 })

  res.json(new ApiResponse(200, 'Reviews', { reviews, averageRating: recipe.averageRating, reviewCount: recipe.reviewCount }))
})

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body
  const mealDbId = req.params.recipeId

  let recipe = await Recipe.findOne({ mealDbId })
  if (!recipe) {
    const meal = await mealdbService.getById(mealDbId)
    if (!meal) throw new ApiError(404, 'Recipe not found')
    const parsed = mealdbService.parseMealDBMeal(meal)
    recipe = await Recipe.create(parsed)
  }

  const existing = await Review.findOne({ userId: req.user!._id, recipeId: recipe._id })
  if (existing) throw new ApiError(409, 'You have already reviewed this recipe')

  const review = await Review.create({ userId: req.user!._id, recipeId: recipe._id, rating, comment })
  await recalcRating(recipe._id as mongoose.Types.ObjectId)

  res.status(201).json(new ApiResponse(201, 'Review submitted', { review }))
})

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.reviewId)
  if (!review) throw new ApiError(404, 'Review not found')
  if (review.userId.toString() !== req.user!._id.toString()) throw new ApiError(403, 'Not your review')

  review.rating = req.body.rating
  review.comment = req.body.comment
  await review.save()
  await recalcRating(review.recipeId as mongoose.Types.ObjectId)

  res.json(new ApiResponse(200, 'Review updated', { review }))
})

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.reviewId)
  if (!review) throw new ApiError(404, 'Review not found')

  const isOwner = review.userId.toString() === req.user!._id.toString()
  const isAdmin = req.user!.role === 'admin'
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorised')

  await review.deleteOne()
  await recalcRating(review.recipeId as mongoose.Types.ObjectId)

  res.json(new ApiResponse(200, 'Review deleted'))
})
