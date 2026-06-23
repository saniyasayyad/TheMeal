import { Request, Response } from 'express'
import { mealdbService } from '../services/mealdb.service'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

export const searchRecipes = asyncHandler(async (req: Request, res: Response) => {
  const ingredient = req.query.ingredient as string
  if (!ingredient) throw new ApiError(400, 'ingredient query parameter is required')

  const meals = await mealdbService.searchByIngredient(ingredient)
  res.json(new ApiResponse(200, 'Recipes found', { meals, count: meals.length }))
})

export const getRandomRecipes = asyncHandler(async (_req: Request, res: Response) => {
  const meals = await mealdbService.getRandom(10)
  res.json(new ApiResponse(200, 'Random recipes', { meals }))
})

export const getRecipeById = asyncHandler(async (req: Request, res: Response) => {
  const meal = await mealdbService.getById(req.params.id)
  if (!meal) throw new ApiError(404, 'Recipe not found')
  res.json(new ApiResponse(200, 'Recipe details', { meal }))
})

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await mealdbService.getCategories()
  res.json(new ApiResponse(200, 'Categories', { categories }))
})
