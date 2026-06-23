import mongoose, { Document, Schema } from 'mongoose'

export type AIFeature = 'recommendation' | 'meal-plan' | 'nutrition-tip' | 'recipe-summary'

export interface IAILog extends Document {
  userId: mongoose.Types.ObjectId
  feature: AIFeature
  prompt: string
  response: string
  tokensUsed: number
  createdAt: Date
}

const aiLogSchema = new Schema<IAILog>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    feature:    { type: String, enum: ['recommendation', 'meal-plan', 'nutrition-tip', 'recipe-summary'], required: true },
    prompt:     { type: String, required: true },
    response:   { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
)

aiLogSchema.index({ userId: 1, feature: 1 })

export const AILog = mongoose.model<IAILog>('AILog', aiLogSchema)
