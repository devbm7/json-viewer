'use client'

import { useState, useEffect, useRef } from 'react'
import { Minimize, Maximize } from 'lucide-react'

interface JSONMiniMapProps {
  data: any
  onNavigate: (path: string) => void
  currentPath?: string
}

interface MiniMapNode {
  path: string
  level: number
  type: 'object' | 'array' | 'primitive'
  key?: string
  hasChildren: boolean
}

export default function JSONMiniMap({ data, onNavigate, currentPath = '' }: JSONMiniMapProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [nodes, setNodes] = useState<MiniMapNode[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const extractNodes = (obj: any, path: string = '', level: number = 0): MiniMapNode[] => {
      const result: MiniMapNode[] = []
      
      if (obj === null || typeof obj !== 'object') {
        return result
      }

      if (Array.isArray(obj)) {
        result.push({
          path,
          level,
          type: 'array',
          hasChildren: obj.length > 0
        })
        
        obj.forEach((item, index) => {
          const childPath = `${path}[${index}]`
          result.push({
            path: childPath,
            level: level + 1,
            type: Array.isArray(item) ? 'array' : typeof item === 'object' ? 'object' : 'primitive',
            key: `[${index}]`,
            hasChildren: item !== null && typeof item === 'object' && Object.keys(item).length > 0
          })
          result.push(...extractNodes(item, childPath, level + 1))
        })
      } else {
        result.push({
          path,
          level,
          type: 'object',
          hasChildren: Object.keys(obj).length > 0
        })
        
        Object.keys(obj).forEach(key => {
          const childPath = path ? `${path}.${key}` : key
          result.push({
            path: childPath,
            level: level + 1,
            type: Array.isArray(obj[key]) ? 'array' : typeof obj[key] === 'object' ? 'object' : 'primitive',
            key: key,
            hasChildren: obj[key] !== null && typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0
          })
          result.push(...extractNodes(obj[key], childPath, level + 1))
        })
      }
      
      return result
    }

    const extractedNodes = extractNodes(data)
    setNodes(extractedNodes.slice(0, 100)) // Limit to first 100 nodes for performance
  }, [data])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'object': return 'bg-blue-500'
      case 'array': return 'bg-green-500'
      default: return 'bg-gray-400'
    }
  }

  const handleNodeClick = (path: string) => {
    onNavigate(path)
  }

  const scrollToCurrent = () => {
    if (currentPath && containerRef.current) {
      const currentElement = containerRef.current.querySelector(`[data-path="${currentPath}"]`)
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  useEffect(() => {
    if (isExpanded) {
      scrollToCurrent()
    }
  }, [currentPath, isExpanded])

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Mini Map
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
          </button>
        </div>
        
        {isExpanded && (
          <div 
            ref={containerRef}
            className="w-64 h-64 overflow-auto p-2 space-y-1"
          >
            {nodes.map((node, index) => (
              <div
                key={index}
                data-path={node.path}
                onClick={() => handleNodeClick(node.path)}
                className={`flex items-center space-x-1 px-2 py-1 rounded cursor-pointer text-xs transition-colors ${
                  currentPath === node.path
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title={node.path}
              >
                <div className={`w-2 h-2 rounded-full ${getNodeColor(node.type)} flex-shrink-0`} />
                                 <div 
                   className="flex-1 truncate"
                   style={{ marginLeft: `${node.level * 8}px` }}
                 >
                   {node.key || (node.type === 'array' ? '[]' : node.type === 'object' ? '{}' : 'value')}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 