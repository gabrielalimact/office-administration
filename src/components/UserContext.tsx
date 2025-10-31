'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  id: number
  nome: string
  cpf: string
  cargo: string
  email: string
  avatar?: string
}

interface UserContextProps {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used within UserProvider')
  return ctx
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) return JSON.parse(stored)
    }
    return null
  })

  function setUser(newUser: User | null) {
    setUserState(newUser)
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('user')
      }
    }
  }

  function logout() {
    setUser(null)
  }

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>
}
