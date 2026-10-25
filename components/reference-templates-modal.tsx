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
}

export function ReferenceTemplatesModal({
  open,
  onOpenChange,
  onGenerateBankStatement,
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
      <DialogContent className="w-[98vw] max-w-5xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-slate-50">
        <DialogHeader className="border-b border-slate-200 pb-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <FolderArchive className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                  真实凭证参考模板库 (24 份高清实物与原始排版)
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  涵盖银行流水账单、驾照、标化考试、出生证明、文凭证书与官方学业档案
                </p>
              </div>
            </div>

            {/* 快速搜索框 */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模板名称、类别..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* 分类筛选横条 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {REFERENCE_CATEGORIES.map((cat) => {
              const isSelected = selectedCat === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              )
            })}
          </div>
        </DialogHeader>

        {/* 模板网格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                      {getFileIcon(item.fileType)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                        {item.chineseName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-[260px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {item.fileType} · {item.fileSize}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-400">
                  分类: <b className="text-slate-700">{item.categoryChinese}</b>
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={item.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    下载模板
                  </a>

                  {item.fileType === "image" && (
                    <a
                      href={item.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <ExternalLink className="h-3 w-3" />
                      预览原图
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部引导栏 */}
        <div className="mt-4 border-t border-slate-200 pt-3 bg-white p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 leading-normal">
            💡 <b>资料衍生提示：</b>以上 24 份原始素材已完整同步并分类部署在项目的{" "}
            <code className="text-blue-700 font-mono">public/templates/</code> 目录。
            结合系统现有真实地址与人设数据，可快速衍生支持<b>银行账单流水</b>、<b>驾照卡面预览</b>与<b>ACT/SAT 考分单</b>！
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
