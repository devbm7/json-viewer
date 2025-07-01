'use client'

import { useState, useEffect } from 'react'
import { Upload, Download, Edit3, Eye, FileText, X, Search, CheckCircle, Split } from 'lucide-react'
import JSONViewer from './components/JSONViewer'
import JSONEditor from './components/JSONEditor'
import SideBySideEditor from './components/SideBySideEditor'
import FileUpload from './components/FileUpload'
import DarkModeToggle from './components/DarkModeToggle'
import AdvancedSearch from './components/AdvancedSearch'
import JSONValidator from './components/JSONValidator'
import JSONStats from './components/JSONStats'
import SearchResults from './components/SearchResults'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import BreadcrumbNavigation from './components/BreadcrumbNavigation'
import GoToPath from './components/GoToPath'
import JSONMiniMap from './components/JSONMiniMap'
import Sidebar from './components/Sidebar'
import { useTheme } from './contexts/ThemeContext'

interface SearchResult {
  path: string
  value: any
  type: string
  parentKey?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  formatted: string
  size: number
  estimatedMemory: number
}

export default function Home() {
  const { isDark, currentTheme, setCurrentTheme } = useTheme()
  const [jsonData, setJsonData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSideBySide, setIsSideBySide] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleFileUpload = (data: any, name: string) => {
    setJsonData(data)
    setFileName(name)
    setIsEditing(false)
    setIsSideBySide(false)
    setSearchResults([])
    setSearchQuery('')
  }

  const handleEdit = () => {
    setIsEditing(true)
    setIsSideBySide(false)
  }

  const handleView = () => {
    setIsEditing(false)
    setIsSideBySide(false)
  }

  const handleSideBySide = () => {
    setIsSideBySide(true)
    setIsEditing(false)
  }

  const handleDownload = () => {
    if (!jsonData) return

    const dataStr = JSON.stringify(jsonData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setJsonData(null)
    setFileName('')
    setIsEditing(false)
    setIsSideBySide(false)
    setSearchResults([])
    setSearchQuery('')
    setValidationResult(null)
  }

  const handleSearchResults = (results: SearchResult[], query: string) => {
    setSearchResults(results.slice(0, 10)) // Limit to first 10 results
    setSearchQuery(query)
    setShowSearchResults(results.length > 0)
  }

  const handleSearchClear = () => {
    setSearchResults([])
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const handleValidated = (result: ValidationResult) => {
    setValidationResult(result)
  }

  const handleFormat = (formatted: string) => {
    try {
      const parsed = JSON.parse(formatted)
      setJsonData(parsed)
    } catch (error) {
      console.error('Failed to parse formatted JSON:', error)
    }
  }

  const handleNavigateToPath = (path: string) => {
    setCurrentPath(path)
    // In a more advanced implementation, you could scroll to the specific node
    console.log('Navigate to path:', path)
  }

  const handleKeyboardShortcuts = () => {
    setShowKeyboardShortcuts(!showKeyboardShortcuts)
  }

  // Extract all available paths for GoToPath component
  const extractPaths = (obj: any, path: string = ''): string[] => {
    const paths: string[] = []
    
    if (obj === null || typeof obj !== 'object') {
      return paths
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const childPath = path ? `${path}[${index}]` : `[${index}]`
        paths.push(childPath)
        paths.push(...extractPaths(item, childPath))
      })
    } else {
      Object.keys(obj).forEach(key => {
        const childPath = path ? `${path}.${key}` : key
        paths.push(childPath)
        paths.push(...extractPaths(obj[key], childPath))
      })
    }
    
    return paths
  }

  const availablePaths = jsonData ? extractPaths(jsonData) : []

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // More robust: check if target or any ancestor is input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      const isInput = target && (
        target.closest('input, textarea, [contenteditable="true"]') ||
        (target as HTMLElement).isContentEditable
      );
      if ((e.ctrlKey || e.metaKey) && !isInput) {
        switch (e.key) {
          case 'e':
            e.preventDefault()
            if (jsonData && !isEditing && !isSideBySide) handleEdit()
            break
          case 'q':
            e.preventDefault()
            if (jsonData && (isEditing || isSideBySide)) handleView()
            break
          case 'b':
            e.preventDefault()
            if (jsonData && !isSideBySide && !isEditing) handleSideBySide()
            break
          case 's':
            e.preventDefault()
            if (jsonData) handleDownload()
            break
          case 'k':
            e.preventDefault()
            if (jsonData) handleClear()
            break
          case 'f':
            e.preventDefault()
            if (jsonData) setShowSearch(!showSearch)
            break
          case '/':
            e.preventDefault()
            setShowKeyboardShortcuts(!showKeyboardShortcuts)
            break
          case 'r':
            e.preventDefault()
            if (jsonData) handleNavigateToPath('')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [jsonData, isEditing, isSideBySide, showSearch, showKeyboardShortcuts])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors w-full max-w-full overflow-hidden">
      {/* Sidebar */}
      {jsonData && (
        <Sidebar
          onToggleSearch={() => setShowSearch(!showSearch)}
          onToggleValidation={() => setShowValidation(!showValidation)}
          onDownload={handleDownload}
          onClear={handleClear}
          showSearch={showSearch}
          showValidation={showValidation}
          onKeyboardShortcuts={handleKeyboardShortcuts}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

              <div className={`${jsonData ? (sidebarCollapsed ? 'ml-12' : 'ml-64') : ''} transition-all duration-300`}>
          <div className={`${isSideBySide ? 'px-2 py-2' : 'container mx-auto px-4 py-8'} w-full max-w-full overflow-hidden`}>
        {!isSideBySide && (
          <header className="text-center mb-8 w-full max-w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 min-w-0">
              <div></div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white truncate">
                JSON Viewer
              </h1>
              <DarkModeToggle />
            </div>
            <p className="text-gray-600 dark:text-gray-400 w-full max-w-full overflow-hidden">
              Upload, view, edit, and download JSON files with advanced search and validation
            </p>
          </header>
        )}

        {!jsonData ? (
          <div className="max-w-2xl mx-auto w-full max-w-full overflow-hidden">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-full overflow-hidden">
            {/* Header with file info and actions */}
            {!isSideBySide && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center space-x-3 min-w-0">
                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 dark:text-white truncate">{fileName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {typeof jsonData === 'object' ? 'JSON Object' : 'JSON Array'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!isEditing && !isSideBySide ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Edit JSON (Ctrl+E)"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleSideBySide}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        title="Side-by-Side Editor (Ctrl+B)"
                      >
                        <Split className="h-4 w-4" />
                        <span>Side-by-Side</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleView}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="View JSON (Ctrl+Q)"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      showSearch 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                    title="Search JSON (Ctrl+F)"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                  
                  <button
                    onClick={() => setShowValidation(!showValidation)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      showValidation 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                    title="Validate JSON"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Validate</span>
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    title="Download JSON (Ctrl+S)"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  
                  <button
                    onClick={handleClear}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Clear JSON (Ctrl+K)"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Advanced Search */}
            {!isSideBySide && showSearch && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
                <AdvancedSearch 
                  data={jsonData}
                  onSearchResults={handleSearchResults}
                  onClear={handleSearchClear}
                />
              </div>
            )}

            {/* Search Results */}
            {!isSideBySide && showSearchResults && searchResults.length > 0 && (
              <SearchResults 
                results={searchResults}
                query={searchQuery}
                onNavigateToPath={handleNavigateToPath}
              />
            )}

            {/* JSON Validation */}
            {!isSideBySide && showValidation && (
              <JSONValidator 
                data={jsonData}
                onValidated={handleValidated}
                onFormat={handleFormat}
              />
            )}

            {/* JSON Statistics */}
            {!isSideBySide && <JSONStats data={jsonData} />}

            {/* Navigation Tools */}
            {!isSideBySide && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h3>
                <div className="flex items-center space-x-2">
                  <GoToPath onNavigate={handleNavigateToPath} availablePaths={availablePaths} />
                </div>
              </div>
              
              <BreadcrumbNavigation path={currentPath} onNavigate={handleNavigateToPath} />
              
              {currentPath && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Current location: <code className="font-mono">{currentPath}</code>
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleNavigateToPath('')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        Go to root
                      </button>
                      <button
                        onClick={() => handleNavigateToPath('')}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Reset View
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* JSON Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-full overflow-hidden">
              {isEditing ? (
                <JSONEditor 
                  data={jsonData} 
                  onSave={setJsonData}
                  onCancel={() => setIsEditing(false)}
                />
              ) : isSideBySide ? (
                <div className="h-[calc(100vh-200px)] min-h-[900px]">
                  <SideBySideEditor 
                    data={jsonData} 
                    onSave={setJsonData}
                    onCancel={() => setIsSideBySide(false)}
                  />
                </div>
              ) : (
                <JSONViewer 
                  data={jsonData} 
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                  onNavigate={handleNavigateToPath}
                  currentPath={currentPath}
                />
              )}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Mini Map */}
      {jsonData && !isEditing && !isSideBySide && (
        <JSONMiniMap 
          data={jsonData}
          onNavigate={handleNavigateToPath}
          currentPath={currentPath}
        />
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onEdit={handleEdit}
        onView={handleView}
        onSideBySide={handleSideBySide}
        onDownload={handleDownload}
        onClear={handleClear}
        isOpen={showKeyboardShortcuts}
        onToggle={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
      />
    </div>
  )
} 