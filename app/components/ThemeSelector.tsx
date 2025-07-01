'use client'

import { useState, useEffect } from 'react'
import { Palette, ChevronDown } from 'lucide-react'

export interface ThemeScheme {
  id: string
  name: string
  mode: 'light' | 'dark'
  colors: {
    background: string
    foreground: string
    jsonKey: string
    jsonString: string
    jsonNumber: string
    jsonBoolean: string
    jsonNull: string
    jsonBracket: string
    jsonComma: string
  }
}

const themeSchemes: ThemeScheme[] = [
  // Dark Mode Themes
  {
    id: 'monokai',
    name: 'Monokai',
    mode: 'dark',
    colors: {
      background: '#272822',
      foreground: '#f8f8f2',
      jsonKey: '#f92672',
      jsonString: '#e6db74',
      jsonNumber: '#ae81ff',
      jsonBoolean: '#66d9ef',
      jsonNull: '#66d9ef',
      jsonBracket: '#f8f8f2',
      jsonComma: '#f8f8f2'
    }
  },
  {
    id: 'monokai-dimmed',
    name: 'Monokai Dimmed',
    mode: 'dark',
    colors: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      jsonKey: '#ff7b72',
      jsonString: '#ce9178',
      jsonNumber: '#dcdcaa',
      jsonBoolean: '#4fc1ff',
      jsonNull: '#4fc1ff',
      jsonBracket: '#d4d4d4',
      jsonComma: '#d4d4d4'
    }
  },
  {
    id: 'vs2017-dark',
    name: '2017 VS Code Dark',
    mode: 'dark',
    colors: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      jsonKey: '#9cdcfe',
      jsonString: '#a64714',
      jsonNumber: '#b5cea8',
      jsonBoolean: '#569cd6',
      jsonNull: '#569cd6',
      jsonBracket: '#dbdb09',
      jsonComma: '#d4d4d4'
    }
  },
  {
    id: 'one-modern',
    name: 'One Modern',
    mode: 'dark',
    colors: {
      background: '#282c34',
      foreground: '#abb2bf',
      jsonKey: '#e06c75',
      jsonString: '#98c379',
      jsonNumber: '#d19a66',
      jsonBoolean: '#61afef',
      jsonNull: '#61afef',
      jsonBracket: '#abb2bf',
      jsonComma: '#abb2bf'
    }
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    mode: 'dark',
    colors: {
      background: '#002b36',
      foreground: '#839496',
      jsonKey: '#268bd2',
      jsonString: '#2aa198',
      jsonNumber: '#d33682',
      jsonBoolean: '#859900',
      jsonNull: '#859900',
      jsonBracket: '#839496',
      jsonComma: '#839496'
    }
  },
  {
    id: 'tomorrow-night-blue',
    name: 'Tomorrow Night Blue',
    mode: 'dark',
    colors: {
      background: '#002451',
      foreground: '#ffffff',
      jsonKey: '#ff9da4',
      jsonString: '#d1f1a9',
      jsonNumber: '#ffc58f',
      jsonBoolean: '#bbdaff',
      jsonNull: '#bbdaff',
      jsonBracket: '#ffffff',
      jsonComma: '#ffffff'
    }
  },
  // Light Mode Themes
  {
    id: 'vs2017-light',
    name: '2017 VS Code Light',
    mode: 'light',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      jsonKey: '#0000ff',
      jsonString: '#a31515',
      jsonNumber: '#098658',
      jsonBoolean: '#0000ff',
      jsonNull: '#0000ff',
      jsonBracket: '#000000',
      jsonComma: '#000000'
    }
  },
  {
    id: 'quite-light',
    name: 'Quite Light',
    mode: 'light',
    colors: {
      background: '#f8f8f8',
      foreground: '#383a42',
      jsonKey: '#a626a4',
      jsonString: '#50a14f',
      jsonNumber: '#986801',
      jsonBoolean: '#4078f2',
      jsonNull: '#4078f2',
      jsonBracket: '#383a42',
      jsonComma: '#383a42'
    }
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    mode: 'light',
    colors: {
      background: '#fdf6e3',
      foreground: '#586e75',
      jsonKey: '#268bd2',
      jsonString: '#2aa198',
      jsonNumber: '#d33682',
      jsonBoolean: '#859900',
      jsonNull: '#859900',
      jsonBracket: '#586e75',
      jsonComma: '#586e75'
    }
  }
]

interface ThemeSelectorProps {
  isDark: boolean
  onThemeChange: (theme: ThemeScheme) => void
  currentTheme?: ThemeScheme
}

export default function ThemeSelector({ isDark, onThemeChange, currentTheme }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<ThemeScheme | null>(currentTheme || null)

  // Filter themes based on current mode
  const availableThemes = themeSchemes.filter(theme => theme.mode === (isDark ? 'dark' : 'light'))

  useEffect(() => {
    // Set default theme if none selected
    if (!selectedTheme) {
      const defaultTheme = availableThemes.find(theme => 
        isDark ? theme.id === 'vs2017-dark' : theme.id === 'vs2017-light'
      ) || availableThemes[0]
      
      if (defaultTheme) {
        setSelectedTheme(defaultTheme)
        onThemeChange(defaultTheme)
      }
    }
  }, [isDark, selectedTheme, availableThemes, onThemeChange])

  useEffect(() => {
    // Update theme when dark mode changes
    if (selectedTheme && selectedTheme.mode !== (isDark ? 'dark' : 'light')) {
      const newDefaultTheme = availableThemes.find(theme => 
        isDark ? theme.id === 'vs2017-dark' : theme.id === 'vs2017-light'
      ) || availableThemes[0]
      
      if (newDefaultTheme) {
        setSelectedTheme(newDefaultTheme)
        onThemeChange(newDefaultTheme)
      }
    }
  }, [isDark, selectedTheme, availableThemes, onThemeChange])

  const handleThemeSelect = (theme: ThemeScheme) => {
    setSelectedTheme(theme)
    onThemeChange(theme)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Select syntax theme"
      >
        <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        <span className="text-gray-700 dark:text-gray-300 truncate">
          {selectedTheme?.name || 'Theme'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
              {isDark ? 'Dark Themes' : 'Light Themes'}
            </div>
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedTheme?.id === theme.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{theme.name}</span>
                  {selectedTheme?.id === theme.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { themeSchemes } 