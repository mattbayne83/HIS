import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

export interface FileInputProps {
  accept?: string
  multiple?: boolean
  onFilesChange: (files: File[]) => void
  error?: string
  label?: string
  helperText?: string
  disabled?: boolean
  maxFiles?: number
}

const FileInput: React.FC<FileInputProps> = ({
  accept,
  multiple = false,
  onFilesChange,
  error,
  label,
  helperText,
  disabled = false,
  maxFiles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const filesToAdd = maxFiles
      ? fileArray.slice(0, maxFiles - selectedFiles.length)
      : fileArray

    const newFiles = [...selectedFiles, ...filesToAdd]
    setSelectedFiles(newFiles)
    onFilesChange(newFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFilesChange(newFiles)
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-high mb-1">
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            dragActive
              ? 'border-primary bg-primary/5'
              : error
                ? 'border-danger/60 bg-danger/5'
                : 'border-border hover:border-primary/50 hover:bg-surface-alt'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <Upload className="h-10 w-10 text-text-muted mx-auto mb-3" />

        <p className="text-sm text-text-high font-medium mb-1">
          {dragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>

        <p className="text-sm text-text-muted">
          {helperText || 'or click to browse'}
        </p>

        {accept && (
          <p className="text-xs text-text-muted mt-2">
            Supported: {accept.replace(/\./g, '').toUpperCase()}
          </p>
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-high truncate">
                  {file.name}
                </p>
                <p className="text-xs text-text-muted">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile(index)
                }}
                disabled={disabled}
                className="ml-3 p-1 hover:bg-danger/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4 text-danger" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  )
}

export default FileInput
