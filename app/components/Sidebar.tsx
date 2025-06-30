'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Settings, Search, FileText, Download, Palette, Keyboard } from 'lucide-react'

interface SidebarProps {
  onToggleSearch: () => void
  onToggleValidation: () => void
  onDownload: () => void
  onClear: () => void
  showSearch: boolean
  showValidation: boolean
  onKeyboardShortcuts: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface SectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultExpanded?: boolean
}

function Section({ title, icon: Icon, children, defaultExpanded = false }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ 
  onToggleSearch, 
  onToggleValidation, 
  onDownload, 
  onClear, 
  showSearch, 
  showValidation,
  onKeyboardShortcuts,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse
}: SidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)
  
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed
  const setIsCollapsed = onToggleCollapse || setInternalIsCollapsed

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-30 ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tools</h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-2">
          <Section title="Navigation" icon={FileText} defaultExpanded={true}>
            <button
              onClick={onToggleSearch}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showSearch 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            
            <button
              onClick={onToggleValidation}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showValidation 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Validate</span>
            </button>
          </Section>

          <Section title="Actions" icon={Download}>
            <button
              onClick={onDownload}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={onClear}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </Section>

          <Section title="Settings" icon={Settings}>
            <button
              onClick={onKeyboardShortcuts}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Keyboard className="h-4 w-4" />
              <span>Shortcuts</span>
            </button>
          </Section>
        </div>
      )}

      {isCollapsed && (
        <div className="p-2 space-y-2">
          <button
            onClick={onToggleSearch}
            className={`w-full p-2 rounded-lg transition-colors ${
              showSearch 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          
          <button
            onClick={onToggleValidation}
            className={`w-full p-2 rounded-lg transition-colors ${
              showValidation 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Validate"
          >
            <FileText className="h-4 w-4" />
          </button>
          
          <button
            onClick={onDownload}
            className="w-full p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
} 