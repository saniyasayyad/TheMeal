import mongoose, { Document, Schema } from 'mongoose'

export interface IIngredient {
  name: string
  measure: string
}

export interface INutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface IRecipe extends Document {
  mealDbId?: string
  title: string
  category: string
  cuisine: string
  thumbnail: string
  instructions: string
  ingredients: IIngredient[]
  youtubeUrl?: string
  tags: string[]
  nutrition: INutrition
  aiSummary?: string
  createdBy?: mongoose.Types.ObjectId
  isPublished: boolean
  averageRating: number
  reviewCount: number
  createdAt: Date
}

const recipeSchema = new Schema<IRecipe>(
  {
    mealDbId:     { type: String, unique: true, sparse: true },
    title:        { type: String, required: true, trim: true },
    category:     { type: String, default: '' },
    cuisine:      { type: String, default: '' },
    thumbnail:    { type: String, default: '' },
    instructions: { type: String, default: '' },
    ingredients:  [{ name: String, measure: String }],
    youtubeUrl:   { type: String },
    tags:         { type: [String], default: [] },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein:  { type: Number, default: 0 },
      carbs:    { type: Number, default: 0 },
      fat:      { type: Number, default: 0 },
    },
    aiSummary:    { type: String },
    createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
    isPublished:  { type: Boolean, default: true },
    averageRating:{ type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },
  },
  { timestamps: true }
)

recipeSchema.index({ title: 'text', tags: 'text' })
recipeSchema.index({ category: 1, cuisine: 1 })

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema)
