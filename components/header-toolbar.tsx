"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  Settings,
  Download,
  Sparkles,
  FilterX,
  MapPin,
  User,
  Hash,
} from "lucide-react"
import { US_STATES } from "@/lib/constants"

interface HeaderToolbarProps {
  seed: number
  state: string
  city: string
  gender: string
  minAge: number
  maxAge: number
  highState: string
  highCity: string
  universityState: string
  universityCity: string
  loading: boolean
  hasData: boolean
  onRegenerate: () => void
  onOpenConfig: () => void
  onOpenJsonExport: () => void
  onResetFilters: () => void
}

export function HeaderToolbar({
  seed,
  state,
  city,
  gender,
  minAge,
  maxAge,
  highState,
  highCity,
  universityState,
  universityCity,
  loading,
  hasData,
  onRegenerate,
  onOpenConfig,
  onOpenJsonExport,
  onResetFilters,
}: HeaderToolbarProps) {
  const currentYear = new Date().getFullYear()

  const getStateDisplayName = (stateCode: string) => {
    const s = US_STATES.find((item) => item.code === stateCode)
    return s ? `${s.name} (${s.code})` : stateCode
  }

  // 计算激活的过滤条件数量
  const activeFilterCount = [
    Boolean(state),
    Boolean(city),
    Boolean(gender),
    minAge > 0 && maxAge > 0,
    Boolean(highState),
    Boolean(highCity),
    Boolean(universityState),
    Boolean(universityCity),
  ].filter(Boolean).length

  return (
    <header className="space-y-6">
      {/* 顶部标题与主要操作按钮栏 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                US Fake Generator
              </h1>
              <p className="text-xs font-medium text-gray-500">
                100% 真实物理地址 · 结构合规个人全套身份模拟
              </p>
            </div>
          </div>
        </div>

        {/* 顶部右侧主要操作群 */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={onRegenerate}
            disabled={loading}
            className="h-10 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-95"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "正在生成..." : "重新生成"}
          </Button>

          <Button
            variant="outline"
            onClick={onOpenConfig}
            className="h-10 rounded-xl border-gray-200 bg-white/80 px-4 font-medium text-gray-700 shadow-sm backdrop-blur-sm hover:bg-gray-50"
          >
            <Settings className="mr-2 h-4 w-4 text-gray-500" />
            筛选参数
            {activeFilterCount > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onOpenJsonExport}
            disabled={!hasData}
            className="h-10 rounded-xl border-gray-200 bg-white/80 px-4 font-medium text-gray-700 shadow-sm backdrop-blur-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="mr-2 h-4 w-4 text-gray-500" />
            导出 JSON
          </Button>
        </div>
      </div>

      {/* 状态指示与过滤标签展示条 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white/70 p-3 shadow-sm backdrop-blur-sm">
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-gray-200 bg-gray-50/80 px-2.5 py-1 text-xs text-gray-600 font-mono"
        >
          <Hash className="h-3 w-3 text-gray-400" />
          Seed: {seed}
        </Badge>

        {state && (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
            <MapPin className="mr-1 h-3 w-3" />
            州: {getStateDisplayName(state)}
          </Badge>
        )}

        {city && (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
            城市: {city}
          </Badge>
        )}

        {gender && (
          <Badge className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100">
            <User className="mr-1 h-3 w-3" />
            性别: {gender === "Male" ? "男" : "女"}
          </Badge>
        )}

        {minAge > 0 && maxAge > 0 && (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
            年龄: {minAge}-{maxAge}岁 ({currentYear - maxAge}-{currentYear - minAge})
          </Badge>
        )}

        {highState && (
          <Badge variant="outline" className="text-xs text-gray-600">
            高中州: {getStateDisplayName(highState)}
          </Badge>
        )}

        {universityState && (
          <Badge variant="outline" className="text-xs text-gray-600">
            大学州: {getStateDisplayName(universityState)}
          </Badge>
        )}

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 transition"
          >
            <FilterX className="h-3.5 w-3.5" />
            清除筛选
          </button>
        )}
      </div>
    </header>
  )
}
