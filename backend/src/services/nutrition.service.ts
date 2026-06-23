import { IIngredient } from '../models/Recipe.model'

const CALORIE_MAP: Record<string, number> = {
  chicken: 165, beef: 250, pork: 242, fish: 130, salmon: 208,
  rice: 130, pasta: 131, bread: 265, potato: 77, sweet_potato: 86,
  egg: 155, milk: 61, cheese: 402, butter: 717, oil: 884,
  flour: 364, sugar: 387, carrot: 41, onion: 40, garlic: 149,
  tomato: 18, spinach: 23, broccoli: 34, pepper: 20, mushroom: 22,
}

function estimateCaloriesFromIngredients(ingredients: IIngredient[]): number {
  let total = 0
  for (const ing of ingredients) {
    const key = Object.keys(CALORIE_MAP).find((k) =>
      ing.name.toLowerCase().includes(k)
    )
    if (key) {
      const grams = parseGrams(ing.measure)
      total += (CALORIE_MAP[key] * grams) / 100
    }
  }
  return Math.round(total) || 400
}

function parseGrams(measure: string): number {
  if (!measure) return 100
  const num = parseFloat(measure)
  if (isNaN(num)) return 100
  if (/tbsp/i.test(measure)) return num * 15
  if (/tsp/i.test(measure)) return num * 5
  if (/cup/i.test(measure)) return num * 240
  if (/oz/i.test(measure)) return num * 28
  if (/lb/i.test(measure)) return num * 454
  if (/g/i.test(measure)) return num
  return num * 30
}

export const nutritionService = {
  estimate(ingredients: IIngredient[]) {
    const calories = estimateCaloriesFromIngredients(ingredients)
    return {
      calories,
      protein: Math.round(calories * 0.2 / 4),
      carbs:   Math.round(calories * 0.5 / 4),
      fat:     Math.round(calories * 0.3 / 9),
    }
  },

  scale(nutrition: { calories: number; protein: number; carbs: number; fat: number }, servings: number) {
    return {
      calories: Math.round(nutrition.calories * servings),
      protein:  Math.round(nutrition.protein  * servings),
      carbs:    Math.round(nutrition.carbs    * servings),
      fat:      Math.round(nutrition.fat      * servings),
    }
  },
}
