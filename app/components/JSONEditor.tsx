'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, X, AlertCircle, Check } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface JSONEditorProps {
  data: any
  onSave: (data: any) => void
  onCancel: () => void
}

export default function JSONEditor({ data, onSave, onCancel }: JSONEditorProps) {
  const { currentTheme } = useTheme()
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string>('')
  const [isValid, setIsValid] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const formatted = JSON.stringify(data, null, 2)
      setJsonText(formatted)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError('Failed to format JSON data')
      setIsValid(false)
    }
  }, [data])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setJsonText(text)
    
    // Validate JSON as user types
    try {
      JSON.parse(text)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError('Invalid JSON format')
      setIsValid(false)
    }
  }

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(jsonText)
      onSave(parsedData)
    } catch (err) {
      setError('Invalid JSON format. Cannot save.')
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonText(formatted)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError('Cannot format invalid JSON')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit JSON</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFormat}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {isValid && !error && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <Check className="h-5 w-5 text-green-500" />
          <span className="text-green-700 dark:text-green-400">Valid JSON</span>
        </div>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={jsonText}
          onChange={handleTextChange}
          onScroll={handleScroll}
          style={{
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.foreground,
            borderColor: isValid ? 'rgb(209 213 219)' : 'rgb(252 165 165)'
          }}
          className={`w-full h-96 pl-16 pr-4 py-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-600'
          }`}
          placeholder="Enter JSON data..."
          spellCheck={false}
        />
        
        {/* Line numbers */}
        <div 
          ref={lineNumbersRef}
          style={{
            backgroundColor: currentTheme.mode === 'dark' ? '#374151' : '#f3f4f6',
            color: currentTheme.mode === 'dark' ? '#9ca3af' : '#6b7280',
            borderColor: currentTheme.mode === 'dark' ? '#4b5563' : '#d1d5db'
          }}
          className="absolute left-0 top-0 w-12 h-96 border-r text-xs font-mono overflow-hidden"
        >
          {jsonText.split('\n').map((_, index) => (
            <div key={index} className="h-6 flex items-center justify-center">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>• Use the Format button to automatically format your JSON</p>
        <p>• The editor validates JSON as you type</p>
        <p>• You can only save when the JSON is valid</p>
      </div>
    </div>
  )
} 