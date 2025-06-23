"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Edit3, Play, Check, X, AlertTriangle } from "lucide-react"
import type { NodeContext } from "@/types/field-types"

interface ActionViewerProps {
  context: NodeContext
  onEdit: (newValue: any) => void
  onExecute?: () => void
}

export function ActionViewer({ context, onEdit, onExecute }: ActionViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(context.value)

  const actionType = context.value as string
  const validActions = ["click", "input", "scroll", "hover", "wait", "navigate", "select"]
  const isValidAction = validActions.includes(actionType)

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      click: "👆",
      input: "⌨️",
      scroll: "📜",
      hover: "🖱️",
      wait: "⏱️",
      navigate: "🧭",
      select: "🎯",
    }
    return icons[action] || "❓"
  }

  const getActionDescription = (action: string) => {
    const descriptions: Record<string, string> = {
      click: "点击元素",
      input: "输入文本",
      scroll: "滚动页面",
      hover: "悬停元素",
      wait: "等待时间",
      navigate: "页面导航",
      select: "选择选项",
    }
    return descriptions[action] || "未知动作"
  }

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
          <Badge
            variant="outline"
            className={`${isValidAction ? "bg-green-50/80 text-green-700" : "bg-red-50/80 text-red-700"}`}
          >
            动作指令
          </Badge>
          <span className="text-sm font-medium">{context.key}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          {onExecute && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExecute}
              className="bg-blue-50/80 backdrop-blur-sm border-blue-200/50 hover:bg-blue-100/80 shadow-lg"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 动作详情 */}
      <div className="flex-1 p-4 space-y-4">
        {/* 动作可视化 */}
        <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="text-4xl mb-2">{getActionIcon(actionType)}</div>
          <div className="text-lg font-medium">{actionType}</div>
          <div className="text-sm text-gray-600">{getActionDescription(actionType)}</div>
          {!isValidAction && (
            <div className="flex items-center justify-center mt-2 text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-xs">未知的动作类型</span>
            </div>
          )}
        </div>

        {/* 动作编辑 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">动作类型</Label>
          {isEditing ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-white/60">
                {validActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    <div className="flex items-center space-x-2">
                      <span>{getActionIcon(action)}</span>
                      <span>{action}</span>
                      <span className="text-xs text-gray-500">- {getActionDescription(action)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-white/50 backdrop-blur-sm rounded border border-white/30">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getActionIcon(actionType)}</span>
                <span className="font-medium">{actionType}</span>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex space-x-2">
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

        {/* 动作属性 */}
        <div className="p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="text-sm font-medium mb-2">动作属性</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>执行优先级: {isValidAction ? "正常" : "需要修正"}</div>
            <div>预期耗时: {actionType === "wait" ? "用户定义" : "< 1秒"}</div>
            <div>错误处理: {isValidAction ? "支持重试" : "需要人工干预"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
