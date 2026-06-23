import mongoose, { Document, Schema } from 'mongoose'

export interface ILoggedMeal {
  recipeId: mongoose.Types.ObjectId
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface INutritionLog extends Document {
  userId: mongoose.Types.ObjectId
  date: Date
  meals: ILoggedMeal[]
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  createdAt: Date
}

const nutritionLogSchema = new Schema<INutritionLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date:   { type: Date, required: true },
    meals: [
      {
        recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
        servings: { type: Number, required: true, min: 0.5 },
        calories: { type: Number, default: 0 },
        protein:  { type: Number, default: 0 },
        carbs:    { type: Number, default: 0 },
        fat:      { type: Number, default: 0 },
      },
    ],
    totals: {
      calories: { type: Number, default: 0 },
      protein:  { type: Number, default: 0 },
      carbs:    { type: Number, default: 0 },
      fat:      { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

nutritionLogSchema.index({ userId: 1, date: -1 })
nutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true })

export const NutritionLog = mongoose.model<INutritionLog>('NutritionLog', nutritionLogSchema)
