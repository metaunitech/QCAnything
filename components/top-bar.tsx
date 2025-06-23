"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, CheckCircle, ChevronRight, ChevronUp, ChevronDown, Table, GitBranch, Code } from "lucide-react"

interface TopBarProps {
  currentPath: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
  selectedFile: string | null
  viewMode: "table" | "canvas" | "editor"
  onViewModeChange: (mode: "table" | "canvas" | "editor") => void
  onPathChange: (path: string[]) => void
}

export function TopBar({
  currentPath,
  currentIndex,
  onIndexChange,
  selectedFile,
  viewMode,
  onViewModeChange,
  onPathChange,
}: TopBarProps) {
  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPathChange([])}
          className="text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200"
        >
          Root
        </Button>
        {currentPath.map((segment, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPathChange(currentPath.slice(0, index + 1))}
              className="font-medium text-gray-800 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200"
            >
              {segment}
            </Button>
            {index === currentPath.length - 1 && segment === "steps" && (
              <div className="flex items-center space-x-1 ml-2 bg-white/40 backdrop-blur-sm rounded-lg p-1 border border-white/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-orange-100/50"
                  onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <span className="text-xs bg-gradient-to-r from-orange-100 to-orange-200 px-2 py-1 rounded border border-orange-200/50 font-medium">
                  [{currentIndex}]
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-orange-100/50"
                  onClick={() => onIndexChange(currentIndex + 1)}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-16 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-2xl px-6 flex items-center justify-between relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-orange-50/20 pointer-events-none" />

      <div className="flex items-center space-x-6 relative z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent">
          QCAnything
        </h1>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-4">
          {selectedFile && (
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 backdrop-blur-sm px-3 py-1 rounded-lg border border-orange-200/50 shadow-lg">
                <span className="text-sm font-medium text-orange-800">{selectedFile}</span>
              </div>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              {renderBreadcrumb()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 relative z-10">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/40 shadow-lg">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className={`transition-all duration-200 ${
              viewMode === "table"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "hover:bg-white/50"
            }`}
          >
            <Table className="w-4 h-4 mr-1" />
            Table
          </Button>
          <Button
            variant={viewMode === "canvas" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("canvas")}
            className={`transition-all duration-200 ${
              viewMode === "canvas"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "hover:bg-white/50"
            }`}
          >
            <GitBranch className="w-4 h-4 mr-1" />
            Canvas
          </Button>
          <Button
            variant={viewMode === "editor" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("editor")}
            className={`transition-all duration-200 ${
              viewMode === "editor"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "hover:bg-white/50"
            }`}
          >
            <Code className="w-4 h-4 mr-1" />
            Editor
          </Button>
        </div>

        <Select defaultValue="v1.0">
          <SelectTrigger className="w-32 bg-white/30 backdrop-blur-md border-white/40 shadow-lg">
            <SelectValue placeholder="Version" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-md border-white/50">
            <SelectItem value="v1.0">v1.0 (Latest)</SelectItem>
            <SelectItem value="v0.9">v0.9</SelectItem>
            <SelectItem value="v0.8">v0.8</SelectItem>
          </SelectContent>
        </Select>

        <Badge
          variant="outline"
          className="bg-green-50/80 backdrop-blur-sm text-green-700 border-green-200/50 shadow-lg"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Saved
        </Badge>

        <Button
          size="sm"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg backdrop-blur-sm border border-orange-400/30 transition-all duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Avatar className="w-8 h-8 ring-2 ring-white/30 shadow-lg">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700">
            QC
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
