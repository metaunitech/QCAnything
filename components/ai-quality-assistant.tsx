"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Bot, CheckCircle, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react"
import { analyzeFieldWithAI } from "@/utils/field-detector"
import type { NodeContext, QualityAssessment } from "@/types/field-types"

interface AIQualityAssistantProps {
  context: NodeContext
  onQualityUpdate: (assessment: QualityAssessment) => void
}

export function AIQualityAssistant({ context, onQualityUpdate }: AIQualityAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [humanFeedback, setHumanFeedback] = useState("")

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const analysis = await analyzeFieldWithAI(context.key, context.value)
      setAiAnalysis(analysis)

      // 自动生成质检评估
      const assessment: QualityAssessment = {
        status: analysis.qualityIssues && analysis.qualityIssues.length > 0 ? "needs_review" : "approved",
        confidence: analysis.confidence,
        reviewer: "ai",
        timestamp: new Date().toISOString(),
        reason: analysis.qualityIssues?.join("; "),
        suggestions: analysis.suggestions,
      }

      onQualityUpdate(assessment)
    } catch (error) {
      console.error("AI分析失败:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    // 自动触发AI分析
    runAIAnalysis()
  }, [context.key, context.value])

  const handleHumanOverride = (status: "approved" | "rejected") => {
    const assessment: QualityAssessment = {
      status,
      confidence: 1.0,
      reviewer: "hybrid",
      timestamp: new Date().toISOString(),
      reason: humanFeedback || undefined,
      suggestions: aiAnalysis?.suggestions,
    }

    onQualityUpdate(assessment)
  }

  return (
    <div className="space-y-4 p-4 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
      {/* AI 分析状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-sm">AI 质检助手</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={runAIAnalysis}
          disabled={isAnalyzing}
          className="bg-white/60 backdrop-blur-sm border-white/50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isAnalyzing && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">正在分析字段质量...</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
      )}

      {aiAnalysis && !isAnalyzing && (
        <div className="space-y-3">
          {/* 置信度 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">AI 置信度</span>
            <div className="flex items-center space-x-2">
              <Progress value={aiAnalysis.confidence * 100} className="w-20 h-2" />
              <span className="text-sm font-medium">{Math.round(aiAnalysis.confidence * 100)}%</span>
            </div>
          </div>

          {/* 质量问题 */}
          {aiAnalysis.qualityIssues && aiAnalysis.qualityIssues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">发现质量问题</span>
              </div>
              <div className="space-y-1">
                {aiAnalysis.qualityIssues.map((issue: string, index: number) => (
                  <div key={index} className="text-xs bg-red-50/80 text-red-700 p-2 rounded border border-red-200/50">
                    {issue}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI 建议 */}
          {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">AI 建议</span>
              </div>
              <div className="space-y-1">
                {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                  <div
                    key={index}
                    className="text-xs bg-yellow-50/80 text-yellow-700 p-2 rounded border border-yellow-200/50"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 推理过程 */}
          <div className="text-xs text-gray-600 bg-white/40 p-2 rounded border border-white/30">
            <strong>推理过程:</strong> {aiAnalysis.reasoning}
          </div>
        </div>
      )}

      {/* 人工反馈 */}
      <div className="space-y-3 border-t border-white/30 pt-3">
        <span className="text-sm font-medium">人工审核</span>
        <Textarea
          placeholder="添加审核意见或修正建议..."
          value={humanFeedback}
          onChange={(e) => setHumanFeedback(e.target.value)}
          className="bg-white/50 backdrop-blur-sm border-white/40 text-sm"
          rows={2}
        />
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => handleHumanOverride("approved")}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            通过
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleHumanOverride("rejected")}
            className="bg-red-50/80 text-red-700 border-red-200/50 hover:bg-red-100/80"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            打回
          </Button>
        </div>
      </div>
    </div>
  )
}
