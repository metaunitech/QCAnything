"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Save, CheckCircle, AlertTriangle, Clock, FileJson } from "lucide-react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-500" />
    case "error":
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    default:
      return null
  }
}

interface CanvasViewProps {
  selectedFile: string | null
  onNodeSelect: (node: any) => void
  selectedNode: any
  currentPath: string[]
  currentIndex: number
  onPathChange: (path: string[]) => void
  viewMode: "table" | "canvas" | "editor"
}

// Mock JSON data structure with proper hierarchy
const mockJsonData = {
  instruction_id: "task_001",
  instruction_title: "Navigate and Submit Form",
  instruction_description: "Complete the user registration process",
  steps: [
    {
      step_id: 1,
      action: "navigate",
      url: "https://example.com/register",
      screenshot: "/images/step1.png",
      status: "completed",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      step_id: 2,
      action: "click",
      element: "#submit-button",
      screenshot: "/images/step2.png",
      status: "pending",
      timestamp: "2024-01-15T10:31:00Z",
    },
    {
      step_id: 3,
      action: "input",
      element: "#username",
      value: "test@example.com",
      screenshot: "/images/step3.png",
      status: "error",
      timestamp: "2024-01-15T10:32:00Z",
    },
  ],
  metadata: {
    created_at: "2024-01-15T10:30:00Z",
    annotator: "user_001",
    quality_score: 0.85,
    total_steps: 3,
  },
}

