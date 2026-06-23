import { Router } from 'express'
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/review.controller'
import { protect } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { reviewValidator } from '../validators/review.validator'

const router = Router()

router.get('/:recipeId', getReviews)
router.post('/:recipeId', protect, reviewValidator, validate, createReview)
router.put('/:reviewId',  protect, reviewValidator, validate, updateReview)
router.delete('/:reviewId', protect, deleteReview)

export default router
