"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Check, FileJson } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PersonData, SchoolData, UniversityData } from "@/lib/types"
import { UNIVERSITY_TYPE_MAP } from "@/lib/constants"

interface JsonDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: PersonData | null
  schoolData: SchoolData | null
  universityData: UniversityData | null
  visibleFields: string[]
}

function JsonDownloadDialog({
  open,
  onOpenChange,
  data,
  schoolData,
  universityData,
  visibleFields,
}: JsonDownloadDialogProps) {
  const [jsonMode, setJsonMode] = useState<"complete" | "display">("complete")
  const [jsonContent, setJsonContent] = useState("")
  const [copied, setCopied] = useState(false)

  const generateCompleteJson = useCallback(() => {
    if (!data) return "{}"

    const completeData: Record<string, any> = { ...data }

    // 添加权威中学信息
    if (schoolData) {
      completeData.school = {
        name: schoolData.name,
        ncesid: schoolData.ncesid,
        zip: schoolData.zip,
        website: schoolData.website && schoolData.website !== "NOT AVAILABLE" ? schoolData.website : null,
        address: `${schoolData.address}, ${schoolData.city}, ${schoolData.state} ${schoolData.zip}`,
        city: schoolData.city,
        state: schoolData.state,
        phone: schoolData.telephone,
        grades: `${schoolData.st_grade}-${schoolData.end_grade}`,
      }
    }

    // 添加权威大学信息
    if (universityData) {
      completeData.university = {
        name: universityData.name,
        ipedsid: universityData.ipedsid,
        zip: universityData.zip,
        website: universityData.website && universityData.website !== "NOT AVAILABLE" ? universityData.website : null,
        address: `${universityData.address}, ${universityData.city}, ${universityData.state} ${universityData.zip}`,
        city: universityData.city,
        state: universityData.state,
        phone: universityData.telephone,
        type: UNIVERSITY_TYPE_MAP[universityData.type] || universityData.type,
      }
    }

    return JSON.stringify(completeData, null, 2)
  }, [data, schoolData, universityData])

  const generateDisplayJson = useCallback(() => {
    if (!data) return "{}"

    const displayData: Record<string, any> = {}

    // 添加可见字段
    visibleFields.forEach((field) => {
      if (field.startsWith("school") && schoolData) {
        if (!displayData.school) displayData.school = {}

        switch (field) {
          case "schoolName":
            displayData.school.name = schoolData.name
            break
          case "schoolId":
            displayData.school.id = schoolData.ncesid
            break
          case "schoolZip":
            displayData.school.zip = schoolData.zip
            break
          case "schoolWebsite":
            if (schoolData.website && schoolData.website !== "NOT AVAILABLE") {
              displayData.school.website = schoolData.website
            }
            break
          case "schoolAddress":
            displayData.school.address = `${schoolData.address}, ${schoolData.city}, ${schoolData.state} ${schoolData.zip}`
            break
          case "schoolCity":
            displayData.school.city = schoolData.city
            break
          case "schoolState":
            displayData.school.state = schoolData.state
            break
          case "schoolPhone":
            displayData.school.phone = schoolData.telephone
            break
          case "schoolGrades":
            displayData.school.grades = `${schoolData.st_grade}-${schoolData.end_grade}`
            break
        }
      } else if (field.startsWith("university") && universityData) {
        if (!displayData.university) displayData.university = {}

        switch (field) {
          case "universityName":
            displayData.university.name = universityData.name
            break
          case "universityId":
            displayData.university.id = universityData.ipedsid
            break
          case "universityZip":
            displayData.university.zip = universityData.zip
            break
          case "universityWebsite":
            if (universityData.website && universityData.website !== "NOT AVAILABLE") {
              displayData.university.website = universityData.website
            }
            break
          case "universityAddress":
            displayData.university.address = `${universityData.address}, ${universityData.city}, ${universityData.state} ${universityData.zip}`
            break
          case "universityCity":
            displayData.university.city = universityData.city
            break
          case "universityState":
            displayData.university.state = universityData.state
            break
          case "universityPhone":
            displayData.university.phone = universityData.telephone
            break
          case "universityType":
            displayData.university.type =
              UNIVERSITY_TYPE_MAP[universityData.type] || universityData.type
            break
        }
      } else if (data[field as keyof PersonData] !== undefined) {
        displayData[field] = data[field as keyof PersonData]
      }
    })

    return JSON.stringify(displayData, null, 2)
  }, [data, schoolData, universityData, visibleFields])

  // 当弹窗打开或数据更新时，自动生成 JSON 填充内容
  useEffect(() => {
    if (open && data) {
      const content = jsonMode === "complete" ? generateCompleteJson() : generateDisplayJson()
      setJsonContent(content)
    }
  }, [open, data, jsonMode, generateCompleteJson, generateDisplayJson])

  const handleModeChange = (mode: "complete" | "display") => {
    setJsonMode(mode)
    const newContent = mode === "complete" ? generateCompleteJson() : generateDisplayJson()
    setJsonContent(newContent)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "复制成功",
        description: "JSON 数据已复制到剪贴板",
      })
    } catch {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `us-identity-${data?.state || "US"}-${jsonMode}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "下载成功",
        description: "JSON 文件已保存到本地",
      })
    } catch {
      toast({
        title: "下载失败",
        description: "无法创建下载文件",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="text-left border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <FileJson className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                导出 JSON 数据
              </DialogTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                支持直接在下方编辑修改，可随时一键复制或导出为 .json 文件
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 pt-2">
          {/* 模式切换与操作栏（4字对齐，完全杜绝手机端单字折行） */}
          <div className="flex justify-between items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-100/70 p-0.5 text-xs">
              <button
                onClick={() => handleModeChange("complete")}
                className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-all duration-150 ${
                  jsonMode === "complete"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                全量数据
              </button>
              <button
                onClick={() => handleModeChange("display")}
                className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-all duration-150 ${
                  jsonMode === "display"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                显示字段
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!jsonContent}
              className="h-8 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 shrink-0"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              下载文件
            </Button>
          </div>

          {/* JSON 内容编辑展示区 */}
          <div className="relative">
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="min-h-[260px] sm:min-h-[360px] font-mono text-xs leading-relaxed resize-none bg-slate-50/70 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 p-3 sm:p-4 rounded-xl"
              placeholder="JSON 内容生成中..."
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="absolute top-3 right-3 h-8 bg-white/95 backdrop-blur-xs border-slate-200/90 text-xs font-medium shadow-xs hover:bg-white"
              disabled={!jsonContent}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  复制 JSON
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span>• 全量数据包含物理地址、信用卡、职业、账号及教育信息。</span>
            </div>
            <div className="font-mono text-xs text-slate-400 shrink-0 self-end sm:self-auto">
              {jsonContent.length > 0 ? `共 ${jsonContent.length} 字符` : ""}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JsonDownloadDialog
