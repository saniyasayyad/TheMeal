import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { connectDB } from './config/db'
import { globalLimiter } from './middleware/rateLimit.middleware'
import { errorHandler } from './middleware/error.middleware'

import authRoutes      from './routes/auth.routes'
import recipeRoutes    from './routes/recipe.routes'
import favouriteRoutes from './routes/favourite.routes'
import reviewRoutes    from './routes/review.routes'
import aiRoutes        from './routes/ai.routes'
import mealplanRoutes  from './routes/mealplan.routes'
import nutritionRoutes from './routes/nutrition.routes'
import adminRoutes     from './routes/admin.routes'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(globalLimiter)

app.use('/api/auth',      authRoutes)
app.use('/api/recipes',   recipeRoutes)
app.use('/api/favourites', favouriteRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/ai',        aiRoutes)
app.use('/api/mealplan',  mealplanRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/admin',     adminRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
