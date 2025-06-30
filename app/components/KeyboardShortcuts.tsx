'use client'

import { useState } from 'react'
import { Keyboard, X } from 'lucide-react'

interface KeyboardShortcutsProps {
  onEdit: () => void
  onView: () => void
  onDownload: () => void
  onClear: () => void
  isOpen?: boolean
  onToggle?: () => void
}

export default function KeyboardShortcuts({ onEdit, onView, onDownload, onClear, isOpen: externalIsOpen, onToggle }: KeyboardShortcutsProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onToggle || setInternalIsOpen

  const shortcuts = [
    { key: 'Ctrl + E', description: 'Edit JSON', action: onEdit },
    { key: 'Ctrl + V', description: 'View JSON', action: onView },
    { key: 'Ctrl + S', description: 'Download JSON', action: onDownload },
    { key: 'Ctrl + K', description: 'Clear JSON', action: onClear },
    { key: 'Ctrl + F', description: 'Toggle search', action: () => {} },
    { key: 'Ctrl + R', description: 'Reset view', action: () => {} },
    { key: 'Ctrl + /', description: 'Toggle shortcuts', action: () => setIsOpen(!isOpen) },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        title="Keyboard shortcuts"
      >
        <Keyboard className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 