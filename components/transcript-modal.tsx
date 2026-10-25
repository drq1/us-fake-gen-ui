"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Edit3, Eye, RefreshCw, GraduationCap, School, Download, ExternalLink, ArrowLeft } from "lucide-react"
import type { PersonData, SchoolData, UniversityData } from "@/lib/types"
import type { StudentTranscript } from "@/lib/transcript-types"
import type { UniversityTranscriptData } from "@/lib/university-transcript-types"
import { generateTranscriptData } from "@/lib/transcript-generator"
import { generateUniversityTranscript } from "@/lib/university-transcript-generator"
import { TranscriptSheet } from "./transcript-sheet"
import { UniversityTranscriptSheet } from "./university-transcript-sheet"

interface TranscriptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  school?: SchoolData | null
  university?: UniversityData | null
  seed?: number
  defaultTab?: "highSchool" | "university"
  onBackToTemplates?: () => void
}

export function TranscriptModal({
  open,
  onOpenChange,
  person,
  school,
  university,
  seed = 2026,
  defaultTab = "highSchool",
  onBackToTemplates,
}: TranscriptModalProps) {
  const [activeTab, setActiveTab] = useState<"highSchool" | "university">(defaultTab)
  const [highSchoolData, setHighSchoolData] = useState<StudentTranscript | null>(null)
  const [universityData, setUniversityData] = useState<UniversityTranscriptData | null>(null)
  const [isEditable, setIsEditable] = useState(false)
  const [watermark, setWatermark] = useState<"OFFICIAL" | "ISSUED_TO_STUDENT" | "SAMPLE" | "NONE">("OFFICIAL")
  const [currentSeed, setCurrentSeed] = useState(seed)

  useEffect(() => {
    if (defaultTab && open) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, open])

  // 当外部数据或 seed 变化时重新生成数据
  useEffect(() => {
    if (person) {
      const hs = generateTranscriptData(person, school, currentSeed)
      const uni = generateUniversityTranscript(person, university || null, currentSeed)
      setHighSchoolData(hs)
      setUniversityData(uni)
    }
  }, [person, school, university, currentSeed])

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
    const isHS = activeTab === "highSchool"
    const payload = isHS ? highSchoolData : universityData
    if (!payload) return
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${isHS ? "HighSchool" : "University"}_Transcript_${person?.fullName?.replace(/\s+/g, "_") || "student"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const watermarkStringMap = {
    OFFICIAL: "OFFICIAL TRANSCRIPT",
    ISSUED_TO_STUDENT: "SAMPLE COPY",
    SAMPLE: "SAMPLE COPY",
    NONE: "",
  }

  const hsSamples = [
    { name: "Parchment 权威交付电子档", file: "/templates/08_High_School_Transcripts/High_School_Official_Record_Parchment.pdf" },
    { name: "4年制公立高中官方原样", file: "/templates/08_High_School_Transcripts/High_School_Sample_Standard_Transcript.pdf" },
    { name: "官方加注 Duplicate 补发本", file: "/templates/08_High_School_Transcripts/High_School_Duplicate_Transcript.pdf" },
    { name: "真实教务档案实物照", file: "/templates/08_High_School_Transcripts/High_School_Transcript_Full_Record.jpeg" },
  ]

  const uniSamples = [
    { name: "德州农工 Texas A&M 真实防伪原件", file: "/templates/12_Genuine_University_Transcripts/Texas_AM_Official_Security_Transcript.jpeg" },
    { name: "纽大斯特恩 NYU Stern 成绩单实物", file: "/templates/12_Genuine_University_Transcripts/NYU_Stern_Undergraduate_Transcript.png" },
    { name: "加州大学 UCLA 官方学业档案", file: "/templates/12_Genuine_University_Transcripts/UCLA_University_Academic_Transcript.jpeg" },
    { name: "麻省理工 MIT 官方成绩单", file: "/templates/12_Genuine_University_Transcripts/MIT_Academic_Transcript_Official.png" },
    { name: "哈佛大学 Harvard 成绩单原件", file: "/templates/12_Genuine_University_Transcripts/Harvard_University_Academic_Transcript.jpeg" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-5xl h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto print:max-h-none print:overflow-visible">
        {/* 固定顶部操作栏 (独立置顶，绝不跟随滚动) */}
        <DialogHeader className="print:hidden border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 shrink-0 z-10 text-left">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                  {activeTab === "highSchool" ? (
                    <>
                      <School className="h-5 w-5 text-blue-600" />
                      美高官方成绩单生成器 (Official High School Transcript)
                    </>
                  ) : (
                    <>
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                      美国大学官方教务成绩单 (Official University Academic Record)
                    </>
                  )}
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  全美真实学校数据库自动映射，支持在线修改微调、加减防伪水印与高保真矢量 PDF 导出
                </p>
              </div>

              {/* 学历阶段 Tab 切换器 */}
              <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white p-1 text-xs shrink-0 self-start sm:self-auto shadow-2xs">
                <button
                  onClick={() => setActiveTab("highSchool")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "highSchool"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <School className="h-3.5 w-3.5" />
                  美高成绩单
                </button>
                <button
                  onClick={() => setActiveTab("university")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "university"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  大学成绩单
                </button>
              </div>
            </div>

            {/* 控制条操作工具栏 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80">
              {/* 左侧：参考官方真实 PDF 样本下载比对 */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 whitespace-nowrap">参考真实样本:</span>
                {(activeTab === "highSchool" ? hsSamples : uniSamples).map((s) => (
                  <a
                    key={s.name}
                    href={s.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                    {s.name}
                  </a>
                ))}
              </div>

              {/* 右侧：动作按钮 */}
              <div className="flex flex-wrap items-center gap-2">
                {onBackToTemplates && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onBackToTemplates}
                    className="h-8 text-xs font-bold bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 shadow-2xs"
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    返回参考模板库
                  </Button>
                )}

                {/* 在线微调 */}
                <Button
                  variant={isEditable ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditable(!isEditable)}
                  className={`h-8 text-xs font-semibold ${
                    isEditable ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-white"
                  }`}
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

                {/* 防伪水印 */}
                <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                  {[
                    { id: "OFFICIAL", label: "OFFICIAL" },
                    { id: "ISSUED_TO_STUDENT", label: "STUDENT" },
                    { id: "SAMPLE", label: "SAMPLE" },
                    { id: "NONE", label: "无水印" },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWatermark(w.id as typeof watermark)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                        watermark === w.id ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>

                {/* 随机成绩 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="h-8 text-xs font-semibold bg-white"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  换一批
                </Button>

                {/* 核心：导出 PDF / 打印 */}
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  <Printer className="mr-1.5 h-3.5 w-3.5" />
                  打印 / 另存为 PDF
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* 成绩单主体内容独立滚动区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 print:p-0 print:overflow-visible">
          <div className="overflow-x-auto print:overflow-visible">
            {activeTab === "highSchool" && highSchoolData && (
              <TranscriptSheet
                data={highSchoolData}
                isEditable={isEditable}
                watermarkText={watermarkStringMap[watermark]}
                onChange={setHighSchoolData}
              />
            )}

            {activeTab === "university" && universityData && (
              <UniversityTranscriptSheet
                data={universityData}
                watermark={watermark}
                isEditable={isEditable}
                onUpdate={setUniversityData}
              />
            )}
          </div>
        </div>

        {/* 底部简短说明 (固定在底部，绝不跟随滚动) */}
        <div className="print:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            💡 提示：在浏览器打印预览窗口中，将「目标打印机」选择为<b>「另存为 PDF」</b>，纸张选 <b>Letter</b> 或 <b>A4</b> 即可导出高保真矢量文件。
          </span>
          <div className="flex items-center gap-2">
            {onBackToTemplates && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToTemplates}
                className="h-7 text-xs border-slate-300 text-blue-700 bg-blue-50/50 hover:bg-blue-100/80 font-medium"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                返回参考模板库
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleExportJson} className="h-7 text-xs text-slate-600">
              <Download className="mr-1 h-3 w-3" />
              下载本单 JSON
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TranscriptModal
