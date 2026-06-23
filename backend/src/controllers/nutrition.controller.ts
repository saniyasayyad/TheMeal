import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { NutritionLog } from '../models/NutritionLog.model'
import { Recipe } from '../models/Recipe.model'
import { geminiService } from '../services/gemini.service'
import { nutritionService } from '../services/nutrition.service'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getTodayLog = asyncHandler(async (req: Request, res: Response) => {
  const today = startOfDay()
  const log = await NutritionLog.findOne({ userId: req.user!._id, date: today })
    .populate('meals.recipeId', 'title thumbnail')
  res.json(new ApiResponse(200, "Today's nutrition", { log }))
})

export const getWeekLogs = asyncHandler(async (req: Request, res: Response) => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const logs = await NutritionLog.find({
    userId: req.user!._id,
    date: { $gte: sevenDaysAgo },
  }).sort({ date: 1 })

  res.json(new ApiResponse(200, 'Weekly nutrition', { logs }))
})

export const logMeal = asyncHandler(async (req: Request, res: Response) => {
  const { mealDbId, servings } = req.body
  if (!mealDbId || !servings) throw new ApiError(400, 'mealDbId and servings are required')

  const recipe = await Recipe.findOne({ mealDbId })
  if (!recipe) throw new ApiError(404, 'Recipe not found — view recipe details first to cache it')

  const scaled = nutritionService.scale(recipe.nutrition, Number(servings))
  const today = startOfDay()

  const mealEntry = {
    recipeId: recipe._id,
    servings: Number(servings),
    ...scaled,
  }

  const log = await NutritionLog.findOneAndUpdate(
    { userId: req.user!._id, date: today },
    {
      $push: { meals: mealEntry },
      $inc: {
        'totals.calories': scaled.calories,
        'totals.protein':  scaled.protein,
        'totals.carbs':    scaled.carbs,
        'totals.fat':      scaled.fat,
      },
    },
    { upsert: true, new: true }
  ).populate('meals.recipeId', 'title thumbnail')

  res.json(new ApiResponse(200, 'Meal logged', { log }))
})

export const getAITip = asyncHandler(async (req: Request, res: Response) => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const logs = await NutritionLog.find({ userId: req.user!._id, date: { $gte: sevenDaysAgo } })
  if (logs.length < 2) throw new ApiError(400, 'Log at least 2 days of meals to get AI tips')

  const weeklyData = logs.map((l) => l.totals)
  const goal = req.query.goal as string || 'healthy eating'

  const result = await geminiService.getNutritionTip(
    req.user!._id as mongoose.Types.ObjectId,
    weeklyData,
    goal
  )

  res.json(new ApiResponse(200, 'AI Nutrition tips', result))
})
