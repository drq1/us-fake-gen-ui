"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Edit3, Eye, RefreshCw, FileText, Check } from "lucide-react"
import type { PersonData, SchoolData } from "@/lib/types"
import type { StudentTranscript } from "@/lib/transcript-types"
import { generateTranscriptData } from "@/lib/transcript-generator"
import { TranscriptSheet } from "./transcript-sheet"

interface TranscriptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  school?: SchoolData | null
  seed?: number
}

export function TranscriptModal({
  open,
  onOpenChange,
  person,
  school,
  seed = 2026,
}: TranscriptModalProps) {
  const [transcriptData, setTranscriptData] = useState<StudentTranscript | null>(null)
  const [isEditable, setIsEditable] = useState(false)
  const [watermark, setWatermark] = useState("OFFICIAL TRANSCRIPT")
  const [currentSeed, setCurrentSeed] = useState(seed)

  // 当外部人偶或学校变化时重新生成数据
  useEffect(() => {
    if (person) {
      const generated = generateTranscriptData(person, school, currentSeed)
      setTranscriptData(generated)
    }
  }, [person, school, currentSeed])

  // 触发打印 / 另存为 PDF
  const handlePrint = () => {
    window.print()
  }

  // 随机刷新成绩与排位
  const handleRegenerate = () => {
    const nextSeed = Math.floor(Math.random() * 1000000)
    setCurrentSeed(nextSeed)
  }

  // 导出 JSON
  const handleExportJson = () => {
    if (!transcriptData) return
    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Transcript_${transcriptData.studentName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-5xl max-h-[94vh] overflow-y-auto p-3 sm:p-6 bg-slate-100 print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:max-h-none print:overflow-visible">
        <DialogHeader className="print:hidden border-b border-slate-200 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-blue-600" />
                美高官方成绩单生成器 (Official High School Transcript)
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                根据当前人偶档案与真实学校数据自动生成，支持在线双击微调并高保真导出 PDF
              </p>
            </div>

            {/* 控制条操作按钮群 */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 编辑模式切换 */}
              <Button
                variant={isEditable ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditable(!isEditable)}
                className={`h-8 text-xs font-semibold ${isEditable ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
              >
                {isEditable ? (
                  <>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    完成编辑
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                    在线微调
                  </>
                )}
              </Button>

              {/* 水印切换 */}
              <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                {["OFFICIAL", "SAMPLE", "无水印"].map((item) => {
                  const val = item === "无水印" ? "" : item === "OFFICIAL" ? "OFFICIAL TRANSCRIPT" : "SAMPLE COPY"
                  const isSelected = watermark === val
                  return (
                    <button
                      key={item}
                      onClick={() => setWatermark(val)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        isSelected ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              {/* 随机成绩刷新 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 text-xs font-semibold bg-white"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                换一批成绩
              </Button>

              {/* 核心：导出 PDF / 打印 */}
              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                打印 / 导出 PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 成绩单主体预览区域 */}
        <div className="my-4 overflow-x-auto print:my-0 print:overflow-visible">
          {transcriptData && (
            <TranscriptSheet
              data={transcriptData}
              isEditable={isEditable}
              watermarkText={watermark}
              onChange={setTranscriptData}
            />
          )}
        </div>

        {/* 底部简短说明 */}
        <div className="print:hidden border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            💡 提示：在浏览器打印预览窗口中，将「目标打印机」选择为<b>「另存为 PDF」</b>，纸张选 <b>Letter</b> 或 <b>A4</b> 即可导出高保真矢量文件。
          </span>
          <Button variant="ghost" size="sm" onClick={handleExportJson} className="h-7 text-xs text-slate-600">
            下载数据 JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
