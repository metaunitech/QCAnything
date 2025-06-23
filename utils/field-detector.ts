import type { FieldMapping } from "@/types/field-types"

export const FIELD_MAPPINGS: FieldMapping[] = [
  // 图片相关字段
  {
    type: "image",
    pattern: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
    component: "ImageViewer",
    priority: 10,
  },
  {
    type: "screenshot",
    pattern: /^(screenshot|imgSave|capture|frame)$/i,
    component: "ScreenshotViewer",
    priority: 9,
  },

  // 几何和位置信息
  {
    type: "rect",
    pattern: /^(rect|bbox|bounds|coordinates)$/i,
    component: "RectViewer",
    priority: 8,
  },
  {
    type: "viewport",
    pattern: /^(viewport|screen|display)$/i,
    component: "ViewportViewer",
    priority: 8,
  },

  // 动作和指令
  {
    type: "action",
    pattern: /^(type|action|command|operation)$/i,
    component: "ActionViewer",
    priority: 7,
  },
  {
    type: "actionRule",
    pattern: /^(actionRuleSetting|rule|setting)$/i,
    component: "ActionRuleViewer",
    priority: 7,
  },

  // 时间信息
  {
    type: "timestamp",
    pattern: /^(timestamp|time|date|created|updated)$/i,
    component: "TimestampViewer",
    priority: 6,
  },

  // DOM 元素信息
  {
    type: "attributes",
    pattern: /^(attributes|props|data)$/i,
    component: "AttributesViewer",
    priority: 5,
  },

  // 文本内容
  {
    type: "title",
    pattern: /^(title|name|label|text|content)$/i,
    component: "TextViewer",
    priority: 4,
  },

  // URL 链接
  {
    type: "url",
    pattern: /^https?:\/\/.+/,
    component: "UrlViewer",
    priority: 3,
  },

  // 默认处理
  {
    type: "default",
    pattern: /.*/,
    component: "DefaultViewer",
    priority: 1,
  },
]

export function detectFieldType(key: string, value: any): FieldMapping {
  // 按优先级排序，找到第一个匹配的类型
  const sortedMappings = FIELD_MAPPINGS.sort((a, b) => b.priority - a.priority)

  for (const mapping of sortedMappings) {
    // 检查字段名
    if (typeof mapping.pattern === "string") {
      if (key.toLowerCase() === mapping.pattern.toLowerCase()) {
        return mapping
      }
    } else if (mapping.pattern instanceof RegExp) {
      if (mapping.pattern.test(key) || (typeof value === "string" && mapping.pattern.test(value))) {
        return mapping
      }
    }
  }

  return FIELD_MAPPINGS.find((m) => m.type === "default")!
}

export function analyzeFieldWithAI(
  key: string,
  value: any,
): Promise<{
  confidence: number
  suggestions: string[]
  reasoning: string
  qualityIssues?: string[]
}> {
  // 模拟 AI 分析
  return new Promise((resolve) => {
    setTimeout(() => {
      const suggestions = []
      const qualityIssues = []
      let confidence = 0.8

      // 基于字段类型给出建议
      if (key === "imgSave" && typeof value === "string") {
        if (!value.startsWith("http")) {
          qualityIssues.push("图片URL格式可能不正确")
          confidence = 0.4
        }
        suggestions.push("建议验证图片URL的可访问性")
      }

      if (key === "rect" && typeof value === "object") {
        const rect = value as any
        if (!rect.top || !rect.left || !rect.width || !rect.height) {
          qualityIssues.push("矩形坐标信息不完整")
          confidence = 0.3
        }
        suggestions.push("确保所有坐标值都为正数")
      }

      if (key === "type" && typeof value === "string") {
        const validActions = ["click", "input", "scroll", "hover", "wait"]
        if (!validActions.includes(value)) {
          qualityIssues.push(`未知的动作类型: ${value}`)
          confidence = 0.2
        }
      }

      resolve({
        confidence,
        suggestions,
        reasoning: `基于字段 "${key}" 的值类型和内容进行分析`,
        qualityIssues,
      })
    }, 1000)
  })
}
