import mongoose, { Document, Schema } from 'mongoose'

export interface IDayMeals {
  dayName: string
  breakfast?: mongoose.Types.ObjectId
  lunch?: mongoose.Types.ObjectId
  dinner?: mongoose.Types.ObjectId
}

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  weekStartDate: Date
  days: IDayMeals[]
  aiGenerated: boolean
  aiPrompt?: string
  createdAt: Date
}

const mealPlanSchema = new Schema<IMealPlan>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:         { type: String, required: true, trim: true },
    weekStartDate: { type: Date, required: true },
    days: [
      {
        dayName:   { type: String, required: true },
        breakfast: { type: Schema.Types.ObjectId, ref: 'Recipe' },
        lunch:     { type: Schema.Types.ObjectId, ref: 'Recipe' },
        dinner:    { type: Schema.Types.ObjectId, ref: 'Recipe' },
      },
    ],
    aiGenerated: { type: Boolean, default: false },
    aiPrompt:    { type: String },
  },
  { timestamps: true }
)

mealPlanSchema.index({ userId: 1, weekStartDate: -1 })

export const MealPlan = mongoose.model<IMealPlan>('MealPlan', mealPlanSchema)
