"use client"

import { Button } from "@/components/ui/button"
import { StateCombobox } from "@/components/state-combobox"
import { RefreshCw, Copy, Settings, Download, FileText, X, FolderArchive, Landmark } from "lucide-react"
import { US_STATES } from "@/lib/constants"

interface QuickFilterBarProps {
  state: string
  gender: string
  nameSet?: string
  minAge: number
  maxAge: number
  loading: boolean
  onStateChange: (state: string) => void
  onGenderChange: (gender: string) => void
  onNameSetChange?: (nameSet: string) => void
  onAgeChange: (minAge: number, maxAge: number) => void
  onRegenerate: () => void
  onCopyAll: () => void
  onOpenConfig: () => void
  onOpenJsonExport: () => void
  onOpenTranscript?: (tab?: "highSchool" | "university") => void
  onOpenBankStatement?: () => void
  onOpenTemplates?: () => void
}

const AGE_BRACKETS = [
  { label: "年龄不限", min: 0, max: 0 },
  { label: "18-24 青年", min: 18, max: 24 },
  { label: "25-40 职场", min: 25, max: 40 },
  { label: "41-60 中年", min: 41, max: 60 },
]

const TAX_FREE_STATES = [
  { code: "DE", name: "特拉华 (DE)" },
  { code: "OR", name: "俄勒冈 (OR)" },
  { code: "MT", name: "蒙大拿 (MT)" },
  { code: "NH", name: "新罕布什尔 (NH)" },
  { code: "AK", name: "阿拉斯加 (AK)" },
]

export function QuickFilterBar({
  state,
  gender,
  nameSet,
  minAge,
  maxAge,
  loading,
  onStateChange,
  onGenderChange,
  onNameSetChange,
  onAgeChange,
  onRegenerate,
  onCopyAll,
  onOpenConfig,
  onOpenJsonExport,
  onOpenTranscript,
  onOpenBankStatement,
  onOpenTemplates,
}: QuickFilterBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        {/* 左侧：筛选器群（移动端自适应折行） */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          {/* 州快捷搜索与选择（支持拼音、中文、英文名、两位代码、免税一键搜索） */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              选择州:
            </span>
            <StateCombobox
              value={state}
              onChange={onStateChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 姓名族裔风格切换（欧美/华裔/日裔/韩裔/拉美裔） */}
            {onNameSetChange && (
              <div className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-100/70 p-0.5 text-xs overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[
                  { id: "american", label: "🇺🇸 欧美" },
                  { id: "chinese", label: "🇨🇳 华裔" },
                  { id: "japanese", label: "🇯🇵 日裔" },
                  { id: "korean", label: "🇰🇷 韩裔" },
                  { id: "hispanic", label: "🇪🇸 拉美" },
                ].map((ns) => {
                  const isSelected = (nameSet || "american") === ns.id
                  return (
                    <button
                      key={ns.id}
                      onClick={() => onNameSetChange(ns.id)}
                      className={`rounded-md px-2 py-1.5 font-medium whitespace-nowrap transition-all duration-150 ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs font-semibold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {ns.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* 性别快捷切换 */}
            <div className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-100/70 p-0.5 text-xs">
              <button
                onClick={() => onGenderChange("")}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-all duration-150 ${
                  !gender
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                随机
              </button>
              <button
                onClick={() => onGenderChange("Male")}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-all duration-150 ${
                  gender === "Male"
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                男 (Male)
              </button>
              <button
                onClick={() => onGenderChange("Female")}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-all duration-150 ${
                  gender === "Female"
                    ? "bg-rose-500 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                女 (Female)
              </button>
            </div>

            {/* 年龄段快捷切换（手机端支持横向滑动，隐藏原生滚动条） */}
            <div className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-100/70 p-0.5 text-xs overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {AGE_BRACKETS.map((b) => {
                const isSelected =
                  (b.min === 0 && b.max === 0 && minAge === 0 && maxAge === 0) ||
                  (minAge === b.min && maxAge === b.max)

                return (
                  <button
                    key={b.label}
                    onClick={() => onAgeChange(b.min, b.max)}
                    className={`rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap transition-all duration-150 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {b.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右侧：核心操作按钮群（统一4字文案，绝不发生截断） */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* 生成新地址按钮：手机端满宽大按钮 */}
          <Button
            onClick={onRegenerate}
            disabled={loading}
            className="h-10 sm:h-9 w-full sm:w-auto rounded-lg bg-blue-600 px-5 text-sm sm:text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 sm:h-3.5 sm:w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "生成中..." : "生成新地址"}
          </Button>

          {/* 次要操作按钮：4列等宽，文案统一为简洁4字，彻底杜绝 ... 截断 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:flex sm:items-center sm:gap-2">
            <Button
              variant="outline"
              onClick={onCopyAll}
              className="h-9 rounded-lg border-slate-200/90 bg-white px-2 sm:px-3 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
            >
              <Copy className="mr-1 h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>复制全部</span>
            </Button>

            <Button
              variant="outline"
              onClick={onOpenConfig}
              className="h-9 rounded-lg border-slate-200/90 bg-white px-2 sm:px-3 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings className="mr-1 h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>高级筛选</span>
            </Button>

            {onOpenTranscript && (
              <Button
                variant="outline"
                onClick={() => onOpenTranscript()}
                className="h-9 rounded-lg border-blue-200 bg-blue-50/60 px-2 sm:px-3 text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-100 hover:text-blue-800 transition-all"
              >
                <FileText className="mr-1 h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>官方成绩</span>
              </Button>
            )}

            {onOpenBankStatement && (
              <Button
                variant="outline"
                onClick={onOpenBankStatement}
                className="h-9 rounded-lg border-red-200 bg-red-50/60 px-2 sm:px-3 text-xs font-semibold text-red-700 shadow-xs hover:bg-red-100 hover:text-red-800 transition-all"
              >
                <Landmark className="mr-1 h-3.5 w-3.5 text-red-600 shrink-0" />
                <span>银行流水</span>
              </Button>
            )}

            {onOpenTemplates && (
              <Button
                variant="outline"
                onClick={onOpenTemplates}
                className="h-9 rounded-lg border-purple-200 bg-purple-50/60 px-2 sm:px-3 text-xs font-semibold text-purple-700 shadow-xs hover:bg-purple-100 hover:text-purple-800 transition-all"
              >
                <FolderArchive className="mr-1 h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span>模板库 (24)</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onOpenJsonExport}
              className="h-9 rounded-lg border-slate-200/90 bg-white px-2 sm:px-3 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
            >
              <Download className="mr-1 h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>导出数据</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 免税州快捷标签（全平台隐藏滚动条，平滑手势滑动） */}
      <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5 border-t border-slate-100 pt-3 text-xs">
        <span className="font-medium text-slate-400 mr-1 whitespace-nowrap shrink-0">免税州直达:</span>
        {TAX_FREE_STATES.map((ts) => {
          const isSelected = state === ts.code
          return (
            <button
              key={ts.code}
              onClick={() => onStateChange(ts.code)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100/80 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-200/70"
              }`}
            >
              {ts.name}
            </button>
          )
        })}
        {state && (
          <button
            onClick={() => onStateChange("")}
            className="ml-auto inline-flex items-center gap-0.5 text-xs text-slate-400 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0 pl-2"
          >
            <X className="h-3 w-3" />
            重置随机
          </button>
        )}
      </div>
    </div>
  )
}
