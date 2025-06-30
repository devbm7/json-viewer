'use client'

import { useState } from 'react'
import { MapPin, Copy, Check, ExternalLink, ChevronRight } from 'lucide-react'

interface SearchResult {
  path: string
  value: any
  type: string
  parentKey?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onNavigateToPath: (path: string) => void
}

export default function SearchResults({ results, query, onNavigateToPath }: SearchResultsProps) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path)
      setCopiedPath(path)
      setTimeout(() => setCopiedPath(null), 2000)
    } catch (err) {
      console.error('Failed to copy path:', err)
    }
  }

  const formatValue = (value: any): string => {
    if (value === null) return 'null'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return `[${value.length} items]`
      }
      return `{${Object.keys(value).length} properties}`
    }
    return String(value)
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'string': return 'text-blue-500'
      case 'number': return 'text-green-500'
      case 'boolean': return 'text-purple-500'
      case 'object': return 'text-orange-500'
      case 'array': return 'text-red-500'
      case 'null': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'string': return '📝'
      case 'number': return '🔢'
      case 'boolean': return '✅'
      case 'object': return '📦'
      case 'array': return '📋'
      case 'null': return '❌'
      default: return '❓'
    }
  }

  if (results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search query or filters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search Results ({results.length})
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Query: "{query}"
          </span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto search-results-scroll">
        {results.map((result, index) => (
          <div 
            key={`${result.path}-${index}`}
            className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Path */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {result.path}
                  </span>
                  <button
                    onClick={() => handleCopyPath(result.path)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy path"
                  >
                    {copiedPath === result.path ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => onNavigateToPath(result.path)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Navigate to this path"
                  >
                    <ExternalLink className="h-3 w-3 text-blue-500" />
                  </button>
                </div>
                
                {/* Value and Type */}
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(result.type)}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getTypeColor(result.type)}`}>
                      {result.type}
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {formatValue(result.value)}
                    </span>
                  </div>
                </div>
                
                {/* Parent Key Info */}
                {result.parentKey && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Parent: {result.parentKey}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {results.length >= 10 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing first 10 results. Refine your search for more specific results.
          </p>
        </div>
      )}
    </div>
  )
} 