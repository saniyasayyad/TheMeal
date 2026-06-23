import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  recipeId: mongoose.Types.ObjectId
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipeId:   { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    comment:    { type: String, default: '', maxlength: 1000 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
)

reviewSchema.index({ userId: 1, recipeId: 1 }, { unique: true })
reviewSchema.index({ recipeId: 1, isApproved: 1 })

export const Review = mongoose.model<IReview>('Review', reviewSchema)
