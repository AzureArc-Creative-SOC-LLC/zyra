import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  authLogin,
  authRegister,
  authVerify,
  clearToken,
  getToken,
  setToken,
} from '../lib/api'
import { AuthContext } from './auth-context'

const USER_KEY = 'zl:user'

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeCachedUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch { /* storage disabled */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? readCachedUser() : null))
  const [loading, setLoading] = useState(() => !!getToken())

  const applySession = useCallback((token, nextUser) => {
    if (token) setToken(token)
    setUser(nextUser || null)
    writeCachedUser(nextUser || null)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    writeCachedUser(null)
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return null
    }
    try {
      const res = await authVerify()
      const verified = (res && res.user) || null
      setUser(verified)
      writeCachedUser(verified)
      return verified
    } catch {
      // Token invalid/expired — drop it silently.
      logout()
      return null
    }
  }, [logout])

  useEffect(() => {
    if (!getToken()) return undefined
    let cancelled = false
    ;(async () => {
      await refresh()
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [refresh])

  const login = useCallback(async ({ email, password }) => {
    const res = await authLogin({ email, password })
    applySession(res && res.token, (res && res.user) || null)
    return res
  }, [applySession])

  const register = useCallback(async (payload) => {
    const res = await authRegister(payload)
    applySession(res && res.token, (res && res.user) || null)
    return res
  }, [applySession])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
