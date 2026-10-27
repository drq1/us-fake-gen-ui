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
  onGenerateBankStatement?: (bankId?: "bofa" | "usbank") => void
  onGenerateTranscript?: (tab?: "highSchool" | "university" | "satAct", schoolStyle?: string) => void
  onGenerateAdmissionLetter?: (schoolId?: string) => void
  onGenerateSchedule?: (tab?: "schedule" | "tuition") => void
  onGenerateDriverLicense?: (state?: string) => void
  onGenerateVitalRecord?: (docType?: "birth" | "ged" | "marriage" | "skill", variant?: string) => void
}

// 跨弹窗显隐记忆用户的滚动位置、筛选分类与搜索词
let persistedScrollTop = 0
let persistedCategory = "all"
let persistedSearchQuery = ""

export function ReferenceTemplatesModal({
  open,
  onOpenChange,
  onGenerateBankStatement,
  onGenerateTranscript,
  onGenerateAdmissionLetter,
  onGenerateSchedule,
  onGenerateDriverLicense,
  onGenerateVitalRecord,
}: ReferenceTemplatesModalProps) {
  const [selectedCat, setSelectedCat] = useState(persistedCategory)
  const [searchQuery, setSearchQuery] = useState(persistedSearchQuery)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // 当弹窗打开时，毫秒级精准恢复用户上次浏览的精确滚动条高度
  React.useEffect(() => {
    if (open) {
      setSelectedCat(persistedCategory)
      setSearchQuery(persistedSearchQuery)

      const restoreScroll = () => {
        if (scrollContainerRef.current && persistedScrollTop > 0) {
          scrollContainerRef.current.scrollTop = persistedScrollTop
        }
      }
      requestAnimationFrame(restoreScroll)
      const t1 = setTimeout(restoreScroll, 50)
      const t2 = setTimeout(restoreScroll, 120)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [open])

  const handleSelectCategory = (catId: string) => {
    setSelectedCat(catId)
    persistedCategory = catId
    persistedScrollTop = 0
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
  }

  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    persistedSearchQuery = q
    persistedScrollTop = 0
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    persistedScrollTop = e.currentTarget.scrollTop
  }

  const saveScrollAndTrigger = (action?: () => void) => {
    if (scrollContainerRef.current) {
      persistedScrollTop = scrollContainerRef.current.scrollTop
    }
    action?.()
  }

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
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="搜索模板名称、类别..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* 分类筛选标签群 (自适应整齐折行，彻底消除横向滚动条) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            {REFERENCE_CATEGORIES.map((cat) => {
              const isSelected = selectedCat === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* 模板网格卡片滚动区域 (记忆并恢复滚动位置) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5"
        >
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
                          const isUsBank = item.name.toLowerCase().includes("us_bank") || item.name.toLowerCase().includes("us bank")
                          saveScrollAndTrigger(() => onGenerateBankStatement(isUsBank ? "usbank" : "bofa"))
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
                          const lower = item.name.toLowerCase()
                          const uniStyle = lower.includes("texas")
                            ? "texas_am"
                            : lower.includes("stern") || lower.includes("nyu")
                            ? "nyu_stern"
                            : lower.includes("harvard")
                            ? "harvard"
                            : lower.includes("ucla") || lower.includes("los angeles")
                            ? "ucla"
                            : lower.includes("mit")
                            ? "mit"
                            : undefined
                          saveScrollAndTrigger(() => onGenerateTranscript("university", uniStyle))
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
                          const lower = item.name.toLowerCase()
                          const hsStyle = lower.includes("parchment")
                            ? "parchment"
                            : lower.includes("duplicate")
                            ? "duplicate"
                            : "standard"
                          saveScrollAndTrigger(() => onGenerateTranscript("highSchool", hsStyle))
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
                          const isAct = item.name.toLowerCase().includes("act")
                          saveScrollAndTrigger(() => onGenerateTranscript("satAct", isAct ? "ACT" : "SAT"))
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-2xs transition-colors shrink-0"
                        title="查看并生成当前人偶配套的 SAT / ACT 标化考分"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成标化考分
                      </button>
                    )}

                    {/* 名校录取通知书一键生成 */}
                    {item.category === "offer" && onGenerateAdmissionLetter && (
                      <button
                        onClick={() => {
                          const lower = item.name.toLowerCase()
                          const schoolKey = lower.includes("berkeley")
                            ? "berkeley"
                            : lower.includes("mit")
                            ? "mit"
                            : lower.includes("harvard")
                            ? "harvard"
                            : lower.includes("chicago")
                            ? "uchicago"
                            : lower.includes("fullerton")
                            ? "csuf"
                            : lower.includes("temple")
                            ? "temple"
                            : undefined
                          saveScrollAndTrigger(() => onGenerateAdmissionLetter(schoolKey))
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 shadow-2xs transition-colors shrink-0"
                        title="使用当前人设一键生成官方录取信"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成录取信
                      </button>
                    )}

                    {/* 选课表与学费账单一键生成 */}
                    {item.category === "schedule" && onGenerateSchedule && (
                      <button
                        onClick={() => {
                          const isTuition = item.name.toLowerCase().includes("tuition") || item.name.toLowerCase().includes("statement")
                          saveScrollAndTrigger(() => onGenerateSchedule(isTuition ? "tuition" : "schedule"))
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成当期在读选课表与学费账单"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成课表账单
                      </button>
                    )}

                    {/* 驾照卡面一键生成 */}
                    {item.category === "license" && onGenerateDriverLicense && (
                      <button
                        onClick={() => {
                          const stateKey = item.name.toLowerCase().includes("york") ? "NY" :
                            item.name.toLowerCase().includes("wisconsin") ? "WI" : undefined
                          saveScrollAndTrigger(() => onGenerateDriverLicense(stateKey))
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成当前人设美国 REAL ID 驾照实体卡面"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成驾照卡
                      </button>
                    )}

                    {/* 出生证明一键生成 */}
                    {item.category === "birth" && onGenerateVitalRecord && (
                      <button
                        onClick={() => {
                          const lower = item.name.toLowerCase()
                          const isMich = lower.includes("michigan")
                          const isInfo = lower.includes("informational")
                          saveScrollAndTrigger(() =>
                            onGenerateVitalRecord("birth", isMich ? "michigan" : isInfo ? "informational" : "standard")
                          )
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成州卫生厅官方出生证明"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成出生证明
                      </button>
                    )}

                    {/* GED 文凭一键生成 */}
                    {item.category === "ged" && onGenerateVitalRecord && (
                      <button
                        onClick={() => {
                          const lower = item.name.toLowerCase()
                          const isTranscript = lower.includes("test_results") || lower.includes("test results")
                          saveScrollAndTrigger(() =>
                            onGenerateVitalRecord("ged", isTranscript ? "transcript" : "diploma")
                          )
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成官方 GED 高中文凭或全科成绩单"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成GED文凭
                      </button>
                    )}

                    {/* 结婚证明一键生成 */}
                    {item.category === "marriage" && onGenerateVitalRecord && (
                      <button
                        onClick={() => saveScrollAndTrigger(() => onGenerateVitalRecord("marriage"))}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-pink-600 text-white hover:bg-pink-700 shadow-2xs transition-colors shrink-0"
                        title="一键生成官方结婚登记证明"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成结婚证明
                      </button>
                    )}

                    {/* 技能证书一键生成 */}
                    {item.category === "skill" && onGenerateVitalRecord && (
                      <button
                        onClick={() => {
                          const lower = item.name.toLowerCase()
                          const isTrainer = lower.includes("trainer") || lower.includes("certification")
                          saveScrollAndTrigger(() =>
                            onGenerateVitalRecord("skill", isTrainer ? "trainer" : "cpr")
                          )
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-700 text-white hover:bg-cyan-800 shadow-2xs transition-colors shrink-0"
                        title="一键生成急救资质或 NASM 健身教练成绩单"
                      >
                        <Sparkles className="h-3 w-3" />
                        一键生成技能证书
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
