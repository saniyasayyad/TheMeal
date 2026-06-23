import { body } from 'express-validator'

export const mealPlanValidator = [
  body('goal').notEmpty().withMessage('Goal is required (e.g. weight loss, muscle gain)'),
  body('calorieTarget')
    .isInt({ min: 800, max: 5000 })
    .withMessage('Calorie target must be between 800 and 5000'),
  body('restrictions').optional().isArray(),
]
