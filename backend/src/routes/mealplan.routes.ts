import { Router } from 'express'
import { getMealPlans, generateAIMealPlan, saveMealPlan, deleteMealPlan } from '../controllers/mealplan.controller'
import { protect } from '../middleware/auth.middleware'
import { aiLimiter } from '../middleware/rateLimit.middleware'
import { validate } from '../middleware/validate.middleware'
import { mealPlanValidator } from '../validators/mealplan.validator'

const router = Router()

router.use(protect)
router.get('/',         getMealPlans)
router.post('/generate', aiLimiter, mealPlanValidator, validate, generateAIMealPlan)
router.post('/',        saveMealPlan)
router.delete('/:id',   deleteMealPlan)

export default router
