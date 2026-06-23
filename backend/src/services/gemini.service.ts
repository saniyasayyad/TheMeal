import { getGeminiModel } from '../config/gemini'
import { AILog } from '../models/AILog.model'
import type { AIFeature } from '../models/AILog.model'
import mongoose from 'mongoose'

interface UserPreferences {
  dietaryTags: string[]
  cuisines: string[]
  allergies: string[]
}

interface MealPlanRequest {
  goal: string
  calorieTarget: number
  restrictions: string[]
}

interface NutritionData {
  calories: number
  protein: number
  carbs: number
  fat: number
}

async function generateAndLog(
  userId: mongoose.Types.ObjectId,
  feature: AIFeature,
  prompt: string
): Promise<string> {
  const model = getGeminiModel()
  const result = await model.generateContent(prompt)
  const response = result.response.text()
  const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0

  await AILog.create({ userId, feature, prompt, response, tokensUsed })
  return response
}

function extractJson(text: string): unknown {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/)
  const raw = match ? match[1] || match[0] : text
  return JSON.parse(raw.trim())
}

export const geminiService = {
  async getRecommendations(userId: mongoose.Types.ObjectId, prefs: UserPreferences) {
    const prompt = `You are an expert chef and nutritionist.
A user has the following food preferences:
- Dietary tags: ${prefs.dietaryTags.join(', ') || 'none'}
- Favourite cuisines: ${prefs.cuisines.join(', ') || 'any'}
- Allergies: ${prefs.allergies.join(', ') || 'none'}

Suggest exactly 8 real meal names that exist in TheMealDB (https://www.themealdb.com).
Return ONLY valid JSON array, no markdown:
[{ "mealName": string, "reason": string, "cuisine": string, "tags": string[] }]`

    const raw = await generateAndLog(userId, 'recommendation', prompt)
    return extractJson(raw) as { mealName: string; reason: string; cuisine: string; tags: string[] }[]
  },

  async generateMealPlan(userId: mongoose.Types.ObjectId, req: MealPlanRequest) {
    const prompt = `You are a professional nutritionist.
Create a 7-day meal plan for someone with these requirements:
- Goal: ${req.goal}
- Daily calorie target: ${req.calorieTarget} kcal
- Dietary restrictions: ${req.restrictions.join(', ') || 'none'}

Use real meal names that exist in TheMealDB. Each meal should be a real, cookable dish.
Return ONLY valid JSON, no markdown:
{
  "planTitle": string,
  "days": [
    {
      "dayName": string,
      "breakfast": { "mealName": string, "estimatedCalories": number },
      "lunch":     { "mealName": string, "estimatedCalories": number },
      "dinner":    { "mealName": string, "estimatedCalories": number }
    }
  ]
}`

    const raw = await generateAndLog(userId, 'meal-plan', prompt)
    return extractJson(raw) as {
      planTitle: string
      days: {
        dayName: string
        breakfast: { mealName: string; estimatedCalories: number }
        lunch: { mealName: string; estimatedCalories: number }
        dinner: { mealName: string; estimatedCalories: number }
      }[]
    }
  },

  async getNutritionTip(userId: mongoose.Types.ObjectId, weeklyData: NutritionData[], goal: string) {
    const avg = weeklyData.reduce(
      (acc, d) => ({
        calories: acc.calories + d.calories / weeklyData.length,
        protein: acc.protein + d.protein / weeklyData.length,
        carbs: acc.carbs + d.carbs / weeklyData.length,
        fat: acc.fat + d.fat / weeklyData.length,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    const prompt = `You are a registered dietitian.
A user's average daily nutrition over the past week:
- Calories: ${Math.round(avg.calories)} kcal
- Protein: ${Math.round(avg.protein)}g
- Carbs: ${Math.round(avg.carbs)}g
- Fat: ${Math.round(avg.fat)}g
- User goal: ${goal}

Give exactly 3 specific, actionable nutrition tips based on this data.
Return ONLY valid JSON, no markdown:
{ "tips": [{ "title": string, "body": string, "priority": "high"|"medium"|"low" }] }`

    const raw = await generateAndLog(userId, 'nutrition-tip', prompt)
    return extractJson(raw) as { tips: { title: string; body: string; priority: string }[] }
  },

  async summariseRecipe(userId: mongoose.Types.ObjectId, title: string, ingredients: string[]) {
    const prompt = `Summarise this recipe in 2 engaging sentences for a food app card.
Recipe: ${title}
Main ingredients: ${ingredients.slice(0, 8).join(', ')}
Return ONLY valid JSON: { "summary": string }`

    const raw = await generateAndLog(userId, 'recipe-summary', prompt)
    return (extractJson(raw) as { summary: string }).summary
  },
}
