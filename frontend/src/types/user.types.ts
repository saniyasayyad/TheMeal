export interface UserPreferences {
  dietaryTags: string[]
  cuisines: string[]
  allergies: string[]
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar: string
  preferences: UserPreferences
  isVerified: boolean
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}
