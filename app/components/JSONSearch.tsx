'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface JSONSearchProps {
  onSearch: (query: string) => void
  onClear: () => void
}

export default function JSONSearch({ onSearch, onClear }: JSONSearchProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onClear()
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Search in JSON..."
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      )}
    </div>
  )
} 