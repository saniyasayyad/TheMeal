import rateLimit from 'express-rate-limit'
import { Request } from 'express'

const isDev = process.env.NODE_ENV !== 'production'

// Skip rate limiting entirely in development so localhost testing never gets blocked.
// In production every IP is counted normally.
const skipInDev = (_req: Request) => isDev

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  message: { success: false, message: 'Too many requests, please try again later.' },
})

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  message: { success: false, message: 'AI rate limit exceeded. Please wait before trying again.' },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
})
