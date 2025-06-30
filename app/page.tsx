'use client'

import { useState } from 'react'
import { Upload, Download, Edit3, Eye, FileText, X } from 'lucide-react'
import JSONViewer from './components/JSONViewer'
import JSONEditor from './components/JSONEditor'
import FileUpload from './components/FileUpload'

export default function Home() {
  const [jsonData, setJsonData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  const handleFileUpload = (data: any, name: string) => {
    setJsonData(data)
    setFileName(name)
    setIsEditing(false)
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            JSON Viewer
          </h1>
          <p className="text-gray-600">
            Upload, view, edit, and download JSON files with markdown support
          </p>
        </header>

        {!jsonData ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with file info and actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <h2 className="font-semibold text-gray-900">{fileName}</h2>
                    <p className="text-sm text-gray-500">
                      {typeof jsonData === 'object' ? 'JSON Object' : 'JSON Array'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
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

            {/* JSON Content */}
            <div className="bg-white rounded-lg shadow-sm border">
              {isEditing ? (
                <JSONEditor 
                  data={jsonData} 
                  onSave={setJsonData}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <JSONViewer data={jsonData} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 