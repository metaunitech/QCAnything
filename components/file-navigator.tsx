"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Folder, Search, Upload, FileJson, ImageIcon, Video, FileText } from "lucide-react"

interface FileNavigatorProps {
  onFileSelect: (file: string) => void
  selectedFile: string | null
}

const mockFiles = [
  { name: "dataset_001.jsonl", type: "json", status: "completed" },
  { name: "dataset_002.jsonl", type: "json", status: "pending" },
  {
    name: "images",
    type: "folder",
    children: [
      { name: "sample_001.jpg", type: "image" },
      { name: "sample_002.png", type: "image" },
    ],
  },
  { name: "videos", type: "folder", children: [{ name: "demo_001.mp4", type: "video" }] },
  { name: "annotations.json", type: "json", status: "draft" },
]

export function FileNavigator({ onFileSelect, selectedFile }: FileNavigatorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName)
    } else {
      newExpanded.add(folderName)
    }
    setExpandedFolders(newExpanded)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "json":
        return <FileJson className="w-4 h-4 text-orange-500" />
      case "image":
        return <ImageIcon className="w-4 h-4 text-blue-500" />
      case "video":
        return <Video className="w-4 h-4 text-purple-500" />
      case "folder":
        return <Folder className="w-4 h-4 text-gray-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    const colors = {
      completed: "bg-gradient-to-r from-green-100/90 to-green-200/80 text-green-700 border-green-200/60",
      pending: "bg-gradient-to-r from-yellow-100/90 to-yellow-200/80 text-yellow-700 border-yellow-200/60",
      draft: "bg-gradient-to-r from-gray-100/90 to-gray-200/80 text-gray-700 border-gray-200/60",
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs backdrop-blur-sm border shadow-sm ${colors[status as keyof typeof colors]}`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/30 bg-white/10 backdrop-blur-sm">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Files</h3>
        <div className="flex items-center space-x-2 mb-3">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/50 backdrop-blur-sm border-white/50 shadow-lg focus:bg-white/70 transition-all duration-200"
          />
        </div>
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg backdrop-blur-sm border border-orange-400/30"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* File List */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {mockFiles.map((file, index) => (
            <div key={index}>
              <div
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                  selectedFile === file.name
                    ? "bg-gradient-to-r from-orange-100/90 to-orange-200/70 border border-orange-300/60 shadow-xl"
                    : "hover:bg-white/60 hover:shadow-lg border border-white/30"
                }`}
                onClick={() => {
                  if (file.type === "folder") {
                    toggleFolder(file.name)
                  } else {
                    onFileSelect(file.name)
                  }
                }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getFileIcon(file.type)}
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
                {getStatusBadge(file.status)}
              </div>

              {file.type === "folder" && expandedFolders.has(file.name) && file.children && (
                <div className="ml-4 mt-2 space-y-1">
                  {file.children.map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/50 backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md"
                      onClick={() => onFileSelect(child.name)}
                    >
                      {getFileIcon(child.type)}
                      <span className="text-sm truncate">{child.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
