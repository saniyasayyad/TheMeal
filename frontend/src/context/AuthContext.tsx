import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authApi } from '../api/auth.api'
import { setAccessToken } from '../api/client'
import type { User } from '../types/user.types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (u: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const CACHE_KEY = 'rp_user'

function readCache(): User | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function writeCache(user: User | null) {
  if (user) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CACHE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise directly from localStorage — no loading flash for returning users.
  const [user, setUserState] = useState<User | null>(readCache)
  // Only show a loading state when there is no cached user at all.
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache())

  const setUser = useCallback((u: User | null) => {
    setUserState(u)
    writeCache(u)
  }, [])

  const clearAuth = useCallback(() => {
    setAccessToken('')
    setUser(null)
  }, [setUser])

  useEffect(() => {
    // When the Axios interceptor fires auth:expired (failed token refresh),
    // clear user state here inside React instead of doing a hard reload.
    const handler = () => clearAuth()
    window.addEventListener('auth:expired', handler)
    return () => window.removeEventListener('auth:expired', handler)
  }, [clearAuth])

  useEffect(() => {
    // Silently verify the session on mount. If we have a cached user the UI
    // is already rendered — this just refreshes the data in the background.
    authApi.getMe()
      .then((res) => {
        setUser(res.data.data?.user ?? null)
      })
      .catch(() => {
        // getMe failed even after the interceptor's refresh attempt —
        // the session is truly gone. Clear local state but don't redirect;
        // React Router's ProtectedRoute will redirect if the user is on a
        // protected page.
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [setUser])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    const { accessToken: token, user: u } = res.data.data!
    setAccessToken(token)
    setUser(u)
  }

  const signup = async (name: string, email: string, password: string) => {
    const res = await authApi.signup(name, email, password)
    const { accessToken: token, user: u } = res.data.data!
    setAccessToken(token)
    setUser(u)
  }

  const logout = async () => {
    await authApi.logout().catch(() => {})
    clearAuth()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
