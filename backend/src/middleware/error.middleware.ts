import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      new ApiResponse(err.statusCode, err.message, { errors: err.errors })
    )
    return
  }

  console.error('Unhandled error:', err)
  res.status(500).json(new ApiResponse(500, 'Internal server error'))
}
