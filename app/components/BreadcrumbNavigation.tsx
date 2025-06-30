'use client'

import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbNavigationProps {
  path: string
  onNavigate: (path: string) => void
}

export default function BreadcrumbNavigation({ path, onNavigate }: BreadcrumbNavigationProps) {
  if (!path) return null

  // Split path by both dots and brackets, but keep brackets with their content
  const pathParts: string[] = []
  let currentPart = ''
  let inBrackets = false
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i]
    if (char === '[') {
      if (currentPart) {
        pathParts.push(currentPart)
        currentPart = ''
      }
      inBrackets = true
      currentPart += char
    } else if (char === ']') {
      currentPart += char
      pathParts.push(currentPart)
      currentPart = ''
      inBrackets = false
    } else if (char === '.' && !inBrackets) {
      if (currentPart) {
        pathParts.push(currentPart)
        currentPart = ''
      }
    } else {
      currentPart += char
    }
  }
  
  if (currentPart) {
    pathParts.push(currentPart)
  }
  
  const buildPath = (index: number) => {
    return pathParts.slice(0, index + 1).join('')
  }

  return (
    <div className="flex items-center space-x-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 overflow-x-auto">
      <button
        onClick={() => onNavigate('')}
        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Go to root"
      >
        <Home className="h-4 w-4" />
        <span>Root</span>
      </button>
      
      {pathParts.map((part, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <button
            onClick={() => onNavigate(buildPath(index))}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={`Go to ${buildPath(index)}`}
          >
            {part}
          </button>
        </div>
      ))}
    </div>
  )
} 