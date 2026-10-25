"use client"

import { useState } from "react"
import { ShoppingBag, Apple, Laptop, Building2, GraduationCap, Shuffle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"

export interface PresetScenario {
  id: string
  label: string
  shortLabel: string
  desc: string
  iconName: string
  params: {
    state: string
    gender?: string
    minAge?: number
    maxAge?: number
  }
  badge?: string
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "tax-free-de",
    label: "海淘免税 (特拉华)",
    shortLabel: "海淘特拉华",
    desc: "0%消费税 · 美东转运首选",
    iconName: "shopping",
    params: { state: "DE" },
    badge: "0% 免税",
  },
  {
    id: "tax-free-or",
    label: "海淘免税 (俄勒冈)",
    shortLabel: "海淘俄勒冈",
    desc: "0%消费税 · 美西转运常用",
    iconName: "shopping",
    params: { state: "OR" },
    badge: "0% 免税",
  },
  {
    id: "apple-id",
    label: "美区 Apple ID / Google",
    shortLabel: "美区 Apple ID",
    desc: "免税区 · 规范邮编与区号",
    iconName: "apple",
    params: { state: "MT" },
    badge: "免税区",
  },
  {
    id: "silicon-valley",
    label: "硅谷高科技从业者",
    shortLabel: "硅谷高科技",
    desc: "加州 CA · 科技大厂与名校",
    iconName: "laptop",
    params: { state: "CA", minAge: 25, maxAge: 38 },
  },
  {
    id: "wall-street",
    label: "纽约华尔街金融",
    shortLabel: "华尔街金融",
    desc: "纽约 NY · 金融机构与公寓",
    iconName: "building",
    params: { state: "NY", minAge: 26, maxAge: 45 },
  },
  {
    id: "ivy-student",
    label: "常春藤留学生",
    shortLabel: "常春藤学生",
    desc: "麻省 MA · 哈佛/MIT 学术圈",
    iconName: "grad",
    params: { state: "MA", minAge: 18, maxAge: 24 },
  },
]

interface PresetScenariosProps {
  currentState: string
  currentMinAge?: number
  currentMaxAge?: number
  onApplyPreset: (params: { state: string; minAge?: number; maxAge?: number }) => void
}

export function PresetScenarios({
  currentState,
  currentMinAge,
  currentMaxAge,
  onApplyPreset,
}: PresetScenariosProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const renderIcon = (name: string, className = "h-3.5 w-3.5") => {
    switch (name) {
      case "shopping":
        return <ShoppingBag className={className} />
      case "apple":
        return <Apple className={className} />
      case "laptop":
        return <Laptop className={className} />
      case "building":
        return <Building2 className={className} />
      case "grad":
        return <GraduationCap className={className} />
      default:
        return <Shuffle className={className} />
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-blue-50 text-[11px] sm:text-xs font-bold text-blue-600 border border-blue-100">
            ★
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">常用场景一键直达</span>
          <span className="hidden md:inline text-xs text-slate-400">
            (针对海淘、账号注册、测试优选的真实参数组合)
          </span>
        </div>

        {/* 移动端视图切换开关（精简横向条 vs 完整展开） */}
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="sm:hidden inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60"
        >
          {mobileExpanded ? (
            <>
              收起精简 <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              展开卡片 <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {/* 移动端默认：超紧凑单行横向滑动胶囊条（高度仅 40px，省下 300px 首屏纵向空间） */}
      {!mobileExpanded && (
        <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isActive =
              currentState === preset.params.state &&
              (!preset.params.minAge || currentMinAge === preset.params.minAge)

            return (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.params)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium shrink-0 transition-all duration-150 border ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs font-semibold ring-1 ring-blue-600/30"
                    : "border-slate-200/90 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-slate-500"}>
                  {renderIcon(preset.iconName, "h-3.5 w-3.5")}
                </span>
                <span>{preset.shortLabel}</span>
                {preset.badge && (
                  <span className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
                    isActive ? "bg-blue-600 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {preset.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* 桌面端常驻 / 移动端展开模式：标准 6 列卡片网格 */}
      <div className={`${mobileExpanded ? "grid" : "hidden sm:grid"} grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6`}>
        {PRESET_SCENARIOS.map((preset) => {
          const isActive =
            currentState === preset.params.state &&
            (!preset.params.minAge || currentMinAge === preset.params.minAge)

          return (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.params)}
              className={`group relative flex flex-col justify-between rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-150 ${
                isActive
                  ? "border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20"
                  : "border-slate-200/90 bg-white hover:border-blue-200 hover:bg-slate-50/60 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                    }`}
                  >
                    {renderIcon(preset.iconName, "h-3.5 w-3.5 sm:h-4 sm:w-4")}
                  </div>

                  {preset.badge && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      {preset.badge}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-blue-700 tracking-tight">
                  {preset.label}
                </div>
                <div className="mt-0.5 text-xs text-slate-400 line-clamp-1 leading-snug">
                  {preset.desc}
                </div>
              </div>

              {isActive && (
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  当前已生效
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
