import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  )
  return { accessToken, refreshToken }
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(409, 'Email already registered')

  const user = await User.create({ name, email, passwordHash: password })
  const { accessToken, refreshToken } = generateTokens(user.id)
  await User.findByIdAndUpdate(user.id, { refreshToken })

  setRefreshCookie(res, refreshToken)
  res.status(201).json(new ApiResponse(201, 'Account created', { accessToken, user }))
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(401, 'Invalid email or password')

  const match = await user.comparePassword(password)
  if (!match) throw new ApiError(401, 'Invalid email or password')

  const { accessToken, refreshToken } = generateTokens(user.id)
  await User.findByIdAndUpdate(user.id, { refreshToken })

  setRefreshCookie(res, refreshToken)
  res.json(new ApiResponse(200, 'Login successful', { accessToken, user }))
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.user!._id, { $unset: { refreshToken: 1 } })
  res.clearCookie('refreshToken')
  res.json(new ApiResponse(200, 'Logged out successfully'))
})

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (!token) throw new ApiError(401, 'Refresh token missing')

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string }
  const user = await User.findById(decoded.userId)
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Invalid refresh token')

  const { accessToken, refreshToken: newRefresh } = generateTokens(user.id)
  await User.findByIdAndUpdate(user.id, { refreshToken: newRefresh })

  setRefreshCookie(res, newRefresh)
  res.json(new ApiResponse(200, 'Token refreshed', { accessToken }))
})

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(new ApiResponse(200, 'User profile', { user: req.user }))
})

export const updatePreferences = asyncHandler(async (req: Request, res: Response) => {
  const { dietaryTags, cuisines, allergies } = req.body
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { preferences: { dietaryTags, cuisines, allergies } },
    { new: true }
  )
  res.json(new ApiResponse(200, 'Preferences updated', { user }))
})
