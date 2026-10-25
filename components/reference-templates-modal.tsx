"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  FolderArchive,
  Search,
  ExternalLink,
  CreditCard,
  Building,
  GraduationCap,
  Award,
  Heart,
  FileSpreadsheet,
  FileCheck,
  Sparkles,
} from "lucide-react"
import {
  REFERENCE_CATEGORIES,
  REFERENCE_TEMPLATES,
  type ReferenceTemplate,
} from "@/lib/reference-templates-data"

interface ReferenceTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerateBankStatement?: () => void
  onGenerateTranscript?: (tab?: "highSchool" | "university") => void
}

export function ReferenceTemplatesModal({
  open,
  onOpenChange,
  onGenerateBankStatement,
  onGenerateTranscript,
}: ReferenceTemplatesModalProps) {
  const [selectedCat, setSelectedCat] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = REFERENCE_TEMPLATES.filter((t) => {
    const matchesCat = selectedCat === "all" || t.category === selectedCat
    const matchesSearch =
      !searchQuery.trim() ||
      t.chineseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const getFileIcon = (type: ReferenceTemplate["fileType"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-rose-600" />
      case "docx":
      case "doc":
        return <FileCheck className="h-4 w-4 text-blue-600" />
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
      default:
        return <Award className="h-4 w-4 text-amber-600" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-5xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 shadow-2xl">
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-200 bg-white shrink-0 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <FolderArchive className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  真实凭证参考模板库 ({REFERENCE_TEMPLATES.length} 份高清实物与原始排版)
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  涵盖高校成绩单、录取通知书、选课学费账单、银行流水、标化考分与证件
                </p>
              </div>
            </div>

            {/* 快速搜索框 */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模板名称、类别..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* 分类筛选横条 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-thin">
            {REFERENCE_CATEGORIES.map((cat) => {
              const isSelected = selectedCat === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 border border-slate-200/80 hover:bg-slate-200"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              )
            })}
          </div>
        </DialogHeader>

        {/* 模板网格卡片滚动区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="min-w-0 w-full bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                        {getFileIcon(item.fileType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug break-words">
                          {item.chineseName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate block mt-0.5" title={item.name}>
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 whitespace-nowrap">
                      {item.fileType} · {item.fileSize}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed break-words line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">
                    分类: <b className="text-slate-700">{item.categoryChinese}</b>
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 ml-auto">
                    {/* 银行账单一键生成 */}
                    {item.category === "bank" && onGenerateBankStatement && (
                      <button
                        onClick={() => {
                          onGenerateBankStatement()
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-2xs transition-colors shrink-0"
                        title="使用当前人偶姓名与物理地址，一键生成配套月度账单与资金流水"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成本人账单
                      </button>
                    )}

                    {/* 大学成绩单一键生成 */}
                    {item.category === "transcript" && item.categoryChinese === "大学成绩单" && onGenerateTranscript && (
                      <button
                        onClick={() => {
                          onGenerateTranscript("university")
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成当前人偶大学官方教务成绩单"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成大学成绩单
                      </button>
                    )}

                    {/* 美高成绩单一键生成 */}
                    {item.category === "transcript" && item.categoryChinese !== "大学成绩单" && onGenerateTranscript && (
                      <button
                        onClick={() => {
                          onGenerateTranscript("highSchool")
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成当前人偶美高官方成绩单"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成美高成绩单
                      </button>
                    )}

                    {/* 标化考分一键生成 */}
                    {item.category === "act_sat" && onGenerateTranscript && (
                      <button
                        onClick={() => {
                          onGenerateTranscript("highSchool")
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-2xs transition-colors shrink-0"
                        title="查看并生成当前人偶配套的 SAT / ACT 标化考分"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成标化考分
                      </button>
                    )}

                    <a
                      href={item.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors shrink-0"
                    >
                      <Download className="h-3 w-3" />
                      下载模板
                    </a>

                    {item.fileType === "image" && (
                      <a
                        href={item.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                        原图
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部引导栏 (固定在底部) */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 leading-normal">
            💡 <b>资料衍生提示：</b>以上 {REFERENCE_TEMPLATES.length} 份真实素材与官方原件已全部署在项目的{" "}
            <code className="text-blue-700 font-mono">public/templates/</code> 目录。
            点击任一<b>「一键生成」</b>即可快速生成当前人设的真实资料，关闭后可<b>随时无缝返回</b>此模板库！
          </div>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs px-4"
          >
            关闭浏览
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReferenceTemplatesModal
