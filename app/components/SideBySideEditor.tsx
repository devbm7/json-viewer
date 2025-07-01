'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, X, AlertCircle, Check, Eye, Code, Split } from 'lucide-react'
import JSONViewer from './JSONViewer'
import { useTheme } from '../contexts/ThemeContext'

interface SideBySideEditorProps {
  data: any
  onSave: (data: any) => void
  onCancel: () => void
}

export default function SideBySideEditor({ data, onSave, onCancel }: SideBySideEditorProps) {
  const { currentTheme } = useTheme()
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string>('')
  const [isValid, setIsValid] = useState(true)
  const [parsedData, setParsedData] = useState<any>(data)
  const [showPreview, setShowPreview] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // New: State for adjustable width (percentage of editor panel)
  const [editorWidthPercent, setEditorWidthPercent] = useState(50)
  const draggingRef = useRef(false)

  // Minimum width for each panel (in percent)
  const MIN_WIDTH = 10
  const MAX_WIDTH = 100

  // New: Mouse event handlers for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return
    const container = document.getElementById('side-by-side-container')
    if (!container) return
    const rect = container.getBoundingClientRect()
    let percent = ((e.clientX - rect.left) / rect.width) * 100
    if (percent < 0) percent = 0
    if (percent > 100) percent = 100
    setEditorWidthPercent(percent)
  }

  const handleMouseUp = () => {
    draggingRef.current = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const handleDividerMouseDown = () => {
    draggingRef.current = true
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    try {
      const formatted = JSON.stringify(data, null, 2)
      setJsonText(formatted)
      setParsedData(data)
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
    
    // Validate JSON as user types and update preview
    try {
      const parsed = JSON.parse(text)
      setParsedData(parsed)
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
      setParsedData(parsed)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError('Cannot format invalid JSON')
    }
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Split className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Side-by-Side Editor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
            <span className="text-sm">{showPreview ? 'Preview' : 'Code Only'}</span>
          </button>
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

      {/* Status Messages */}
      {(error || isValid) && (
        <div className="px-4 py-2">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {isValid && !error && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-green-700 dark:text-green-400">Valid JSON - Preview updated in real-time</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div id="side-by-side-container" className={`flex-1 flex ${showPreview ? 'flex-row' : 'flex-col'} min-h-0 overflow-hidden relative`}>
        {/* Editor Panel */}
        <div
          style={showPreview ? { width: `${editorWidthPercent}%`, transition: draggingRef.current ? 'none' : 'width 0.15s' } : { width: '100%' }}
          className={`flex flex-col border-r border-gray-200 dark:border-gray-700 min-h-0`}
        >
          <div className="flex-1 relative min-h-0 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={jsonText}
              onChange={handleTextChange}
              onScroll={handleScroll}
              style={{
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.foreground
              }}
              className={`w-full h-full pl-16 pr-4 py-4 font-mono text-sm border-0 resize-none focus:outline-none focus:ring-0 overflow-auto ${
                isValid ? '' : 'border-red-300 dark:border-red-600'
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
              className="absolute left-0 top-0 w-12 h-full border-r text-xs font-mono overflow-hidden"
            >
              {jsonText.split('\n').map((_, index) => (
                <div key={index} className="h-6 flex items-center justify-center">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Draggable Divider */}
        {showPreview && (
          <div
            style={{ cursor: 'col-resize', width: 4, zIndex: 10 }}
            className="relative bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors"
            onMouseDown={handleDividerMouseDown}
            onDoubleClick={() => setEditorWidthPercent(50)}
            aria-label="Resize editor and preview panels"
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-blue-400 dark:bg-blue-500 rounded" style={{ opacity: 0.5 }} />
          </div>
        )}

        {/* Preview Panel */}
        {showPreview && (
          <div
            style={{ 
              width: `${100 - editorWidthPercent}%`, 
              transition: draggingRef.current ? 'none' : 'width 0.15s',
              backgroundColor: currentTheme.colors.background
            }}
            className="flex flex-col min-h-0 overflow-hidden"
          >
            <div className="flex-1 overflow-auto">
              {isValid ? (
                <JSONViewer 
                  data={parsedData}
                  onNavigate={() => {}}
                />
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                  <p>Preview unavailable due to invalid JSON</p>
                  <p className="text-sm mt-2">Fix the syntax errors in the editor to see the preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>• Edit JSON on the left and see live preview on the right</p>
          <p>• Use the Format button to automatically format your JSON</p>
          <p>• Toggle between side-by-side and code-only modes</p>
          <p>• You can only save when the JSON is valid</p>
        </div>
      </div>
    </div>
  )
} 