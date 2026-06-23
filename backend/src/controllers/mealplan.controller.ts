import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { MealPlan } from '../models/MealPlan.model'
import { Recipe } from '../models/Recipe.model'
import { geminiService } from '../services/gemini.service'
import { mealdbService } from '../services/mealdb.service'
import { nutritionService } from '../services/nutrition.service'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

async function findOrCreateRecipe(mealName: string) {
  try {
    const results = await mealdbService.searchByIngredient(mealName.split(' ')[0])
    const match = results.find((m) =>
      m.strMeal.toLowerCase().includes(mealName.toLowerCase().split(' ')[0])
    )
    if (!match) return null

    const meal = await mealdbService.getById(match.idMeal)
    if (!meal) return null

    let recipe = await Recipe.findOne({ mealDbId: meal.idMeal })
    if (!recipe) {
      const parsed = mealdbService.parseMealDBMeal(meal)
      const nutrition = nutritionService.estimate(parsed.ingredients)
      recipe = await Recipe.create({ ...parsed, nutrition })
    }
    return recipe
  } catch {
    return null
  }
}

export const getMealPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await MealPlan.find({ userId: req.user!._id })
    .populate('days.breakfast days.lunch days.dinner')
    .sort({ createdAt: -1 })
  res.json(new ApiResponse(200, 'Meal plans', { plans }))
})

export const generateAIMealPlan = asyncHandler(async (req: Request, res: Response) => {
  const { goal, calorieTarget, restrictions } = req.body

  const aiPlan = await geminiService.generateMealPlan(
    req.user!._id as mongoose.Types.ObjectId,
    { goal, calorieTarget: Number(calorieTarget), restrictions: restrictions || [] }
  )

  const days = await Promise.all(
    aiPlan.days.map(async (day) => {
      const [breakfast, lunch, dinner] = await Promise.all([
        findOrCreateRecipe(day.breakfast.mealName),
        findOrCreateRecipe(day.lunch.mealName),
        findOrCreateRecipe(day.dinner.mealName),
      ])
      return {
        dayName: day.dayName,
        breakfast: breakfast?._id,
        lunch: lunch?._id,
        dinner: dinner?._id,
      }
    })
  )

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)

  const plan = await MealPlan.create({
    userId: req.user!._id,
    title: aiPlan.planTitle,
    weekStartDate: weekStart,
    days,
    aiGenerated: true,
    aiPrompt: `Goal: ${goal}, Calories: ${calorieTarget}, Restrictions: ${restrictions?.join(', ')}`,
  })

  const populated = await plan.populate('days.breakfast days.lunch days.dinner')
  res.status(201).json(new ApiResponse(201, 'AI Meal plan generated', { plan: populated, aiPlan }))
})

export const saveMealPlan = asyncHandler(async (req: Request, res: Response) => {
  const { title, weekStartDate, days } = req.body
  const plan = await MealPlan.create({ userId: req.user!._id, title, weekStartDate, days })
  res.status(201).json(new ApiResponse(201, 'Meal plan saved', { plan }))
})

export const deleteMealPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
  if (!plan) throw new ApiError(404, 'Meal plan not found')
  res.json(new ApiResponse(200, 'Meal plan deleted'))
})
