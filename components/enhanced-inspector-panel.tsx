"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Eye, Settings, History, Bot } from "lucide-react"
import { detectFieldType } from "@/utils/field-detector"
import { ImageViewer } from "@/components/field-viewers/image-viewer"
import { RectViewer } from "@/components/field-viewers/rect-viewer"
import { ActionViewer } from "@/components/field-viewers/action-viewer"
import { AIQualityAssistant } from "@/components/ai-quality-assistant"
import { VersionDiffViewer } from "@/components/version-diff-viewer"
import type { NodeContext, AnnotationData, QualityAssessment, NodeVersion } from "@/types/field-types"

interface EnhancedInspectorPanelProps {
  selectedNode: any
  currentPath: string[]
}

export function EnhancedInspectorPanel({ selectedNode, currentPath }: EnhancedInspectorPanelProps) {
  const [nodeContext, setNodeContext] = useState<NodeContext | null>(null)
  const [activeTab, setActiveTab] = useState("preview")

  useEffect(() => {
    if (selectedNode) {
      // 构建节点上下文
      const context: NodeContext = {
        key: selectedNode.key,
        value: selectedNode.value,
        path: selectedNode.path || [],
        type: selectedNode.type,
        versions: [
          {
            id: "v1",
            value: selectedNode.value,
            timestamp: new Date().toISOString(),
            author: "current_user",
            changes: ["初始创建"],
            qualityAssessment: {
              status: "pending",
              confidence: 0.8,
              reviewer: "human",
              timestamp: new Date().toISOString(),
            },
          },
        ],
        annotations: [],
      }
      setNodeContext(context)
    }
  }, [selectedNode])

  const handleAnnotate = (annotation: AnnotationData) => {
    if (!nodeContext) return

    setNodeContext({
      ...nodeContext,
      annotations: [...nodeContext.annotations, annotation],
    })
  }

  const handleEdit = (newValue: any) => {
    if (!nodeContext) return

    const newVersion: NodeVersion = {
      id: `v${nodeContext.versions.length + 1}`,
      value: newValue,
      timestamp: new Date().toISOString(),
      author: "current_user",
      changes: [`修改了 ${nodeContext.key} 的值`],
      qualityAssessment: {
        status: "pending",
        confidence: 0.8,
        reviewer: "human",
        timestamp: new Date().toISOString(),
      },
    }

    setNodeContext({
      ...nodeContext,
      value: newValue,
      versions: [newVersion, ...nodeContext.versions],
    })
  }

  const handleQualityUpdate = (assessment: QualityAssessment) => {
    if (!nodeContext) return

    const updatedVersions = [...nodeContext.versions]
    updatedVersions[0] = {
      ...updatedVersions[0],
      qualityAssessment: assessment,
    }

    setNodeContext({
      ...nodeContext,
      versions: updatedVersions,
    })
  }

  const handleVersionSelect = (version: NodeVersion) => {
    if (!nodeContext) return

    setNodeContext({
      ...nodeContext,
      value: version.value,
    })
  }

  const renderFieldViewer = () => {
    if (!nodeContext) return null

    const fieldMapping = detectFieldType(nodeContext.key, nodeContext.value)

    switch (fieldMapping.component) {
      case "ImageViewer":
      case "ScreenshotViewer":
        return <ImageViewer context={nodeContext} onAnnotate={handleAnnotate} onEdit={handleEdit} />
      case "RectViewer":
        return <RectViewer context={nodeContext} onEdit={handleEdit} />
      case "ActionViewer":
        return <ActionViewer context={nodeContext} onEdit={handleEdit} />
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">暂不支持此字段类型</p>
              <p className="text-sm">字段类型: {fieldMapping.type}</p>
            </div>
          </div>
        )
    }
  }

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">未选择节点</p>
          <p className="text-sm">点击Canvas中的节点开始质检</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="p-4 border-b border-white/30 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-800">智能质检面板</h3>
          <Badge variant="outline" className="bg-orange-50/80 text-orange-700">
            {nodeContext ? detectFieldType(nodeContext.key, nodeContext.value).type : "unknown"}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{selectedNode.path?.join(" → ") || "根节点"}</p>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-white/30 mx-4 mt-2">
          <TabsTrigger value="preview" className="text-xs">
            <Eye className="w-4 h-4 mr-1" />
            预览
          </TabsTrigger>
          <TabsTrigger value="quality" className="text-xs">
            <Bot className="w-4 h-4 mr-1" />
            质检
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <History className="w-4 h-4 mr-1" />
            历史
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings className="w-4 h-4 mr-1" />
            设置
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="preview" className="h-full m-0">
            {renderFieldViewer()}
          </TabsContent>

          <TabsContent value="quality" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              {nodeContext && <AIQualityAssistant context={nodeContext} onQualityUpdate={handleQualityUpdate} />}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              {nodeContext && <VersionDiffViewer context={nodeContext} onVersionSelect={handleVersionSelect} />}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">节点设置</p>
                  <p className="text-sm">配置节点的质检规则和标注选项</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
