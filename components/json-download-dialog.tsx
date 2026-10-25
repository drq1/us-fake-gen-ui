"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Check, FileJson, Link, Upload, RefreshCw, AlertCircle } from "lucide-react"
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
  onRestore?: (restoredData: { person: PersonData; school?: SchoolData; university?: UniversityData }) => void
}

export function JsonDownloadDialog({
  open,
  onOpenChange,
  data,
  schoolData,
  universityData,
  visibleFields,
  onRestore,
}: JsonDownloadDialogProps) {
  const [activeTab, setActiveTab] = useState<"export" | "import">("export")
  const [jsonMode, setJsonMode] = useState<"complete" | "display">("complete")
  const [jsonContent, setJsonContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [importText, setImportText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateCompleteJson = useCallback(() => {
    if (!data) return "{}"

    const completeData: Record<string, unknown> = { ...data }

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
        type: UNIVERSITY_TYPE_MAP[universityData.type] || "公立大学",
      }
    }

    return JSON.stringify(completeData, null, 2)
  }, [data, schoolData, universityData])

  const generateDisplayJson = useCallback(() => {
    if (!data) return "{}"

    const displayData: Record<string, unknown> = {}

    visibleFields.forEach((field) => {
      if (field.startsWith("school") && schoolData) {
        if (!displayData.school) displayData.school = {}
        const s = displayData.school as Record<string, unknown>
        switch (field) {
          case "schoolName":
            s.name = schoolData.name
            break
          case "schoolId":
            s.id = schoolData.ncesid
            break
          case "schoolZip":
            s.zip = schoolData.zip
            break
          case "schoolWebsite":
            if (schoolData.website && schoolData.website !== "NOT AVAILABLE") {
              s.website = schoolData.website
            }
            break
          case "schoolAddress":
            s.address = `${schoolData.address}, ${schoolData.city}, ${schoolData.state} ${schoolData.zip}`
            break
          case "schoolCity":
            s.city = schoolData.city
            break
          case "schoolState":
            s.state = schoolData.state
            break
          case "schoolPhone":
            s.phone = schoolData.telephone
            break
          case "schoolGrades":
            s.grades = `${schoolData.st_grade}-${schoolData.end_grade}`
            break
        }
        return
      }

      if (field.startsWith("university") && universityData) {
        if (!displayData.university) displayData.university = {}
        const u = displayData.university as Record<string, unknown>
        switch (field) {
          case "universityName":
            u.name = universityData.name
            break
          case "universityId":
            u.id = universityData.ipedsid
            break
          case "universityZip":
            u.zip = universityData.zip
            break
          case "universityWebsite":
            if (universityData.website && universityData.website !== "NOT AVAILABLE") {
              u.website = universityData.website
            }
            break
          case "universityAddress":
            u.address = `${universityData.address}, ${universityData.city}, ${universityData.state} ${universityData.zip}`
            break
          case "universityCity":
            u.city = universityData.city
            break
          case "universityState":
            u.state = universityData.state
            break
          case "universityType":
            u.type = UNIVERSITY_TYPE_MAP[universityData.type] || "公立大学"
            break
        }
        return
      }

      if (field in data) {
        displayData[field] = data[field as keyof PersonData]
      }
    })

    return JSON.stringify(displayData, null, 2)
  }, [data, schoolData, universityData, visibleFields])

  useEffect(() => {
    if (open) {
      if (jsonMode === "complete") {
        setJsonContent(generateCompleteJson())
      } else {
        setJsonContent(generateDisplayJson())
      }
    }
  }, [open, jsonMode, generateCompleteJson, generateDisplayJson])

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

  // 复制专属还原链接
  const handleCopyRestoreLink = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
      toast({
        title: "专属还原链接已复制！",
        description: "任何时候通过此链接打开，系统将 100% 还原当前这套真实地址与人设资料。",
      })
    } catch {
      toast({
        title: "复制失败",
        description: "无法复制链接到剪贴板",
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
      a.download = `fake_data_${data?.fullName?.replace(/\s+/g, "_") || "profile"}_${Date.now()}.json`
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

  // 处理文件读取
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setImportText(content)
      handleParseAndRestore(content)
    }
    reader.readAsText(file)
  }

  // 执行恢复解析
  const handleParseAndRestore = (rawJson: string) => {
    if (!rawJson.trim()) {
      toast({ title: "内容为空", description: "请粘贴或上传 JSON 数据", variant: "destructive" })
      return
    }
    try {
      const parsed = JSON.parse(rawJson)
      if (!parsed.fullName && !parsed.street) {
        toast({
          title: "数据格式不符",
          description: "未能找到标准人偶姓名或地址字段",
          variant: "destructive",
        })
        return
      }

      if (onRestore) {
        onRestore({
          person: parsed as PersonData,
          school: parsed.school,
          university: parsed.university,
        })
        toast({
          title: "资料恢复成功！",
          description: `已成功加载 ${parsed.fullName || "人偶"} 的整套身份与地址数据。`,
        })
        onOpenChange(false)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "JSON 解析错误",
        description: "请检查输入的 JSON 格式是否完整有效",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="text-left border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <FileJson className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  数据导入、导出与还原中心
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  支持专属链接一键直达、文件导出备份及已有 JSON 完整恢复
                </p>
              </div>
            </div>

            {/* 顶栏主功能 Tab 切换 */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("export")}
                className={`rounded-md px-3 py-1 font-semibold transition-all ${
                  activeTab === "export" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                导出数据
              </button>
              <button
                onClick={() => setActiveTab("import")}
                className={`rounded-md px-3 py-1 font-semibold transition-all ${
                  activeTab === "import" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                上传/恢复
              </button>
            </div>
          </div>
        </DialogHeader>

        {activeTab === "export" ? (
          <div className="space-y-3.5 pt-2">
            {/* 模式切换与操作栏 */}
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-100/70 p-0.5 text-xs">
                <button
                  onClick={() => setJsonMode("complete")}
                  className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-all duration-150 ${
                    jsonMode === "complete"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  全量数据
                </button>
                <button
                  onClick={() => setJsonMode("display")}
                  className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-all duration-150 ${
                    jsonMode === "display"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  显示字段
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* 复制永久还原链接 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyRestoreLink}
                  className="h-8 border-blue-200 bg-blue-50/60 text-xs font-semibold text-blue-700 hover:bg-blue-100 shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      已复制链接
                    </>
                  ) : (
                    <>
                      <Link className="h-3.5 w-3.5 mr-1 text-blue-600" />
                      复制还原链接
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!jsonContent}
                  className="h-8 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 shrink-0"
                >
                  <Download className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  下载文件
                </Button>
              </div>
            </div>

            {/* JSON 内容编辑展示区 */}
            <div className="relative">
              <Textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                className="min-h-[260px] sm:min-h-[340px] font-mono text-xs leading-relaxed resize-none bg-slate-50/70 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 p-3 sm:p-4 rounded-xl"
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
                <span>• 只要保存<b>「专属还原链接」</b>，随时随地在任何浏览器打开即可 100% 恢复当前数据。</span>
              </div>
              <div className="font-mono text-xs text-slate-400 shrink-0 self-end sm:self-auto">
                {jsonContent.length > 0 ? `共 ${jsonContent.length} 字符` : ""}
              </div>
            </div>
          </div>
        ) : (
          /* 上传与恢复选项卡 */
          <div className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors bg-slate-50/50">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  点击选择或拖拽已导出的 .json 资料文件
                </div>
                <p className="text-xs text-slate-400">
                  支持恢复由本站导出的全套人设、真实地址与教育信息
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs"
                >
                  <FileJson className="h-3.5 w-3.5 mr-1.5" />
                  选择本地 JSON 文件
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                或者直接在下方粘贴 JSON 文本：
              </label>
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='在此粘贴之前保存的 JSON 数据，例如 {"fullName": "...", "street": "..."}'
                className="min-h-[140px] font-mono text-xs bg-slate-50 border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                恢复后将自动替换当前屏幕展示的所有人设与地址信息
              </span>
              <Button
                onClick={() => handleParseAndRestore(importText)}
                disabled={!importText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-5"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                立即恢复并展示
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default JsonDownloadDialog
