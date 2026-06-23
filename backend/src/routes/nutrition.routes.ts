import { Router } from 'express'
import { getTodayLog, getWeekLogs, logMeal, getAITip } from '../controllers/nutrition.controller'
import { protect } from '../middleware/auth.middleware'
import { aiLimiter } from '../middleware/rateLimit.middleware'

const router = Router()

router.use(protect)
router.get('/today',  getTodayLog)
router.get('/week',   getWeekLogs)
router.post('/log',   logMeal)
router.get('/ai-tip', aiLimiter, getAITip)

export default router
