"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Clock, Edit3, ImageIcon, Video, Eye, Download, Maximize2 } from "lucide-react"

interface InspectorPanelProps {
  selectedNode: any
  currentPath: string[]
}

export function InspectorPanel({ selectedNode, currentPath }: InspectorPanelProps) {
  const [qualityStatus, setQualityStatus] = useState("pending")
  const [rejectionReason, setRejectionReason] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-gradient-to-r from-green-50/90 to-green-100/70 border-green-200/60 backdrop-blur-sm"
      case "rejected":
        return "text-red-600 bg-gradient-to-r from-red-50/90 to-red-100/70 border-red-200/60 backdrop-blur-sm"
      case "pending":
        return "text-yellow-600 bg-gradient-to-r from-yellow-50/90 to-yellow-100/70 border-yellow-200/60 backdrop-blur-sm"
      default:
        return "text-gray-600 bg-gradient-to-r from-gray-50/90 to-gray-100/70 border-gray-200/60 backdrop-blur-sm"
    }
  }

  const renderVisualization = () => {
    if (!selectedNode || !selectedNode.value) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No Content Selected</p>
            <p className="text-sm">Select a node to preview its content</p>
          </div>
        </div>
      )
    }

    const value = selectedNode.value

    // Check if it's an image path
    if (typeof value === "string" && (value.includes(".jpg") || value.includes(".png") || value.includes(".gif"))) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/30 bg-white/20 backdrop-blur-sm">
            <Label className="text-sm font-medium">Image Preview</Label>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 bg-gradient-to-br from-gray-100/90 to-gray-200/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/50 shadow-lg">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Image Preview</p>
              <p className="text-xs text-gray-500">{value}</p>
            </div>
          </div>
        </div>
      )
    }

    // Check if it's a video path
    if (typeof value === "string" && (value.includes(".mp4") || value.includes(".avi") || value.includes(".mov"))) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/30 bg-white/20 backdrop-blur-sm">
            <Label className="text-sm font-medium">Video Preview</Label>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 shadow-lg"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 bg-gradient-to-br from-gray-100/90 to-gray-200/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/50 shadow-lg">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Video Player</p>
              <p className="text-xs text-gray-500">{value}</p>
            </div>
          </div>
        </div>
      )
    }

    // Default content preview
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/30 bg-white/20 backdrop-blur-sm">
          <Label className="text-sm font-medium">Content Preview</Label>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/40 shadow-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
            </pre>
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderQualityControl = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/30 bg-white/20 backdrop-blur-sm">
        <h4 className="font-semibold text-sm">Quality Control</h4>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {selectedNode && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Node Information</Label>
                <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 space-y-3 border border-white/40 shadow-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Field:</span>
                    <span className="font-medium">{selectedNode.key}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline" className="text-xs bg-white/60 backdrop-blur-sm border-white/50">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Path:</span>
                    <span className="font-mono text-xs">{selectedNode.path?.join(".") || "root"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Quality Status</Label>
                <Select value={qualityStatus} onValueChange={setQualityStatus}>
                  <SelectTrigger className="bg-white/50 backdrop-blur-md border-white/50 shadow-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/60">
                    <SelectItem value="pending">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                        Pending Review
                      </div>
                    </SelectItem>
                    <SelectItem value="approved">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Approved
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        Rejected
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={`p-4 rounded-lg border shadow-lg ${getStatusColor(qualityStatus)}`}>
                <div className="flex items-center space-x-2">
                  {qualityStatus === "approved" && <CheckCircle className="w-4 h-4" />}
                  {qualityStatus === "rejected" && <XCircle className="w-4 h-4" />}
                  {qualityStatus === "pending" && <Clock className="w-4 h-4" />}
                  <span className="font-medium capitalize">{qualityStatus}</span>
                </div>
              </div>

              {qualityStatus === "rejected" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rejection Reason</Label>
                  <Textarea
                    placeholder="Explain why this node was rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-white/50 backdrop-blur-md border-white/50 shadow-lg"
                    rows={3}
                  />
                </div>
              )}

              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg backdrop-blur-sm border border-orange-400/30 transition-all duration-200">
                Save Quality Assessment
              </Button>
            </>
          )}

          {!selectedNode && (
            <div className="text-center text-gray-500 py-8">
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-xl">
                <Edit3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a node to begin quality control</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/30 bg-white/10 backdrop-blur-sm">
        <h3 className="font-semibold text-lg text-gray-800">Inspector</h3>
        <p className="text-sm text-gray-600">{selectedNode?.path?.join(" → ") || "No selection"}</p>
      </div>

      {/* Upper Half - Visualization */}
      <div className="h-1/2 border-b border-white/30">{renderVisualization()}</div>

      {/* Lower Half - Quality Control */}
      <div className="h-1/2">{renderQualityControl()}</div>
    </div>
  )
}
