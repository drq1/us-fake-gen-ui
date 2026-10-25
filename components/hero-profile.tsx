"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Mail,
  Shield,
  Calendar,
  Sparkles,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PersonData } from "@/lib/types"

interface HeroProfileProps {
  data: PersonData
  onCopyAll: () => void
}

export function HeroProfile({ data, onCopyAll }: HeroProfileProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = async (text: string, label: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
      toast({
        title: "复制成功",
        description: `已复制 ${label}: ${text}`,
      })
    } catch {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    data.fullAddress,
  )}`

  const isFemale = data.gender.toLowerCase() === "female"
  const initials = `${data.firstName[0] || ""}${data.lastName[0] || ""}`

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-md md:p-8">
      {/* 顶部微渐变装饰 */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* 左侧：头像与姓名 */}
        <div className="flex items-start gap-5">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold shadow-inner ${
              isFemale
                ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-pink-600/30"
                : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-600/30"
            }`}
          >
            {initials}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
                {data.fullName}
              </h2>
              <Badge
                variant="secondary"
                className={`text-xs font-semibold ${
                  isFemale
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {data.title} · {data.gender === "Male" ? "男" : "女"}
              </Badge>
              <Badge variant="outline" className="border-gray-200 text-xs text-gray-600">
                @{data.username}
              </Badge>
            </div>

            <p className="text-sm font-medium text-gray-600">
              {data.occupation} <span className="text-gray-300">|</span>{" "}
              <span className="text-gray-900 font-semibold">{data.company}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                {data.birthday}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Shield className="h-3.5 w-3.5 text-gray-400" />
                SSN: {data.ssn}
              </span>
            </div>
          </div>
        </div>

        {/* 右侧：快速操作 */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(data.fullName, "全名", "name")}
            className="rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {copiedKey === "name" ? (
              <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
            )}
            复制姓名
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(data.fullAddress, "完整地址", "address")}
            className="rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {copiedKey === "address" ? (
              <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
            )}
            复制地址
          </Button>

          <Button
            size="sm"
            onClick={onCopyAll}
            className="rounded-lg bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            一键复制全套资料
          </Button>
        </div>
      </div>

      {/* 真实物理地址高亮条 */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  100% 真实美国物理地址
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  真实可查
                </span>
              </div>
              <p className="mt-0.5 font-semibold text-gray-900 sm:text-base">
                {data.fullAddress}
              </p>
              <p className="text-xs text-gray-500">
                街道: {data.street} · 城市: {data.city} · 州: {data.stateFullName} ({data.state}) · 邮编: {data.zipCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              在 Google 地图中查看
            </a>
          </div>
        </div>
      </div>

      {/* 底部常用联系信息快速栏 */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={() => handleCopy(data.phone, "电话", "phone")}
          className="group flex cursor-pointer items-center justify-between rounded-xl bg-gray-50/80 px-4 py-2.5 transition hover:bg-blue-50/60"
        >
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            <span className="text-xs text-gray-500">电话:</span>
            <span className="font-mono text-sm font-semibold text-gray-800">
              {data.phone}
            </span>
          </div>
          {copiedKey === "phone" ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-gray-400 opacity-0 transition group-hover:opacity-100" />
          )}
        </div>

        <div
          onClick={() => handleCopy(data.email, "邮箱", "email")}
          className="group flex cursor-pointer items-center justify-between rounded-xl bg-gray-50/80 px-4 py-2.5 transition hover:bg-blue-50/60"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Mail className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-blue-600" />
            <span className="shrink-0 text-xs text-gray-500">邮箱:</span>
            <span className="truncate font-mono text-sm font-semibold text-gray-800">
              {data.email}
            </span>
          </div>
          {copiedKey === "email" ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition group-hover:opacity-100" />
          )}
        </div>

        <div
          onClick={() => handleCopy(data.ssn, "SSN", "ssn")}
          className="group flex cursor-pointer items-center justify-between rounded-xl bg-gray-50/80 px-4 py-2.5 transition hover:bg-blue-50/60 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            <span className="text-xs text-gray-500">社会安全号:</span>
            <span className="font-mono text-sm font-semibold text-gray-800">
              {data.ssn}
            </span>
          </div>
          {copiedKey === "ssn" ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-gray-400 opacity-0 transition group-hover:opacity-100" />
          )}
        </div>
      </div>
    </div>
  )
}
