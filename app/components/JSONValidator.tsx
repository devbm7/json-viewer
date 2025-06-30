'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Code, Zap, RotateCcw, Copy, Check } from 'lucide-react'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  formatted: string
  size: number
  estimatedMemory: number
}

interface JSONValidatorProps {
  data: any
  onValidated: (result: ValidationResult) => void
  onFormat: (formatted: string) => void
}

export default function JSONValidator({ data, onValidated, onFormat }: JSONValidatorProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const validateJSON = (jsonData: any): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []
    let isValid = true

    try {
      // Basic JSON validation
      const jsonString = JSON.stringify(jsonData)
      JSON.parse(jsonString) // This should always pass for valid objects

      // Size analysis
      const size = new Blob([jsonString]).size
      const estimatedMemory = size * 2 // Rough estimate for memory usage

      // Performance warnings
      if (size > 1024 * 1024) { // 1MB
        warnings.push('Large JSON file detected (>1MB). Consider splitting for better performance.')
      }

      // Structure analysis
      const analyzeStructure = (obj: any, path: string = '') => {
        if (obj === null) return

        if (Array.isArray(obj)) {
          if (obj.length > 1000) {
            warnings.push(`Large array detected at ${path} (${obj.length} items)`)
          }
          
          // Check for mixed types in arrays
          const types = new Set(obj.map(item => typeof item))
          if (types.size > 3) {
            warnings.push(`Mixed types detected in array at ${path}`)
          }

          obj.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              analyzeStructure(item, `${path}[${index}]`)
            }
          })
        } else if (typeof obj === 'object') {
          const keys = Object.keys(obj)
          
          if (keys.length > 50) {
            warnings.push(`Large object detected at ${path} (${keys.length} properties)`)
          }

          // Check for potential issues
          keys.forEach(key => {
            if (key.includes(' ') || key.includes('-')) {
              warnings.push(`Key "${key}" at ${path} contains spaces or hyphens`)
            }
            
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              analyzeStructure(obj[key], `${path}.${key}`)
            }
          })
        }
      }

      analyzeStructure(jsonData)

      // Format the JSON
      const formatted = JSON.stringify(jsonData, null, 2)

      return {
        isValid: true,
        errors,
        warnings,
        formatted,
        size,
        estimatedMemory
      }

    } catch (error) {
      isValid = false
      errors.push(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      return {
        isValid: false,
        errors,
        warnings,
        formatted: '',
        size: 0,
        estimatedMemory: 0
      }
    }
  }

  const formatJSON = (jsonString: string, indent: number = 2): string => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, indent)
    } catch {
      return jsonString
    }
  }

  const minifyJSON = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed)
    } catch {
      return jsonString
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleFormat = () => {
    if (validationResult?.formatted) {
      onFormat(validationResult.formatted)
    }
  }

  const handleMinify = () => {
    if (validationResult?.formatted) {
      const minified = minifyJSON(validationResult.formatted)
      onFormat(minified)
    }
  }

  useEffect(() => {
    if (data) {
      const result = validateJSON(data)
      setValidationResult(result)
      onValidated(result)
    }
  }, [data])

  if (!validationResult) {
    return null
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-semibold text-gray-900 dark:text-white">
                JSON Validation
              </span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              validationResult.isValid 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {validationResult.isValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFormat}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              title="Format JSON"
            >
              <Code className="h-4 w-4" />
              <span>Format</span>
            </button>
            <button
              onClick={handleMinify}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Minify JSON"
            >
              <Zap className="h-4 w-4" />
              <span>Minify</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <RotateCcw className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Size: </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatBytes(validationResult.size)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Memory: </span>
            <span className="font-medium text-gray-900 dark:text-white">
              ~{formatBytes(validationResult.estimatedMemory)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Status: </span>
            <span className={`font-medium ${validationResult.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {validationResult.errors.length > 0 ? `${validationResult.errors.length} error(s)` : 'No errors'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Errors */}
          {validationResult.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                Errors ({validationResult.errors.length})
              </h4>
              <div className="space-y-1">
                {validationResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {validationResult.warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Warnings ({validationResult.warnings.length})
              </h4>
              <div className="space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formatted JSON Preview */}
          {validationResult.isValid && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formatted JSON</h4>
                <button
                  onClick={() => handleCopy(validationResult.formatted)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 max-h-40 overflow-y-auto">
                <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {validationResult.formatted}
                </pre>
              </div>
            </div>
          )}

          {/* No Issues Message */}
          {validationResult.isValid && validationResult.errors.length === 0 && validationResult.warnings.length === 0 && (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                JSON is valid and well-formatted!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 