'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Hash, Type, MapPin, Regex, Sliders } from 'lucide-react'

interface SearchResult {
  path: string
  value: any
  type: string
  parentKey?: string
}

interface AdvancedSearchProps {
  data: any
  onSearchResults: (results: SearchResult[], query: string) => void
  onClear: () => void
}

export default function AdvancedSearch({ data, onSearchResults, onClear }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'value' | 'path' | 'regex'>('value')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['string', 'number', 'boolean', 'object', 'array', 'null'])
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const dataTypes = [
    { key: 'string', label: 'Strings', icon: Type, color: 'text-blue-500' },
    { key: 'number', label: 'Numbers', icon: Hash, color: 'text-green-500' },
    { key: 'boolean', label: 'Booleans', icon: Type, color: 'text-purple-500' },
    { key: 'object', label: 'Objects', icon: MapPin, color: 'text-orange-500' },
    { key: 'array', label: 'Arrays', icon: MapPin, color: 'text-red-500' },
    { key: 'null', label: 'Nulls', icon: Type, color: 'text-gray-500' },
  ]

  const searchInJSON = (obj: any, path: string = '', parentKey?: string): SearchResult[] => {
    const results: SearchResult[] = []
    
    const traverse = (item: any, currentPath: string, parent?: string) => {
      const itemType = item === null ? 'null' : Array.isArray(item) ? 'array' : typeof item
      
      // Check if this type is selected for filtering
      if (!selectedTypes.includes(itemType)) {
        return
      }

      let matches = false
      
      switch (searchType) {
        case 'value':
          if (itemType === 'string' || itemType === 'number' || itemType === 'boolean') {
            const stringValue = String(item).toLowerCase()
            matches = stringValue.includes(query.toLowerCase())
          }
          break
        case 'path':
          matches = currentPath.toLowerCase().includes(query.toLowerCase())
          break
        case 'regex':
          try {
            const regex = new RegExp(query, 'i')
            if (itemType === 'string' || itemType === 'number' || itemType === 'boolean') {
              matches = regex.test(String(item))
            } else {
              matches = regex.test(currentPath)
            }
          } catch (e) {
            // Invalid regex, skip
          }
          break
      }

      if (matches && query.trim()) {
        results.push({
          path: currentPath,
          value: item,
          type: itemType,
          parentKey: parent
        })
      }

      // Continue traversing for objects and arrays
      if (itemType === 'object' && item !== null) {
        Object.keys(item).forEach(key => {
          traverse(item[key], `${currentPath}.${key}`, key)
        })
      } else if (itemType === 'array') {
        item.forEach((element: any, index: number) => {
          traverse(element, `${currentPath}[${index}]`, index.toString())
        })
      }
    }

    traverse(obj, path, parentKey)
    return results
  }

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchInJSON(data)
      setResults(searchResults)
      onSearchResults(searchResults, query)
    } else {
      setResults([])
      onClear()
    }
  }, [query, searchType, selectedTypes, data])

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    onClear()
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-20 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={searchType === 'path' ? 'Search by path...' : searchType === 'regex' ? 'Enter regex pattern...' : 'Search in values...'}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
            title="Advanced filters"
          >
            <Sliders className="h-4 w-4 text-gray-400" />
          </button>
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Search Type Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Search by:</span>
        <div className="flex space-x-1">
          {[
            { key: 'value', label: 'Value', icon: Search },
            { key: 'path', label: 'Path', icon: MapPin },
            { key: 'regex', label: 'Regex', icon: Regex }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSearchType(type.key as any)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                searchType === type.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <type.icon className="h-3 w-3 inline mr-1" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Type</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dataTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => toggleType(type.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedTypes.includes(type.key)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <type.icon className={`h-4 w-4 ${type.color}`} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {query.trim() && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
          {results.length > 0 && (
            <span className="ml-2">
              (showing first 10)
            </span>
          )}
        </div>
      )}
    </div>
  )
} 