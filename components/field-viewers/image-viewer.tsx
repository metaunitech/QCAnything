"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Maximize2, Edit3, ZoomIn, ZoomOut } from "lucide-react"
import type { NodeContext, AnnotationData } from "@/types/field-types"

interface ImageViewerProps {
  context: NodeContext
  onAnnotate: (annotation: AnnotationData) => void
  onEdit: (newValue: any) => void
}

export function ImageViewer({ context, onAnnotate, onEdit }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [isDrawing, setIsDrawing] = useState(false)
  const [annotations, setAnnotations] = useState<AnnotationData[]>(context.annotations || [])

  const imageUrl = typeof context.value === "string" ? context.value : ""

  const handleBboxDraw = (event: React.MouseEvent) => {
    if (!isDrawing) return

    // 实现拉框标注逻辑
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newAnnotation: AnnotationData = {
      type: "bbox",
      coordinates: { x, y, width: 100, height: 50 },
      content: "标注区域",
      author: "user",
      timestamp: new Date().toISOString(),
    }

    setAnnotations([...annotations, newAnnotation])
    onAnnotate(newAnnotation)
    setIsDrawing(false)
  }

  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-3 border-b border-white/30 bg-white/20 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50/80 text-blue-700">
            图片
          </Badge>
          <span className="text-sm font-medium">{context.key}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDrawing(!isDrawing)}
            className={`bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg ${
              isDrawing ? "bg-orange-100 border-orange-300" : ""
            }`}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs bg-white/50 px-2 py-1 rounded">{zoom}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 图片显示区域 */}
      <div className="flex-1 relative overflow-auto bg-gradient-to-br from-gray-100/90 to-gray-200/70 backdrop-blur-sm">
        {imageUrl ? (
          <div
            className="relative inline-block cursor-crosshair"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
            onClick={handleBboxDraw}
          >
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={context.key}
              className="max-w-none"
              crossOrigin="anonymous"
            />

            {/* 渲染标注 */}
            {annotations.map(
              (annotation, index) =>
                annotation.coordinates && (
                  <div
                    key={index}
                    className="absolute border-2 border-orange-500 bg-orange-200/30"
                    style={{
                      left: annotation.coordinates.x,
                      top: annotation.coordinates.y,
                      width: annotation.coordinates.width,
                      height: annotation.coordinates.height,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      {annotation.content}
                    </div>
                  </div>
                ),
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2" />
              <p className="text-sm">无效的图片URL</p>
            </div>
          </div>
        )}
      </div>

      {/* 标注列表 */}
      {annotations.length > 0 && (
        <div className="border-t border-white/30 bg-white/20 backdrop-blur-md p-3 max-h-32 overflow-auto">
          <div className="text-xs font-medium mb-2">标注 ({annotations.length})</div>
          <div className="space-y-1">
            {annotations.map((annotation, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-white/50 rounded p-2">
                <span>{annotation.content}</span>
                <Badge variant="outline" className="text-xs">
                  {annotation.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
