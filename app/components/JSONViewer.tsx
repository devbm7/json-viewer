'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronRight, Copy, Check, Expand, Minimize, Eye, Code } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface JSONViewerProps {
  data: any
  searchResults?: Array<{ path: string; value: any; type: string; parentKey?: string }>
  searchQuery?: string
  onNavigate?: (path: string) => void
  currentPath?: string
}

interface JSONNodeProps {
  data: any
  level?: number
  path?: string
  forceExpanded?: boolean
  forceCollapsed?: boolean
  searchResults?: Array<{ path: string; value: any; type: string; parentKey?: string }>
  searchQuery?: string
  onNavigate?: (path: string) => void
  currentPath?: string
  isFocused?: boolean
  onFocus?: (path: string) => void
  expandedPaths?: Set<string>
}

function JSONNode({ data, level = 0, path = '', forceExpanded, forceCollapsed, searchResults, searchQuery, onNavigate, currentPath, isFocused, onFocus, expandedPaths }: JSONNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const [copied, setCopied] = useState(false)
  const [markdownViewMode, setMarkdownViewMode] = useState<'compiled' | 'raw'>('compiled')

  // Override local state if force flags are set or if path is in expandedPaths
  // But allow manual toggle to override expandedPaths
  const shouldExpand = forceExpanded !== undefined ? forceExpanded : 
                      (expandedPaths?.has(path) && level < 2) ? true : isExpanded
  const shouldCollapse = forceCollapsed !== undefined ? forceCollapsed : !shouldExpand

  const indent = '  '.repeat(level)
  const isObject = data !== null && typeof data === 'object'
  const isArray = Array.isArray(data)
  const isString = typeof data === 'string'
  const isMarkdown = isString && (data.includes('#') || data.includes('**') || data.includes('`') || data.includes('['))

  // Check if this node matches search results
  const isSearchMatch = searchResults?.some(result => result.path === path)
  const isSearchParent = searchResults?.some(result => result.path.startsWith(path + '.') || result.path.startsWith(path + '['))
  
  // Highlight text if it matches search query
  const highlightText = (text: string) => {
    if (!searchQuery || !text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return text
    }
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index}>
          {part}
        </mark>
      ) : part
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleExpanded = () => {
    if (forceExpanded === undefined && forceCollapsed === undefined) {
      setIsExpanded(!isExpanded)
      // If manually expanding, add to expandedPaths
      if (!isExpanded && expandedPaths) {
        const newExpandedPaths = new Set(expandedPaths)
        newExpandedPaths.add(path)
        // Note: We can't directly update expandedPaths here as it's passed as prop
        // The parent component should handle this
      }
    }
  }

  if (isObject) {
    const keys = Array.isArray(data) ? data.map((_, index) => index.toString()) : Object.keys(data)
    const isEmpty = keys.length === 0

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!onNavigate) return

      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          onNavigate(path)
          break
        case 'ArrowRight':
          if (!isExpanded && keys.length > 0) {
            e.preventDefault()
            setIsExpanded(true)
          }
          break
        case 'ArrowLeft':
          if (isExpanded) {
            e.preventDefault()
            setIsExpanded(false)
          }
          break
      }
    }

    const handleClick = () => {
      onFocus?.(path)
    }

    return (
      <div 
        className={`json-node ${isSearchMatch ? 'search-match' : ''} ${isSearchParent ? 'search-parent' : ''} ${
          isFocused ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        data-path={path}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        <div className="flex items-center">
          <button
            onClick={toggleExpanded}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mr-1 text-gray-600 dark:text-gray-400 flex-shrink-0"
            disabled={isEmpty || forceExpanded !== undefined || forceCollapsed !== undefined}
          >
            {isEmpty ? (
              <div className="w-4 h-4" />
            ) : shouldExpand ? (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          <span className="json-bracket flex-shrink-0">{isArray ? '[' : '{'}</span>
          
          {!isEmpty && shouldCollapse && (
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              {isArray ? `${keys.length} items` : `${keys.length} properties`}
            </span>
          )}
          
          {!isEmpty && shouldExpand && (
            <button
              onClick={handleCopy}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>

        {shouldExpand && (
          <div className="ml-4">
            {keys.map((key, index) => {
              const childPath = Array.isArray(data) 
                ? (path ? `${path}[${key}]` : `[${key}]`)
                : (path ? `${path}.${key}` : key)
              const isChildMatch = searchResults?.some(result => result.path === childPath)
              const isChildParent = searchResults?.some(result => result.path.startsWith(childPath + '.') || result.path.startsWith(childPath + '['))
              
              return (
                <div key={key} className={`flex ${isChildMatch ? 'search-match' : ''} ${isChildParent ? 'search-parent' : ''}`} data-path={childPath}>
                  <span className="text-gray-400 dark:text-gray-500 select-none flex-shrink-0">
                    {indent}
                  </span>
                  <span className="json-key flex-shrink-0">"{highlightText(key)}"</span>
                  <span className="json-comma flex-shrink-0">: </span>
                  <div className="flex-1">
                    <JSONNode
                      data={data[key]}
                      level={level + 1}
                      path={childPath}
                      forceExpanded={forceExpanded}
                      forceCollapsed={forceCollapsed}
                      searchResults={searchResults}
                      searchQuery={searchQuery}
                      onNavigate={onNavigate}
                      currentPath={currentPath}
                      isFocused={currentPath === childPath}
                      onFocus={onFocus}
                      expandedPaths={expandedPaths}
                    />
                  </div>
                  {index < keys.length - 1 && (
                    <span className="json-comma flex-shrink-0">,</span>
                  )}
                </div>
              )
            })}
            <div className="flex">
              <span className="text-gray-400 dark:text-gray-500 select-none flex-shrink-0">
                {indent}
              </span>
              <span className="json-bracket flex-shrink-0">
                {isArray ? ']' : '}'}
              </span>
            </div>
          </div>
        )}

        {shouldCollapse && (
          <span className="json-bracket flex-shrink-0">
            {isArray ? ']' : '}'}
          </span>
        )}
      </div>
    )
  }

  if (isString) {
    if (isMarkdown) {
      return (
        <div className="json-string" data-path={path}>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Markdown Content:</div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => setMarkdownViewMode('compiled')}
                  className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
                    markdownViewMode === 'compiled'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="View compiled markdown"
                >
                  <Eye className="h-3 w-3" />
                  <span>Compiled</span>
                </button>
                <button
                  onClick={() => setMarkdownViewMode('raw')}
                  className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
                    markdownViewMode === 'raw'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="View raw markdown"
                >
                  <Code className="h-3 w-3" />
                  <span>Raw</span>
                </button>
              </div>
            </div>
            <div className="markdown-content">
              {markdownViewMode === 'compiled' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data}
                </ReactMarkdown>
              ) : (
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto break-words">
                  {data}
                </pre>
              )}
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <span className="json-string" data-path={path}>"{highlightText(data)}"</span>
    )
  }

  if (typeof data === 'number') {
    return <span className="json-number" data-path={path}>{highlightText(String(data))}</span>
  }

  if (typeof data === 'boolean') {
    return <span className="json-boolean" data-path={path}>{highlightText(data.toString())}</span>
  }

  if (data === null) {
    return <span className="json-null" data-path={path}>{highlightText('null')}</span>
  }

  return <span data-path={path}>{highlightText(String(data))}</span>
}

export default function JSONViewer({ data, searchResults, searchQuery, onNavigate, currentPath }: JSONViewerProps) {
  const [expandAll, setExpandAll] = useState(false)
  const [collapseAll, setCollapseAll] = useState(false)
  const [focusedPath, setFocusedPath] = useState('')
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const handleExpandAll = () => {
    setExpandAll(true)
    setCollapseAll(false)
  }

  const handleCollapseAll = () => {
    setCollapseAll(true)
    setExpandAll(false)
  }

  const handleReset = () => {
    setExpandAll(false)
    setCollapseAll(false)
  }

  const handleFocus = (path: string) => {
    setFocusedPath(path)
  }

  // Expand path to make it visible
  const expandPathToTarget = useCallback((targetPath: string) => {
    if (!targetPath) {
      setExpandedPaths(new Set())
      return
    }
    
    const newExpandedPaths = new Set(expandedPaths)
    
    // Split path by both dots and brackets, but keep brackets with their content
    const pathParts: string[] = []
    let currentPart = ''
    let inBrackets = false
    
    for (let i = 0; i < targetPath.length; i++) {
      const char = targetPath[i]
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
    
    // Expand all parent paths
    for (let i = 0; i < pathParts.length; i++) {
      const parentPath = pathParts.slice(0, i + 1).join('')
      newExpandedPaths.add(parentPath)
    }
    
    setExpandedPaths(newExpandedPaths)
    
    // Scroll to the target element after a short delay
    setTimeout(() => {
      const targetElement = document.querySelector(`[data-path="${targetPath}"]`)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add highlight effect
        targetElement.classList.add('highlight-navigation')
        setTimeout(() => {
          targetElement.classList.remove('highlight-navigation')
        }, 2000)
      } else {
        // If exact path not found, try to find a parent path
        const parentPaths = pathParts.map((_, index) => pathParts.slice(0, index + 1).join(''))
        for (const parentPath of parentPaths.reverse()) {
          const parentElement = document.querySelector(`[data-path="${parentPath}"]`)
          if (parentElement) {
            parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            parentElement.classList.add('highlight-navigation')
            setTimeout(() => {
              parentElement.classList.remove('highlight-navigation')
            }, 2000)
            break
          }
        }
      }
    }, 200)
  }, [expandedPaths])

  // Handle navigation from parent component
  useEffect(() => {
    if (currentPath) {
      expandPathToTarget(currentPath)
    } else {
      // Reset expanded paths when navigating to root
      setExpandedPaths(new Set())
    }
  }, [currentPath])

  return (
    <div className="p-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">JSON Viewer</h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleExpandAll}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            title="Expand all nodes"
          >
            <Expand className="h-4 w-4" />
            <span>Expand All</span>
          </button>
          <button
            onClick={handleCollapseAll}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Collapse all nodes"
          >
            <Minimize className="h-4 w-4" />
            <span>Collapse All</span>
          </button>
          {(expandAll || collapseAll) && (
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Reset to default state"
            >
              Reset
            </button>
          )}
          {currentPath && (
            <button
              onClick={() => onNavigate?.('')}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              title="Reset navigation (Ctrl+R)"
            >
              Reset Nav
            </button>
          )}
        </div>
      </div>
      
      <div className="json-viewer text-sm w-full max-w-full overflow-hidden">
        <JSONNode 
          data={data} 
          forceExpanded={expandAll ? true : undefined}
          forceCollapsed={collapseAll ? true : undefined}
          searchResults={searchResults}
          searchQuery={searchQuery}
          onNavigate={onNavigate}
          currentPath={currentPath}
          isFocused={focusedPath === ''}
          onFocus={handleFocus}
          expandedPaths={expandedPaths}
        />
      </div>
    </div>
  )
} 