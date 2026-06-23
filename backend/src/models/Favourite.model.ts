import mongoose, { Document, Schema } from 'mongoose'

export interface IFavourite extends Document {
  userId: mongoose.Types.ObjectId
  recipeId: mongoose.Types.ObjectId
  savedAt: Date
}

const favouriteSchema = new Schema<IFavourite>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  savedAt:  { type: Date, default: Date.now },
})

favouriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true })

export const Favourite = mongoose.model<IFavourite>('Favourite', favouriteSchema)
