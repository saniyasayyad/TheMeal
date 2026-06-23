import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError'

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg)
    return next(new ApiError(422, 'Validation failed', messages))
  }
  next()
}
