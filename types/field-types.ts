export interface FieldMapping {
  type: string
  pattern: RegExp | string
  component: string
  priority: number
  metadata?: Record<string, any>
}

export interface QualityAssessment {
  status: "pending" | "approved" | "rejected" | "needs_review"
  confidence: number
  reviewer: "human" | "ai" | "hybrid"
  timestamp: string
  reason?: string
  suggestions?: string[]
}

export interface NodeVersion {
  id: string
  value: any
  timestamp: string
  author: string
  changes: string[]
  qualityAssessment: QualityAssessment
}

export interface AnnotationData {
  type: "bbox" | "point" | "text" | "error" | "suggestion"
  coordinates?: { x: number; y: number; width?: number; height?: number }
  content: string
  author: string
  timestamp: string
}

export interface NodeContext {
  key: string
  value: any
  path: string[]
  type: string
  versions: NodeVersion[]
  annotations: AnnotationData[]
  aiSuggestions?: {
    confidence: number
    suggestions: string[]
    reasoning: string
  }
}
