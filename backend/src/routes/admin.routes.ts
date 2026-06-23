import { Router } from 'express'
import {
  getStats, getUsers, updateUserRole, deleteUser,
  getPendingReviews, approveReview, deleteReview,
} from '../controllers/admin.controller'
import { protect } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/admin.middleware'

const router = Router()

router.use(protect, requireAdmin)
router.get('/stats',                getStats)
router.get('/users',                getUsers)
router.put('/users/:id/role',       updateUserRole)
router.delete('/users/:id',         deleteUser)
router.get('/reviews/pending',      getPendingReviews)
router.put('/reviews/:id/approve',  approveReview)
router.delete('/reviews/:id',       deleteReview)

export default router
