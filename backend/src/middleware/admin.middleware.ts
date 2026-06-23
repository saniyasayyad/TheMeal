import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required')
  }
  next()
}
