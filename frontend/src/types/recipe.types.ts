export interface Ingredient {
  name: string
  measure: string
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Recipe {
  _id: string
  mealDbId: string
  title: string
  category: string
  cuisine: string
  thumbnail: string
  instructions: string
  ingredients: Ingredient[]
  youtubeUrl?: string
  tags: string[]
  nutrition: Nutrition
  aiSummary?: string
  averageRating: number
  reviewCount: number
  createdAt: string
}

export interface MealDBMeal {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strYoutube?: string
  strTags?: string
  [key: string]: string | undefined
}
