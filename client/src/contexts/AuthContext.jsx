import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'maestria_user'

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    token: null,
    userId: null,
    name: null,
    email: null,
    role: null,
    isBarber: false,
    isAuthenticated: false,
  })

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        setState({
          token: data.token,
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
          isBarber: data.isBarber ?? false,
          isAuthenticated: true,
        })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem('token')
      }
    }
  }, [])

  const login = useCallback((data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setState({
      token: data.token,
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      isBarber: data.isBarber ?? false,
      isAuthenticated: true,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem(STORAGE_KEY)
    setState({
      token: null,
      userId: null,
      name: null,
      email: null,
      role: null,
      isBarber: false,
      isAuthenticated: false,
    })
  }, [])

  const updateUser = useCallback((patch) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, ...patch }))
        } catch {
          /* ignore */
        }
      }
      return next
    })
  }, [])

  const value = { ...state, login, logout, updateUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
