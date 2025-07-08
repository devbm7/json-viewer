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

// Comprehensive state interface for better state management
interface AppState {
  // Core data
  jsonData: any
  fileName: string
  
  // View mode (view, edit, side-by-side)
  currentMode: 'view' | 'edit' | 'side-by-side'
  
  // Navigation state
  currentPath: string
  
  // Search state
  searchResults: SearchResult[]
  searchQuery: string
  showSearch: boolean
  showSearchResults: boolean
  
  // Validation state
  validationResult: ValidationResult | null
  showValidation: boolean
  
  // UI state
  showKeyboardShortcuts: boolean
  sidebarCollapsed: boolean
  
  // Scroll position and view state (for better UX)
  scrollPosition: number
  expandedNodes: Set<string> // Track which nodes are expanded in the JSON viewer
  editorScrollPosition: number // For editor mode
  sideBySideEditorWidth: number // For side-by-side mode
}

export default function Home() {
  const { isDark, currentTheme, setCurrentTheme } = useTheme()
  
  // Comprehensive state management
  const [appState, setAppState] = useState<AppState>({
    jsonData: null,
    fileName: '',
    currentMode: 'view',
    currentPath: '',
    searchResults: [],
    searchQuery: '',
    showSearch: false,
    showSearchResults: false,
    validationResult: null,
    showValidation: false,
    showKeyboardShortcuts: false,
    sidebarCollapsed: false,
    scrollPosition: 0,
    expandedNodes: new Set(),
    editorScrollPosition: 0,
    sideBySideEditorWidth: 50 // Percentage for side-by-side editor width
  })

  // Helper function to update specific state properties
  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  // Helper function to update state while preserving certain properties
  const updateStatePreserving = (updates: Partial<AppState>, preserveKeys: (keyof AppState)[] = []) => {
    setAppState(prev => {
      const preserved: Partial<AppState> = {}
      preserveKeys.forEach(key => {
        preserved[key] = prev[key]
      })
      return { ...prev, ...updates, ...preserved }
    })
  }

  // Helper function to toggle expanded nodes
  const toggleExpandedNode = (path: string) => {
    setAppState(prev => {
      const newExpandedNodes = new Set(prev.expandedNodes)
      if (newExpandedNodes.has(path)) {
        newExpandedNodes.delete(path)
      } else {
        newExpandedNodes.add(path)
      }
      return { ...prev, expandedNodes: newExpandedNodes }
    })
  }

  // Helper function to update scroll position
  const updateScrollPosition = (position: number) => {
    updateState({ scrollPosition: position })
  }

  // Helper function to update editor scroll position
  const updateEditorScrollPosition = (position: number) => {
    updateState({ editorScrollPosition: position })
  }

  // Helper function to update side-by-side editor width
  const updateSideBySideWidth = (width: number) => {
    updateState({ sideBySideEditorWidth: width })
  }

  const handleFileUpload = (data: any, name: string) => {
    updateState({
      jsonData: data,
      fileName: name,
      currentMode: 'view',
      currentPath: '',
      searchResults: [],
      searchQuery: '',
      showSearch: false,
      showSearchResults: false,
      validationResult: null,
      showValidation: false,
      scrollPosition: 0,
      expandedNodes: new Set(),
      editorScrollPosition: 0,
      sideBySideEditorWidth: 50
    })
  }

  const handleEdit = () => {
    // Preserve navigation state, search state, and UI state when switching to edit mode
    updateStatePreserving(
      { currentMode: 'edit' },
      ['currentPath', 'searchResults', 'searchQuery', 'showSearch', 'showSearchResults', 'validationResult', 'showValidation', 'expandedNodes']
    )
  }

  const handleView = () => {
    // Preserve navigation state, search state, and UI state when switching to view mode
    updateStatePreserving(
      { currentMode: 'view' },
      ['currentPath', 'searchResults', 'searchQuery', 'showSearch', 'showSearchResults', 'validationResult', 'showValidation', 'expandedNodes', 'scrollPosition']
    )
  }

  const handleSideBySide = () => {
    // Preserve navigation state, search state, and UI state when switching to side-by-side mode
    updateStatePreserving(
      { currentMode: 'side-by-side' },
      ['currentPath', 'searchResults', 'searchQuery', 'showSearch', 'showSearchResults', 'validationResult', 'showValidation', 'expandedNodes']
    )
  }

  const handleDownload = () => {
    if (!appState.jsonData) return

    const dataStr = JSON.stringify(appState.jsonData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = appState.fileName || 'data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    updateState({
      jsonData: null,
      fileName: '',
      currentMode: 'view',
      currentPath: '',
      searchResults: [],
      searchQuery: '',
      showSearch: false,
      showSearchResults: false,
      validationResult: null,
      showValidation: false,
      scrollPosition: 0,
      expandedNodes: new Set(),
      editorScrollPosition: 0,
      sideBySideEditorWidth: 50
    })
  }

  const handleSearchResults = (results: SearchResult[], query: string) => {
    updateState({
      searchResults: results.slice(0, 10), // Limit to first 10 results
      searchQuery: query,
      showSearchResults: results.length > 0
    })
  }

  const handleSearchClear = () => {
    updateState({
      searchResults: [],
      searchQuery: '',
      showSearchResults: false
    })
  }

  const handleValidated = (result: ValidationResult) => {
    updateState({ validationResult: result })
  }

  const handleFormat = (formatted: string) => {
    try {
      const parsed = JSON.parse(formatted)
      updateState({ jsonData: parsed })
    } catch (error) {
      console.error('Failed to parse formatted JSON:', error)
    }
  }

  const handleNavigateToPath = (path: string) => {
    updateState({ currentPath: path })
    // In a more advanced implementation, you could scroll to the specific node
    console.log('Navigate to path:', path)
  }

  const handleKeyboardShortcuts = () => {
    updateState({ showKeyboardShortcuts: !appState.showKeyboardShortcuts })
  }

  const handleToggleSearch = () => {
    updateState({ showSearch: !appState.showSearch })
  }

  const handleToggleValidation = () => {
    updateState({ showValidation: !appState.showValidation })
  }

  const handleToggleSidebar = () => {
    updateState({ sidebarCollapsed: !appState.sidebarCollapsed })
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

  const availablePaths = appState.jsonData ? extractPaths(appState.jsonData) : []

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
            if (appState.jsonData && appState.currentMode !== 'edit') handleEdit()
            break
          case 'q':
            e.preventDefault()
            if (appState.jsonData && appState.currentMode !== 'view') handleView()
            break
          case 'b':
            e.preventDefault()
            if (appState.jsonData && appState.currentMode !== 'side-by-side') handleSideBySide()
            break
          case 's':
            e.preventDefault()
            if (appState.jsonData) handleDownload()
            break
          case 'k':
            e.preventDefault()
            if (appState.jsonData) handleClear()
            break
          case 'f':
            e.preventDefault()
            if (appState.jsonData) handleToggleSearch()
            break
          case '/':
            e.preventDefault()
            handleKeyboardShortcuts()
            break
          case 'r':
            e.preventDefault()
            if (appState.jsonData) handleNavigateToPath('')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [appState.jsonData, appState.currentMode, appState.showSearch, appState.showKeyboardShortcuts])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors w-full max-w-full overflow-hidden">
      {/* Sidebar */}
      {appState.jsonData && (
        <Sidebar
          onToggleSearch={handleToggleSearch}
          onToggleValidation={handleToggleValidation}
          onDownload={handleDownload}
          onClear={handleClear}
          showSearch={appState.showSearch}
          showValidation={appState.showValidation}
          onKeyboardShortcuts={handleKeyboardShortcuts}
          isCollapsed={appState.sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      )}

      <div className={`${appState.jsonData ? (appState.sidebarCollapsed ? 'ml-12' : 'ml-64') : ''} transition-all duration-300`}>
        <div className={`${appState.currentMode === 'side-by-side' ? 'px-2 py-2' : 'container mx-auto px-4 py-8'} w-full max-w-full overflow-hidden`}>
          {appState.currentMode !== 'side-by-side' && (
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

          {!appState.jsonData ? (
            <div className="max-w-2xl mx-auto w-full max-w-full overflow-hidden">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          ) : (
            <div className="space-y-6 w-full max-w-full overflow-hidden">
              {/* Header with file info and actions */}
              {appState.currentMode !== 'side-by-side' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center space-x-3 min-w-0">
                      <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900 dark:text-white truncate">{appState.fileName}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {typeof appState.jsonData === 'object' ? 'JSON Object' : 'JSON Array'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {appState.currentMode === 'view' ? (
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
                        onClick={handleToggleSearch}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          appState.showSearch 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                        }`}
                        title="Search JSON (Ctrl+F)"
                      >
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </button>
                      
                      <button
                        onClick={handleToggleValidation}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          appState.showValidation 
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
              {appState.currentMode !== 'side-by-side' && appState.showSearch && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
                  <AdvancedSearch 
                    data={appState.jsonData}
                    onSearchResults={handleSearchResults}
                    onClear={handleSearchClear}
                  />
                </div>
              )}

              {/* Search Results */}
              {appState.currentMode !== 'side-by-side' && appState.showSearchResults && appState.searchResults.length > 0 && (
                <SearchResults 
                  results={appState.searchResults}
                  query={appState.searchQuery}
                  onNavigateToPath={handleNavigateToPath}
                />
              )}

              {/* JSON Validation */}
              {appState.currentMode !== 'side-by-side' && appState.showValidation && (
                <JSONValidator 
                  data={appState.jsonData}
                  onValidated={handleValidated}
                  onFormat={handleFormat}
                />
              )}

              {/* JSON Statistics */}
              {appState.currentMode !== 'side-by-side' && <JSONStats data={appState.jsonData} />}

              {/* Navigation Tools */}
              {appState.currentMode !== 'side-by-side' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h3>
                    <div className="flex items-center space-x-2">
                      <GoToPath onNavigate={handleNavigateToPath} availablePaths={availablePaths} />
                    </div>
                  </div>
                  
                  <BreadcrumbNavigation path={appState.currentPath} onNavigate={handleNavigateToPath} />
                  
                  {appState.currentPath && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          Current location: <code className="font-mono">{appState.currentPath}</code>
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
                  
                  {/* State Preservation Indicator */}
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-700 dark:text-green-300">
                        State preserved: {appState.expandedNodes.size} expanded nodes, 
                        {appState.searchResults.length > 0 && ` ${appState.searchResults.length} search results,`}
                        {appState.currentPath && ` at path "${appState.currentPath}"`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* JSON Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-full overflow-hidden">
                {appState.currentMode === 'edit' ? (
                  <JSONEditor 
                    data={appState.jsonData} 
                    onSave={(data) => updateState({ jsonData: data })}
                    onCancel={handleView}
                  />
                ) : appState.currentMode === 'side-by-side' ? (
                  <div className="h-[calc(100vh-200px)] min-h-[900px]">
                    <SideBySideEditor 
                      data={appState.jsonData} 
                      onSave={(data) => updateState({ jsonData: data })}
                      onCancel={handleView}
                    />
                  </div>
                ) : (
                  <JSONViewer 
                    data={appState.jsonData} 
                    searchResults={appState.searchResults}
                    searchQuery={appState.searchQuery}
                    onNavigate={handleNavigateToPath}
                    currentPath={appState.currentPath}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Map */}
      {appState.jsonData && appState.currentMode === 'view' && (
        <JSONMiniMap 
          data={appState.jsonData}
          onNavigate={handleNavigateToPath}
          currentPath={appState.currentPath}
        />
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onEdit={handleEdit}
        onView={handleView}
        onSideBySide={handleSideBySide}
        onDownload={handleDownload}
        onClear={handleClear}
        isOpen={appState.showKeyboardShortcuts}
        onToggle={handleKeyboardShortcuts}
      />
    </div>
  )
} 