export function CanvasView({
  selectedFile,
  onNodeSelect,
  selectedNode,
  currentPath,
  currentIndex,
  onPathChange,
  viewMode,
}: CanvasViewProps) {
  const [zoomLevel, setZoomLevel] = useState(100)

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50))

  // Get current data based on path and index
  const currentData = useMemo(() => {
    if (!selectedFile) return null

    const data = mockJsonData

    if (currentPath.length === 0) {
      // Root level - show instruction metadata
      const { steps, ...instructionData } = data
      return { ...instructionData, _hasSteps: true }
    } else if (currentPath[0] === "steps") {
      // Steps level - show specific step
      return data.steps[currentIndex] || data.steps[0]
    }

    return data
  }, [selectedFile, currentPath, currentIndex])

  // Generate React Flow nodes and edges
  const { nodes, edges } = useMemo(() => {
    if (!currentData) return { nodes: [], edges: [] }

    const nodes: Node[] = []
    const edges: Edge[] = []

    if (currentPath.length === 0) {
      // Root level - create nodes for instruction metadata
      let yPos = 100
      Object.entries(currentData).forEach(([key, value], index) => {
        if (key === "_hasSteps") return

        const nodeType = key === "steps" ? "group" : typeof value === "object" ? "default" : "input"

        nodes.push({
          id: key,
          type: nodeType,
          position: { x: 300, y: yPos },
          data: {
            label: (
              <div className="p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-xl min-w-56 hover:shadow-2xl transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs bg-white/70 backdrop-blur-sm">
                    {key === "steps" ? `Array[${mockJsonData.steps.length}]` : typeof value}
                  </Badge>
                  {typeof value === "string" && value.includes("status") && getStatusIcon(value)}
                </div>
                <div className="font-semibold text-sm mb-2 text-gray-800">{key}</div>
                <div className="text-xs text-gray-600 truncate">
                  {typeof value === "object" && value !== null
                    ? key === "steps"
                      ? `${mockJsonData.steps.length} items`
                      : "Object"
                    : String(value)}
                </div>
              </div>
            ),
            onClick: () => {
              if (key === "steps") {
                onPathChange(["steps"])
              } else {
                onNodeSelect({ key, value, path: [...currentPath, key], type: typeof value })
              }
            },
          },
          style: {
            background: "transparent",
            border: "none",
          },
        })

        yPos += 150
      })
    } else if (currentPath[0] === "steps") {
      // Steps level - create flow for current step
      const step = currentData
      let xPos = 200
      let yPos = 150

      Object.entries(step).forEach(([key, value], index) => {
        nodes.push({
          id: `step-${key}`,
          type: "default",
          position: { x: xPos, y: yPos },
          data: {
            label: (
              <div className="p-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-xl min-w-40 hover:shadow-2xl transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-white/70 backdrop-blur-sm">
                    {typeof value}
                  </Badge>
                  {key === "status" && getStatusIcon(String(value))}
                </div>
                <div className="font-semibold text-sm mb-1 text-gray-800">{key}</div>
                <div className="text-xs text-gray-600 truncate max-w-32">{String(value)}</div>
              </div>
            ),
            onClick: () => {
              onNodeSelect({ key, value, path: [...currentPath, key], type: typeof value })
            },
          },
          style: {
            background: "transparent",
            border: "none",
          },
        })

        if (index > 0) {
          edges.push({
            id: `edge-${index}`,
            source: `step-${Object.keys(step)[index - 1]}`,
            target: `step-${key}`,
            type: "smoothstep",
            style: { stroke: "#FF7F2A", strokeWidth: 2 },
            animated: true,
          })
        }

        xPos += 250
        if (xPos > 800) {
          xPos = 200
          yPos += 180
        }
      })
    }

    return { nodes, edges }
  }, [currentData, currentPath, onNodeSelect, onPathChange])

  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  // Update nodes when data changes
  useMemo(() => {
    setNodes(nodes)
    setEdges(edges)
  }, [nodes, edges, setNodes, setEdges])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const renderTableView = () => {
    if (!currentData) return null

    return (
      <div className="max-w-4xl mx-auto space-y-4 p-8">
        {Object.entries(currentData).map(([key, value]) => {
          if (key === "_hasSteps") return null

          const isClickable = key === "steps" || (typeof value === "object" && value !== null)

          return (
            <div
              key={key}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md ${
                isClickable ? "cursor-pointer hover:bg-white/70 hover:border-orange-300 hover:shadow-2xl" : ""
              } ${
                selectedNode?.key === key
                  ? "bg-gradient-to-r from-orange-100/90 to-orange-200/70 border-orange-300 shadow-2xl"
                  : "bg-white/50 border-white/40 shadow-xl"
              }`}
              onClick={() => {
                if (key === "steps") {
                  onPathChange(["steps"])
                } else {
                  onNodeSelect({ key, value, path: [...currentPath, key], type: typeof value })
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="outline"
                    className={`backdrop-blur-sm ${
                      typeof value === "object" && value !== null
                        ? "bg-purple-50/90 text-purple-700 border-purple-200/60"
                        : "bg-gray-50/90 text-gray-700 border-gray-200/60"
                    }`}
                  >
                    {key === "steps" ? `Array[${mockJsonData.steps.length}]` : typeof value}
                  </Badge>
                  <span className="font-semibold text-lg">{key}</span>
                  {typeof value === "string" && value.includes("status") && getStatusIcon(value)}
                </div>
                <div className="text-sm text-gray-600 max-w-64 truncate">
                  {typeof value === "object" && value !== null
                    ? key === "steps"
                      ? `${mockJsonData.steps.length} items`
                      : "Object"
                    : String(value)}
                </div>
              </div>
            </div>
          )
        })}

        {currentData._hasSteps && (
          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-orange-50/90 to-orange-100/70 backdrop-blur-md border-orange-200/60 text-orange-700 hover:from-orange-100/90 hover:to-orange-200/70 shadow-xl transition-all duration-300 py-6 text-lg"
            onClick={() => onPathChange(["steps"])}
          >
            View Steps ({mockJsonData.steps.length})
          </Button>
        )}
      </div>
    )
  }

  const renderCanvasView = () => {
    if (!currentData) return null

    return (
      <div className="h-full w-full">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          className="bg-transparent"
          onNodeClick={(event, node) => {
            if (node.data.onClick) {
              node.data.onClick()
            }
          }}
          fitView
        >
          <Controls className="bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-xl" />
          <Background variant={BackgroundVariant.Dots} gap={30} size={2} color="#FF7F2A" className="opacity-20" />
        </ReactFlow>
      </div>
    )
  }

  const renderEditorView = () => {
    if (!currentData) return null

    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="h-full bg-gray-900/95 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
          <div className="p-4 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
            <span className="text-green-400 text-sm font-mono">JSON Editor</span>
          </div>
          <pre className="p-6 text-green-400 font-mono text-sm overflow-auto h-96 bg-gray-900/90 backdrop-blur-sm">
            {JSON.stringify(currentData, null, 4)}
          </pre>
        </div>
      </div>
    )
  }

  const renderCurrentView = () => {
    switch (viewMode) {
      case "table":
        return renderTableView()
      case "canvas":
        return renderCanvasView()
      case "editor":
        return renderEditorView()
      default:
        return renderTableView()
    }
  }

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 bg-white/40 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-2xl">
          <FileJson className="w-20 h-20 mx-auto mb-6 opacity-50" />
          <p className="text-xl font-medium mb-2">Select a file to begin</p>
          <p className="text-sm">Choose a JSON file from the navigator to start quality inspection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      {/* Canvas Controls - Floating */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-white/60 backdrop-blur-sm rounded border border-white/50 shadow-lg">
              {zoomLevel}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-white/40" />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg backdrop-blur-sm border border-orange-400/30"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Content - Full Screen */}
      <div
        className="h-full overflow-auto"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
      >
        {renderCurrentView()}
      </div>
    </div>
  )
}
