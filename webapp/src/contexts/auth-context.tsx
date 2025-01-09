'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/axios' // Axios instance

// Define user interface
interface User {
  fullName: string // Updated from name to fullName
  email: string
  avatar?: string
  [key: string]: any
}

// Define Auth Context structure
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isReady: boolean
  login: (token: string) => void
  logout: () => void
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isReady: false,
  login: () => {},
  logout: () => {},
})

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  // Fetch user info from API
  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get('/api/user/current')
      setUser(response.data) // Update user info
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      logout() // Logout on failure
    }
  }

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Assume user is logged in based on token existence
      setIsLoggedIn(true)
      fetchCurrentUser() // Fetch user info
    }
    setIsReady(true)
  }, [])

  // Login function
  const login = async (token: string) => {
    localStorage.setItem('token', token) // Store token
    setIsLoggedIn(true)
    await fetchCurrentUser() // Fetch and update user info
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsLoggedIn(false)
    router.push('/login') // Redirect to login page
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext)
