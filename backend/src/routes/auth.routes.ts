import { Router } from 'express'
import { signup, login, logout, refreshToken, getMe, updatePreferences } from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { authLimiter } from '../middleware/rateLimit.middleware'
import { signupValidator, loginValidator, updatePreferencesValidator } from '../validators/auth.validator'

const router = Router()

router.post('/signup', authLimiter, signupValidator, validate, signup)
router.post('/login',  authLimiter, loginValidator,  validate, login)
router.post('/logout', protect, logout)
router.post('/refresh-token', refreshToken)
router.get('/me', protect, getMe)
router.put('/preferences', protect, updatePreferencesValidator, validate, updatePreferences)

export default router
