"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { History, GitBranch, User, Bot } from "lucide-react"
import type { NodeContext, NodeVersion } from "@/types/field-types"

interface VersionDiffViewerProps {
  context: NodeContext
  onVersionSelect: (version: NodeVersion) => void
}

export function VersionDiffViewer({ context, onVersionSelect }: VersionDiffViewerProps) {
  const [selectedVersions, setSelectedVersions] = useState<[string, string]>(["", ""])

  const versions = context.versions || []
  const currentVersion = versions[0]
  const previousVersion = versions[1]

  const getChangeType = (change: string) => {
    if (change.startsWith("added")) return "added"
    if (change.startsWith("removed")) return "removed"
    if (change.startsWith("modified")) return "modified"
    return "unknown"
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-50/80 text-green-700 border-green-200/50"
      case "removed":
        return "bg-red-50/80 text-red-700 border-red-200/50"
      case "modified":
        return "bg-yellow-50/80 text-yellow-700 border-yellow-200/50"
      default:
        return "bg-gray-50/80 text-gray-700 border-gray-200/50"
    }
  }

  const renderValueDiff = (oldValue: any, newValue: any) => {
    const oldStr = JSON.stringify(oldValue, null, 2)
    const newStr = JSON.stringify(newValue, null, 2)

    if (oldStr === newStr) {
      return <div className="text-sm text-gray-600">无变化</div>
    }

    return (
      <div className="space-y-2">
        <div className="bg-red-50/80 border border-red-200/50 rounded p-2">
          <div className="text-xs text-red-600 font-medium mb-1">- 旧值</div>
          <pre className="text-xs text-red-700 whitespace-pre-wrap">{oldStr}</pre>
        </div>
        <div className="bg-green-50/80 border border-green-200/50 rounded p-2">
          <div className="text-xs text-green-600 font-medium mb-1">+ 新值</div>
          <pre className="text-xs text-green-700 whitespace-pre-wrap">{newStr}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
      {/* 版本选择 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-sm">版本历史</span>
        </div>
        <Badge variant="outline" className="bg-purple-50/80 text-purple-700">
          {versions.length} 个版本
        </Badge>
      </div>

      {/* 版本列表 */}
      <div className="space-y-2 max-h-48 overflow-auto">
        {versions.map((version, index) => (
          <div
            key={version.id}
            className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-sm rounded border border-white/30 hover:bg-white/60 transition-all cursor-pointer"
            onClick={() => onVersionSelect(version)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {version.qualityAssessment.reviewer === "ai" ? (
                  <Bot className="w-4 h-4 text-blue-500" />
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm font-medium">{version.author}</span>
              </div>
              <div className="text-xs text-gray-600">{new Date(version.timestamp).toLocaleString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  version.qualityAssessment.status === "approved"
                    ? "bg-green-50/80 text-green-700"
                    : version.qualityAssessment.status === "rejected"
                      ? "bg-red-50/80 text-red-700"
                      : "bg-yellow-50/80 text-yellow-700"
                }`}
              >
                {version.qualityAssessment.status}
              </Badge>
              {index === 0 && (
                <Badge variant="outline" className="bg-blue-50/80 text-blue-700 text-xs">
                  当前
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 变更详情 */}
      {currentVersion && previousVersion && (
        <div className="space-y-3 border-t border-white/30 pt-3">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">变更对比</span>
          </div>

          {/* 变更列表 */}
          {currentVersion.changes && currentVersion.changes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">变更记录</div>
              {currentVersion.changes.map((change, index) => {
                const changeType = getChangeType(change)
                return (
                  <div key={index} className={`text-xs p-2 rounded border ${getChangeColor(changeType)}`}>
                    {change}
                  </div>
                )
              })}
            </div>
          )}

          {/* 值对比 */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600">值对比</div>
            {renderValueDiff(previousVersion.value, currentVersion.value)}
          </div>

          {/* 质检状态变化 */}
          <div className="flex items-center justify-between p-2 bg-white/40 rounded border border-white/30">
            <span className="text-xs text-gray-600">质检状态</span>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  previousVersion.qualityAssessment.status === "approved"
                    ? "bg-green-50/80 text-green-700"
                    : "bg-red-50/80 text-red-700"
                }`}
              >
                {previousVersion.qualityAssessment.status}
              </Badge>
              <span className="text-xs text-gray-400">→</span>
              <Badge
                variant="outline"
                className={`text-xs ${
                  currentVersion.qualityAssessment.status === "approved"
                    ? "bg-green-50/80 text-green-700"
                    : "bg-red-50/80 text-red-700"
                }`}
              >
                {currentVersion.qualityAssessment.status}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
