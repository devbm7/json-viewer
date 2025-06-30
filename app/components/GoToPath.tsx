'use client'

import { useState } from 'react'
import { MapPin, Search, X } from 'lucide-react'

interface GoToPathProps {
  onNavigate: (path: string) => void
  availablePaths?: string[]
}

export default function GoToPath({ onNavigate, availablePaths = [] }: GoToPathProps) {
  const [path, setPath] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredPaths, setFilteredPaths] = useState<string[]>([])

  const handlePathChange = (value: string) => {
    setPath(value)
    
    if (value.trim()) {
      const filtered = availablePaths.filter(p => 
        p.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10) // Limit to 10 suggestions
      setFilteredPaths(filtered)
    } else {
      setFilteredPaths([])
    }
  }

  const handleNavigate = (selectedPath: string) => {
    onNavigate(selectedPath)
    setPath('')
    setFilteredPaths([])
    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (path.trim()) {
      handleNavigate(path.trim())
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        title="Go to path"
      >
        <MapPin className="h-4 w-4" />
        <span>Go to Path</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Navigate to Path
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => handlePathChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter JSON path (e.g., user.profile.name)"
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                disabled={!path.trim()}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Navigate
              </button>
            </form>

            {filteredPaths.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suggestions:
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredPaths.map((suggestedPath, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigate(suggestedPath)}
                      className="block w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {suggestedPath}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 