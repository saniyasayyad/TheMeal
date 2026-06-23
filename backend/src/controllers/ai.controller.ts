import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { geminiService } from '../services/gemini.service'
import { mealdbService } from '../services/mealdb.service'
import { Recipe } from '../models/Recipe.model'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { asyncHandler } from '../utils/asyncHandler'

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const prefs = req.user!.preferences
  const suggestions = await geminiService.getRecommendations(
    req.user!._id as mongoose.Types.ObjectId,
    prefs
  )

  const enriched = await Promise.all(
    suggestions.map(async (s) => {
      try {
        const results = await mealdbService.searchByIngredient(s.mealName.split(' ')[0])
        const match = results.find((m) =>
          m.strMeal.toLowerCase().includes(s.mealName.toLowerCase().split(' ')[0])
        )
        return { ...s, meal: match || null }
      } catch {
        return { ...s, meal: null }
      }
    })
  )

  res.json(new ApiResponse(200, 'AI Recommendations', { recommendations: enriched }))
})

export const getRecipeSummary = asyncHandler(async (req: Request, res: Response) => {
  const { recipeId } = req.params
  const recipe = await Recipe.findOne({ mealDbId: recipeId })
  if (!recipe) throw new ApiError(404, 'Recipe not cached yet — view recipe details first')

  if (recipe.aiSummary) {
    return res.json(new ApiResponse(200, 'AI Summary (cached)', { summary: recipe.aiSummary }))
  }

  const ingredientNames = recipe.ingredients.map((i) => i.name)
  const summary = await geminiService.summariseRecipe(
    req.user!._id as mongoose.Types.ObjectId,
    recipe.title,
    ingredientNames
  )

  await Recipe.findByIdAndUpdate(recipe._id, { aiSummary: summary })
  res.json(new ApiResponse(200, 'AI Summary', { summary }))
})
