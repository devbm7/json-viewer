'use client'

import { useMemo } from 'react'
import { BarChart3, FileText, Hash, List } from 'lucide-react'

interface JSONStatsProps {
  data: any
}

export default function JSONStats({ data }: JSONStatsProps) {
  const stats = useMemo(() => {
    const calculateStats = (obj: any): { objects: number; arrays: number; strings: number; numbers: number; booleans: number; nulls: number } => {
      let objects = 0
      let arrays = 0
      let strings = 0
      let numbers = 0
      let booleans = 0
      let nulls = 0

      const traverse = (item: any) => {
        if (item === null) {
          nulls++
        } else if (Array.isArray(item)) {
          arrays++
          item.forEach(traverse)
        } else if (typeof item === 'object') {
          objects++
          Object.values(item).forEach(traverse)
        } else if (typeof item === 'string') {
          strings++
        } else if (typeof item === 'number') {
          numbers++
        } else if (typeof item === 'boolean') {
          booleans++
        }
      }

      traverse(obj)
      return { objects, arrays, strings, numbers, booleans, nulls }
    }

    return calculateStats(data)
  }, [data])

  const totalItems = stats.objects + stats.arrays + stats.strings + stats.numbers + stats.booleans + stats.nulls

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">JSON Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Objects</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.objects}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <List className="h-4 w-4 text-green-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Arrays</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.arrays}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Strings</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.strings}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="h-4 w-4 text-orange-500 font-bold">#</span>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Numbers</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.numbers}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="h-4 w-4 text-red-500 font-bold">✓</span>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Booleans</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.booleans}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="h-4 w-4 text-gray-500 font-bold">∅</span>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nulls</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.nulls}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total items: <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
        </p>
      </div>
    </div>
  )
} 