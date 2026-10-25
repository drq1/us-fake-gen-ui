"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Check,
  Briefcase,
  Key,
  GraduationCap,
  Monitor,
  HeartPulse,
  Globe,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PersonData, SchoolData, UniversityData } from "@/lib/types"
import { UNIVERSITY_TYPE_MAP } from "@/lib/constants"
import { CreditCardWidget } from "./credit-card-widget"

interface CategoryBentoGridProps {
  data: PersonData
  schoolData: SchoolData | null
  universityData: UniversityData | null
  visibleFields: string[]
}

export function CategoryBentoGrid({
  data,
  schoolData,
  universityData,
  visibleFields,
}: CategoryBentoGridProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleCopy = async (text: string, label: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
      toast({
        title: "复制成功",
        description: `已复制 ${label}`,
      })
    } catch {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  const renderFieldRow = (key: string, label: string, value: string | undefined | null) => {
    if (!value || !visibleFields.includes(key)) return null

    return (
      <div
        key={key}
        className="group flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2.5 transition hover:bg-blue-50/50"
      >
        <div className="flex-1 overflow-hidden pr-2">
          <div className="text-xs font-medium text-gray-500">{label}</div>
          <div className="truncate text-sm font-semibold text-gray-800">
            {value}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopy(value, label, key)}
          className="h-8 w-8 shrink-0 p-0 text-gray-400 opacity-60 transition hover:bg-white hover:text-blue-600 group-hover:opacity-100"
        >
          {copiedKey === key ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. 财务与信用卡卡片 (专用视觉卡片) */}
      <div className="space-y-4">
        <CreditCardWidget data={data} />
      </div>

      {/* 2. 职业与收入看板 */}
      <Card className="rounded-2xl border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Briefcase className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold text-gray-900">
                工作与财务
              </CardTitle>
            </div>
            <Badge className="bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700">
              年薪 {data.salary}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-1">
          {renderFieldRow("occupation", "职业职位", data.occupation)}
          {renderFieldRow("company", "就职公司", data.company)}
          {renderFieldRow("companySize", "公司规模", `${data.companySize} 人`)}
          {renderFieldRow("industry", "所属行业", data.industry)}
          {renderFieldRow("status", "工作状态", data.status)}
        </CardContent>
      </Card>

      {/* 3. 账户与安全密保 */}
      <Card className="rounded-2xl border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Key className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-gray-900">
              账户与安全设置
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-1">
          {renderFieldRow("username", "登录用户名", data.username)}

          {visibleFields.includes("password") && (
            <div className="group flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2.5 transition hover:bg-blue-50/50">
              <div className="flex-1 overflow-hidden pr-2">
                <div className="text-xs font-medium text-gray-500">密码</div>
                <div className="font-mono text-sm font-semibold text-gray-800">
                  {showPassword ? data.password : "••••••••••••"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8 p-0 text-gray-400 hover:bg-white hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(data.password, "密码", "password")}
                  className="h-8 w-8 p-0 text-gray-400 hover:bg-white hover:text-blue-600"
                >
                  {copiedKey === "password" ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {renderFieldRow("securityQuestion", "密保安全问题", data.securityQuestion)}
          {renderFieldRow("securityAnswer", "密保答案", data.securityAnswer)}
        </CardContent>
      </Card>

      {/* 4. 身体体貌特征 */}
      <Card className="rounded-2xl border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <HeartPulse className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-gray-900">
              身体与生理体貌
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-1">
          {renderFieldRow("height", "身高", data.height)}
          {renderFieldRow("weight", "体重", data.weight)}
          {renderFieldRow("bloodType", "血型", data.bloodType)}
          {renderFieldRow("hairColor", "发色", data.hairColor)}
        </CardContent>
      </Card>

      {/* 5. 教育与学校 */}
      <Card className="rounded-2xl border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-gray-900">
              教育与学校背景
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          {renderFieldRow("education", "最高学历", data.education)}

          {universityData && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-indigo-700">大学信息</span>
                <Badge variant="outline" className="border-indigo-200 bg-white text-[10px] text-indigo-700">
                  {UNIVERSITY_TYPE_MAP[universityData.type] || universityData.type}
                </Badge>
              </div>
              <div className="mt-1 font-semibold text-gray-900 text-sm">{universityData.name}</div>
              <div className="mt-0.5 text-xs text-gray-500">
                {universityData.city}, {universityData.state} {universityData.zip}
              </div>
              {universityData.website && universityData.website !== "NOT AVAILABLE" && (
                <a
                  href={
                    universityData.website.startsWith("http")
                      ? universityData.website
                      : `https://${universityData.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  官方学校网站
                </a>
              )}
            </div>
          )}

          {schoolData && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-blue-700">高中信息</span>
                <span className="text-[10px] text-blue-600">
                  {schoolData.st_grade}-{schoolData.end_grade} 年级
                </span>
              </div>
              <div className="mt-1 font-semibold text-gray-900 text-sm">{schoolData.name}</div>
              <div className="mt-0.5 text-xs text-gray-500">
                {schoolData.city}, {schoolData.state} {schoolData.zip}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. 技术环境与设备 */}
      <Card className="rounded-2xl border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Monitor className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-gray-900">
              设备与互联网环境
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-1">
          {renderFieldRow("os", "操作系统", data.os)}
          {renderFieldRow("guid", "GUID 唯一识别码", data.guid)}
          {renderFieldRow("website", "个人网站", data.website)}

          {visibleFields.includes("userAgent") && (
            <div className="group rounded-xl bg-gray-50/80 p-3 transition hover:bg-blue-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">User Agent</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(data.userAgent, "User Agent", "ua")}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                >
                  {copiedKey === "ua" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <p className="mt-1 break-all font-mono text-[11px] text-gray-600">
                {data.userAgent}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
