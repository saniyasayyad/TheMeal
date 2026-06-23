import { Router } from 'express'
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favourite.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)
router.get('/',            getFavourites)
router.post('/',           addFavourite)
router.delete('/:recipeId', removeFavourite)

export default router
