import { Router } from 'express'
import { searchRecipes, getRandomRecipes, getRecipeById, getCategories } from '../controllers/recipe.controller'

const router = Router()

router.get('/search',     searchRecipes)
router.get('/random',     getRandomRecipes)
router.get('/categories', getCategories)
router.get('/:id',        getRecipeById)

export default router
