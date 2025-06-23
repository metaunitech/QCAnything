"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit3, Check, X } from "lucide-react"
import type { NodeContext } from "@/types/field-types"

interface RectViewerProps {
  context: NodeContext
  onEdit: (newValue: any) => void
}

export function RectViewer({ context, onEdit }: RectViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(context.value)

  const rect = context.value as { top: number; left: number; width: number; height: number }

  const handleSave = () => {
    onEdit(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(context.value)
    setIsEditing(false)
  }

  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-3 border-b border-white/30 bg-white/20 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50/80 text-purple-700">
            矩形区域
          </Badge>
          <span className="text-sm font-medium">{context.key}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </div>

      {/* 可视化区域 */}
      <div className="flex-1 p-4">
        {/* 矩形预览 */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">可视化预览</Label>
          <div className="relative bg-gray-100 rounded-lg" style={{ height: "200px", width: "100%" }}>
            <div
              className="absolute border-2 border-orange-500 bg-orange-200/30 rounded"
              style={{
                left: `${(rect.left / 1920) * 100}%`,
                top: `${(rect.top / 1080) * 100}%`,
                width: `${(rect.width / 1920) * 100}%`,
                height: `${(rect.height / 1080) * 100}%`,
              }}
            >
              <div className="absolute -top-6 left-0 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                {rect.width} × {rect.height}
              </div>
            </div>
          </div>
        </div>

        {/* 坐标编辑 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">坐标信息</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">X (left)</Label>
              <Input
                type="number"
                value={isEditing ? editValue.left : rect.left}
                onChange={(e) => setEditValue({ ...editValue, left: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="bg-white/50 backdrop-blur-sm border-white/40"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Y (top)</Label>
              <Input
                type="number"
                value={isEditing ? editValue.top : rect.top}
                onChange={(e) => setEditValue({ ...editValue, top: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="bg-white/50 backdrop-blur-sm border-white/40"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">宽度</Label>
              <Input
                type="number"
                value={isEditing ? editValue.width : rect.width}
                onChange={(e) => setEditValue({ ...editValue, width: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="bg-white/50 backdrop-blur-sm border-white/40"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">高度</Label>
              <Input
                type="number"
                value={isEditing ? editValue.height : rect.height}
                onChange={(e) => setEditValue({ ...editValue, height: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="bg-white/50 backdrop-blur-sm border-white/40"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-2 pt-2">
              <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                <Check className="w-4 h-4 mr-1" />
                保存
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="bg-white/60 backdrop-blur-sm border-white/50"
              >
                <X className="w-4 h-4 mr-1" />
                取消
              </Button>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="text-xs text-gray-600 space-y-1">
            <div>面积: {rect.width * rect.height} px²</div>
            <div>
              中心点: ({rect.left + rect.width / 2}, {rect.top + rect.height / 2})
            </div>
            <div>宽高比: {(rect.width / rect.height).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
