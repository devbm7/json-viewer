'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeScheme, themeSchemes } from '../components/ThemeSelector'

interface ThemeContextType {
  currentTheme: ThemeScheme
  setCurrentTheme: (theme: ThemeScheme) => void
  isDark: boolean
  setIsDark: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeScheme>(themeSchemes[0])

  useEffect(() => {
    // Load saved theme and dark mode preference
    const savedTheme = localStorage.getItem('theme')
    const savedSyntaxTheme = localStorage.getItem('syntaxTheme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    if (savedSyntaxTheme) {
      try {
        const parsedTheme = JSON.parse(savedSyntaxTheme)
        const foundTheme = themeSchemes.find(theme => theme.id === parsedTheme.id)
        if (foundTheme) {
          setCurrentTheme(foundTheme)
        }
      } catch (error) {
        console.error('Failed to parse saved syntax theme:', error)
      }
    }
  }, [])

  const handleSetIsDark = (newIsDark: boolean) => {
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSetCurrentTheme = (theme: ThemeScheme) => {
    setCurrentTheme(theme)
    localStorage.setItem('syntaxTheme', JSON.stringify(theme))
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setCurrentTheme: handleSetCurrentTheme,
      isDark,
      setIsDark: handleSetIsDark
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 