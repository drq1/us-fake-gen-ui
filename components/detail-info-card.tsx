"use client"

import { useState } from "react"
import {
  Copy,
  Check,
  Briefcase,
  Key,
  GraduationCap,
  Monitor,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PersonData, SchoolData, UniversityData } from "@/lib/types"
import { UNIVERSITY_TYPE_MAP } from "@/lib/constants"
import { formatAddressTitle } from "@/lib/real-addresses"

interface DetailInfoCardProps {
  data: PersonData
  schoolData: SchoolData | null
  universityData: UniversityData | null
  visibleFields: string[]
}

export function DetailInfoCard({
  data,
  schoolData,
  universityData,
  visibleFields,
}: DetailInfoCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [techExpanded, setTechExpanded] = useState(false)

  const handleCopy = async (text: string, label: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
      toast({
        title: "已复制到剪贴板",
        description: `${label}: ${text}`,
      })
    } catch {
      toast({
        title: "复制失败",
        description: "浏览器无法访问剪贴板",
        variant: "destructive",
      })
    }
  }

  const renderRow = (
    key: string,
    labelEn: string,
    labelCn: string,
    value: string | undefined | null,
  ) => {
    if (!value) return null
    if (visibleFields && visibleFields.length > 0 && !visibleFields.includes(key)) return null

    return (
      <div
        key={key}
        className="group flex items-start sm:items-center justify-between py-2.5 px-2.5 sm:px-3 rounded-lg hover:bg-slate-50/80 transition-colors duration-150 gap-2"
      >
        <div className="w-1/3 min-w-[95px] sm:min-w-[120px] shrink-0 pr-1">
          <div className="text-xs sm:text-[13px] font-medium text-slate-600">{labelCn}</div>
          <div className="text-xs text-slate-400 font-mono tracking-tight">{labelEn}</div>
        </div>

        <div className="flex-1 overflow-hidden font-mono text-xs sm:text-sm font-semibold text-slate-900 break-words select-all">
          {value}
        </div>

        <button
          onClick={() => handleCopy(value, labelCn, key)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all duration-150"
          title={`复制 ${labelCn}`}
        >
          {copiedKey === key ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* 模块 1：工作职业与收入 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                工作职业与就职公司
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">Employment & Career</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shrink-0">
            {data.salary} / 年
          </span>
        </div>

        <div className="mt-2 divide-y divide-slate-100">
          {renderRow("occupation", "Occupation", "职业职位", data.occupation)}
          {renderRow("company", "Company", "受雇公司", data.company)}
          {renderRow("salary", "Annual Salary", "薪水收入", data.salary)}
          {renderRow("companySize", "Company Size", "公司规模", `${data.companySize} 人`)}
          {renderRow("industry", "Industry", "所属行业", data.industry)}
          {renderRow("status", "Employment Status", "工作状态", data.status)}
        </div>
      </div>

      {/* 模块 2：登录账号与安全 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/80">
            <Key className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
              登录账号与密保安全
            </h3>
            <p className="text-xs text-slate-400 font-mono">Account Credentials & Security</p>
          </div>
        </div>

        <div className="mt-2 divide-y divide-slate-100">
          {renderRow("username", "Username", "用户名", data.username)}
          {renderRow("email", "Email Address", "电子邮箱", data.email)}

          <div className="group flex items-center justify-between py-2.5 px-2.5 sm:px-3 rounded-lg hover:bg-slate-50/80 transition-colors duration-150 gap-2">
            <div className="w-1/3 min-w-[95px] sm:min-w-[120px] shrink-0 pr-1">
              <div className="text-xs sm:text-[13px] font-medium text-slate-600">登录密码</div>
              <div className="text-xs text-slate-400 font-mono tracking-tight">Password</div>
            </div>
            <div className="flex-1 overflow-hidden font-mono text-xs sm:text-sm font-semibold text-slate-900 select-all">
              {showPassword ? data.password : "••••••••••••"}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all duration-150"
                title={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => handleCopy(data.password, "密码", "password")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all duration-150"
                title="复制密码"
              >
                {copiedKey === "password" ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {renderRow("securityQuestion", "Security Question", "安全问题", data.securityQuestion)}
          {renderRow("securityAnswer", "Security Answer", "安全答案", data.securityAnswer)}
        </div>
      </div>

      {/* 模块 3：真实教育背景 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
              真实教育学历背景
            </h3>
            <p className="text-xs text-slate-400 font-mono">IPEDS Higher Ed & NCES Schools</p>
          </div>
        </div>

        <div className="mt-2 divide-y divide-slate-100">
          {renderRow("education", "Education Degree", "最高学历", data.education)}

          {universityData && (
            <div className="py-3 px-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-semibold text-slate-700 truncate">就读大学 (IPEDS 官方认证)</span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200 shrink-0">
                  {UNIVERSITY_TYPE_MAP[universityData.type] || universityData.type}
                </span>
              </div>
              <div className="mt-1.5 font-mono text-sm sm:text-[15px] font-bold text-slate-900">
                {universityData.name}
              </div>
              <div className="mt-0.5 text-xs sm:text-[13px] text-slate-600">
                校址: {universityData.address}, {universityData.city}, {universityData.state}{" "}
                {universityData.zip}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span>电话: {universityData.telephone}</span>
                <span>IPEDS 编号: {universityData.ipedsid}</span>
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
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  访问大学官网 ({universityData.website})
                </a>
              )}
            </div>
          )}

          {schoolData && (
            <div className="py-3 px-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-semibold text-slate-700 truncate">
                  就读中学 (NCES 认证公立学校)
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                  {schoolData.st_grade}-{schoolData.end_grade} 年级
                </span>
              </div>
              <div className="mt-1.5 font-mono text-sm sm:text-[15px] font-bold text-slate-900">
                {formatAddressTitle(schoolData.name)}
              </div>
              <div className="mt-0.5 text-xs sm:text-[13px] text-slate-600">
                校址: {formatAddressTitle(schoolData.address)},{" "}
                {formatAddressTitle(schoolData.city)}, {schoolData.state} {schoolData.zip}
              </div>
              {schoolData.telephone && (
                <div className="mt-1 text-xs text-slate-400 font-mono">
                  电话: {schoolData.telephone} · NCES 编号: {schoolData.ncesid}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 模块 4：互联网与技术标识 (可折叠) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80">
              <Monitor className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                技术环境与设备指纹
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">Device Fingerprint & User-Agent</p>
            </div>
          </div>

          <button
            onClick={() => setTechExpanded(!techExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors shrink-0"
          >
            {techExpanded ? (
              <>
                收起 <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                展开 <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {techExpanded ? (
          <div className="mt-2 divide-y divide-slate-100 animate-in fade-in-50 duration-150">
            {renderRow("os", "Operating System", "操作系统", data.os)}
            {renderRow("guid", "Device GUID", "设备唯一标识", data.guid)}
            {renderRow("website", "Personal Site", "个人主页", data.website)}
            <div className="py-2.5 px-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-[13px] font-medium text-slate-600">User Agent 报文</span>
                <button
                  onClick={() => handleCopy(data.userAgent, "User Agent", "ua")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  复制完整 UA
                </button>
              </div>
              <p className="mt-2 font-mono text-xs text-slate-600 break-all bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 leading-relaxed select-all">
                {data.userAgent}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between text-xs sm:text-[13px] text-slate-500 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <span>
              OS: <strong className="text-slate-800 font-mono font-semibold">{data.os}</strong> · 设备指纹已就绪
            </span>
            <button
              onClick={() => handleCopy(data.userAgent, "User Agent", "ua")}
              className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors shrink-0 ml-2"
            >
              复制 UA
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
