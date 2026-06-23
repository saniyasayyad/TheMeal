import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model'
import { ApiError } from '../utils/ApiError'
import { asyncHandler } from '../utils/asyncHandler'

interface JwtPayload {
  userId: string
}

export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access token required')
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_ACCESS_SECRET!

  const decoded = jwt.verify(token, secret) as JwtPayload
  const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken')
  if (!user) throw new ApiError(401, 'User not found')

  req.user = user
  next()
})
