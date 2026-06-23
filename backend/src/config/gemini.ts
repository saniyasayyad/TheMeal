import { GoogleGenerativeAI } from '@google/generative-ai'

let geminiClient: GoogleGenerativeAI | null = null

export const getGeminiClient = (): GoogleGenerativeAI => {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined in environment variables')
    geminiClient = new GoogleGenerativeAI(apiKey)
  }
  return geminiClient
}

export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  return getGeminiClient().getGenerativeModel({ model: modelName })
}
