'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface JSONViewerProps {
  data: any
}

interface JSONNodeProps {
  data: any
  level?: number
  path?: string
}

function JSONNode({ data, level = 0, path = '' }: JSONNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const [copied, setCopied] = useState(false)

  const indent = '  '.repeat(level)
  const isObject = data !== null && typeof data === 'object'
  const isArray = Array.isArray(data)
  const isString = typeof data === 'string'
  const isMarkdown = isString && (data.includes('#') || data.includes('**') || data.includes('`') || data.includes('['))

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
    setIsExpanded(!isExpanded)
  }

  if (isObject) {
    const keys = Object.keys(data)
    const isEmpty = keys.length === 0

    return (
      <div className="json-node">
        <div className="flex items-center">
          <button
            onClick={toggleExpanded}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mr-1 text-gray-600 dark:text-gray-400"
            disabled={isEmpty}
          >
            {isEmpty ? (
              <div className="w-4 h-4" />
            ) : isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          <span className="json-bracket">{isArray ? '[' : '{'}</span>
          
          {!isEmpty && !isExpanded && (
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              {isArray ? `${keys.length} items` : `${keys.length} properties`}
            </span>
          )}
          
          {!isEmpty && isExpanded && (
            <button
              onClick={handleCopy}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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

        {isExpanded && (
          <div className="ml-4">
            {keys.map((key, index) => (
              <div key={key} className="flex">
                <span className="text-gray-400 dark:text-gray-500 select-none">
                  {indent}
                </span>
                <span className="json-key">"{key}"</span>
                <span className="json-comma">: </span>
                <div className="flex-1">
                  <JSONNode
                    data={data[key]}
                    level={level + 1}
                    path={`${path}.${key}`}
                  />
                </div>
                {index < keys.length - 1 && (
                  <span className="json-comma">,</span>
                )}
              </div>
            ))}
            <div className="flex">
              <span className="text-gray-400 dark:text-gray-500 select-none">
                {indent}
              </span>
              <span className="json-bracket">
                {isArray ? ']' : '}'}
              </span>
            </div>
          </div>
        )}

        {!isExpanded && (
          <span className="json-bracket">
            {isArray ? ']' : '}'}
          </span>
        )}
      </div>
    )
  }

  if (isString) {
    if (isMarkdown) {
      return (
        <div className="json-string">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Markdown Content:</div>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <span className="json-string">"{data}"</span>
    )
  }

  if (typeof data === 'number') {
    return <span className="json-number">{data}</span>
  }

  if (typeof data === 'boolean') {
    return <span className="json-boolean">{data.toString()}</span>
  }

  if (data === null) {
    return <span className="json-null">null</span>
  }

  return <span>{String(data)}</span>
}

export default function JSONViewer({ data }: JSONViewerProps) {
  return (
    <div className="p-6">
      <div className="json-viewer text-sm">
        <JSONNode data={data} />
      </div>
    </div>
  )
} 