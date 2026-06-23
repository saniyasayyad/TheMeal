import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../api/auth.api'
import { setAccessToken } from '../api/client'
import type { User } from '../types/user.types'

interface AuthContextValue {
  user: User | null
  accessToken: string
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (u: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authApi.getMe()
      .then((res) => {
        setUser(res.data.data?.user ?? null)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    const { accessToken: token, user: u } = res.data.data!
    setAccessToken(token)
    setToken(token)
    setUser(u)
  }

  const signup = async (name: string, email: string, password: string) => {
    const res = await authApi.signup(name, email, password)
    const { accessToken: token, user: u } = res.data.data!
    setAccessToken(token)
    setToken(token)
    setUser(u)
  }

  const logout = async () => {
    await authApi.logout()
    setAccessToken('')
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
