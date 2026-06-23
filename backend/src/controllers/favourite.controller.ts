import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Favourite } from '../models/Favourite.model'
import { Recipe } from '../models/Recipe.model'
import { mealdbService } from '../services/mealdb.service'
import { nutritionService } from '../services/nutrition.service'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

export const getFavourites = asyncHandler(async (req: Request, res: Response) => {
  const favs = await Favourite.find({ userId: req.user!._id })
    .populate('recipeId')
    .sort({ savedAt: -1 })
  res.json(new ApiResponse(200, 'Favourites', { favourites: favs }))
})

export const addFavourite = asyncHandler(async (req: Request, res: Response) => {
  const { mealDbId } = req.body
  if (!mealDbId) throw new ApiError(400, 'mealDbId is required')

  let recipe = await Recipe.findOne({ mealDbId })
  if (!recipe) {
    const meal = await mealdbService.getById(mealDbId)
    if (!meal) throw new ApiError(404, 'Recipe not found in TheMealDB')
    const parsed = mealdbService.parseMealDBMeal(meal)
    const nutrition = nutritionService.estimate(parsed.ingredients)
    recipe = await Recipe.create({ ...parsed, nutrition })
  }

  const exists = await Favourite.findOne({ userId: req.user!._id, recipeId: recipe._id })
  if (exists) throw new ApiError(409, 'Already in favourites')

  const fav = await Favourite.create({ userId: req.user!._id, recipeId: recipe._id })
  res.status(201).json(new ApiResponse(201, 'Added to favourites', { favourite: fav }))
})

export const removeFavourite = asyncHandler(async (req: Request, res: Response) => {
  const recipe = await Recipe.findOne({ mealDbId: req.params.recipeId })
  if (!recipe) throw new ApiError(404, 'Recipe not found')

  const deleted = await Favourite.findOneAndDelete({
    userId: req.user!._id,
    recipeId: recipe._id,
  })
  if (!deleted) throw new ApiError(404, 'Favourite not found')

  res.json(new ApiResponse(200, 'Removed from favourites'))
})
