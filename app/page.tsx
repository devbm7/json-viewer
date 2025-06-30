'use client'

import { useState } from 'react'
import { Upload, Download, Edit3, Eye, FileText, X, Search, CheckCircle } from 'lucide-react'
import JSONViewer from './components/JSONViewer'
import JSONEditor from './components/JSONEditor'
import FileUpload from './components/FileUpload'
import DarkModeToggle from './components/DarkModeToggle'
import AdvancedSearch from './components/AdvancedSearch'
import JSONValidator from './components/JSONValidator'
import JSONStats from './components/JSONStats'
import SearchResults from './components/SearchResults'

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
  const [jsonData, setJsonData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleFileUpload = (data: any, name: string) => {
    setJsonData(data)
    setFileName(name)
    setIsEditing(false)
    setSearchResults([])
    setSearchQuery('')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleView = () => {
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
    // For now, just expand the search to show the path
    // In a more advanced implementation, you could scroll to the specific node
    console.log('Navigate to path:', path)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors w-full max-w-full overflow-hidden">
      <div className="container mx-auto px-4 py-8 w-full max-w-full overflow-hidden">
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

        {!jsonData ? (
          <div className="max-w-2xl mx-auto w-full max-w-full overflow-hidden">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-full overflow-hidden">
            {/* Header with file info and actions */}
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
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleView}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Validate</span>
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  
                  <button
                    onClick={handleClear}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Search */}
            {showSearch && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full max-w-full overflow-hidden">
                <AdvancedSearch 
                  data={jsonData}
                  onSearchResults={handleSearchResults}
                  onClear={handleSearchClear}
                />
              </div>
            )}

            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <SearchResults 
                results={searchResults}
                query={searchQuery}
                onNavigateToPath={handleNavigateToPath}
              />
            )}

            {/* JSON Validation */}
            {showValidation && (
              <JSONValidator 
                data={jsonData}
                onValidated={handleValidated}
                onFormat={handleFormat}
              />
            )}

            {/* JSON Statistics */}
            <JSONStats data={jsonData} />

            {/* JSON Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-full overflow-hidden">
              {isEditing ? (
                <JSONEditor 
                  data={jsonData} 
                  onSave={setJsonData}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <JSONViewer 
                  data={jsonData} 
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 