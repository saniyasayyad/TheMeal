import { Router } from 'express'
import { getRecommendations, getRecipeSummary } from '../controllers/ai.controller'
import { protect } from '../middleware/auth.middleware'
import { aiLimiter } from '../middleware/rateLimit.middleware'

const router = Router()

router.use(protect, aiLimiter)
router.get('/recommend',        getRecommendations)
router.get('/summary/:recipeId', getRecipeSummary)

export default router
