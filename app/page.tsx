"use client"

import { useState } from "react"
import { FileNavigator } from "@/components/file-navigator"
import { CanvasView } from "@/components/canvas-view"
import { EnhancedInspectorPanel } from "@/components/enhanced-inspector-panel"
import { TopBar } from "@/components/top-bar"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react"

export default function QCAnythingPlatform() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "canvas" | "editor">("table")

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent pointer-events-none" />

      {/* Top Bar */}
      <TopBar
        currentPath={currentPath}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        selectedFile={selectedFile}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPathChange={setCurrentPath}
      />

      {/* Main Canvas Area - Full Screen */}
      <div className="flex-1 relative">
        <CanvasView
          selectedFile={selectedFile}
          onNodeSelect={setSelectedNode}
          selectedNode={selectedNode}
          currentPath={currentPath}
          currentIndex={currentIndex}
          onPathChange={setCurrentPath}
          viewMode={viewMode}
        />

        {/* Left Panel Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 z-30 bg-white/60 backdrop-blur-md hover:bg-white/80 shadow-xl border border-white/50 transition-all duration-300 ${
            leftPanelOpen ? "left-80" : "left-4"
          }`}
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        >
          {leftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </Button>

        {/* Floating Left Panel */}
        <div
          className={`absolute top-4 left-4 bottom-4 z-20 transition-all duration-300 ease-in-out ${
            leftPanelOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
          style={{ width: "320px" }}
        >
          <div className="h-full bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden">
            <FileNavigator onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          </div>
        </div>

        {/* Right Panel Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 z-30 bg-white/60 backdrop-blur-md hover:bg-white/80 shadow-xl border border-white/50 transition-all duration-300 ${
            rightPanelOpen ? "right-96" : "right-4"
          }`}
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
        >
          {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </Button>

        {/* Floating Right Panel */}
        <div
          className={`absolute top-4 right-4 bottom-4 z-20 transition-all duration-300 ease-in-out ${
            rightPanelOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          style={{ width: "400px" }}
        >
          <div className="h-full bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden">
            <EnhancedInspectorPanel selectedNode={selectedNode} currentPath={currentPath} />
          </div>
        </div>
      </div>
    </div>
  )
}
