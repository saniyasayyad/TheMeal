import fetch from 'node-fetch'
import { cacheService } from './cache.service'
import { Recipe } from '../models/Recipe.model'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

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

function parseMealDBMeal(meal: MealDBMeal) {
  const ingredients: { name: string; measure: string }[] = []
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (name) ingredients.push({ name, measure: measure || '' })
  }

  return {
    mealDbId: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory || '',
    cuisine: meal.strArea || '',
    thumbnail: meal.strMealThumb || '',
    instructions: meal.strInstructions || '',
    ingredients,
    youtubeUrl: meal.strYoutube || '',
    tags: meal.strTags ? meal.strTags.split(',').map((t) => t.trim()) : [],
  }
}

async function upsertRecipe(meal: MealDBMeal) {
  const parsed = parseMealDBMeal(meal)
  return Recipe.findOneAndUpdate(
    { mealDbId: parsed.mealDbId },
    { $setOnInsert: parsed },
    { upsert: true, new: true }
  )
}

export const mealdbService = {
  async searchByIngredient(ingredient: string) {
    const key = `search:${ingredient.toLowerCase()}`
    const cached = cacheService.get<MealDBMeal[]>(key)
    if (cached) return cached

    const res = await fetch(`${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`)
    const data = (await res.json()) as { meals: MealDBMeal[] | null }
    const meals = data.meals || []
    cacheService.set(key, meals)
    return meals
  },

  async getRandom(count = 10): Promise<MealDBMeal[]> {
    const promises = Array.from({ length: count }, () =>
      fetch(`${BASE}/random.php`)
        .then((r) => r.json() as Promise<{ meals: MealDBMeal[] }>)
        .then((d) => d.meals[0])
    )
    return Promise.all(promises)
  },

  async getById(id: string) {
    const key = `meal:${id}`
    const cached = cacheService.get<MealDBMeal>(key)
    if (cached) return cached

    const res = await fetch(`${BASE}/lookup.php?i=${id}`)
    const data = (await res.json()) as { meals: MealDBMeal[] | null }
    if (!data.meals?.[0]) return null

    const meal = data.meals[0]
    cacheService.set(key, meal)
    await upsertRecipe(meal)
    return meal
  },

  async getCategories() {
    const key = 'categories'
    const cached = cacheService.get<string[]>(key)
    if (cached) return cached

    const res = await fetch(`${BASE}/categories.php`)
    const data = (await res.json()) as { categories: { strCategory: string }[] }
    const categories = data.categories.map((c) => c.strCategory)
    cacheService.set(key, categories, 3600)
    return categories
  },

  parseMealDBMeal,
}
