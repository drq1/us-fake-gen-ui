"use client"

import { useState } from "react"
import { Copy, Check, MapPin, CreditCard, ExternalLink, Sparkles, FileText, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PersonData } from "@/lib/types"
import { STATE_TAX_RATES, TAX_FREE_STATE_CODES, US_STATES } from "@/lib/constants"
import { CreditCardWidget } from "@/components/credit-card-widget"

interface AddressInfoCardProps {
  data: PersonData
  visibleFields: string[]
}

export function AddressInfoCard({ data, visibleFields }: AddressInfoCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showHelper, setShowHelper] = useState(false)

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

  // 复制符合美国邮政标准 USPS 地址块（海淘、电商结算标准格式）
  const handleCopyUspsBlock = async () => {
    const uspsBlock = `${data.fullName}
${data.street}
${data.city}, ${data.state} ${data.zipCode}
United States
Tel: ${data.phone}`

    await handleCopy(uspsBlock, "USPS 标准英文地址块", "uspsBlock")
  }

  // 一键复制信用卡核心三要素
  const handleCopyCardDetails = async () => {
    const cardDetails = `${data.cardNumber} ${data.expiry} ${data.cvv}`
    await handleCopy(cardDetails, "信用卡三要素", "cardDetails")
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    data.fullAddress,
  )}`

  const isTaxFree = TAX_FREE_STATE_CODES.includes(data.state)
  const taxInfo = STATE_TAX_RATES[data.state]
  const stateObj = US_STATES.find((s) => s.code === data.state)
  const stateFormatted = stateObj
    ? `${stateObj.nameCn} · ${data.stateFullName} (${data.state})`
    : `${data.stateFullName} (${data.state})`

  const renderRow = (
    key: string,
    labelEn: string,
    labelCn: string,
    value: string | number | undefined | null,
  ) => {
    if (!value) return null
    if (!visibleFields.includes(key)) return null
    const strVal = String(value)

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
          {strVal}
        </div>

        <button
          onClick={() => handleCopy(strVal, labelCn, key)}
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
      {/* 模块 1：美国真实物理地址 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                美国真实物理地址
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">USPS Verified Address</p>
            </div>
          </div>

          <div className="shrink-0">
            {isTaxFree ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <Sparkles className="h-3 w-3" />
                0% 免消费税
              </span>
            ) : taxInfo ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium text-slate-600">
                消费税 ~{taxInfo.rate}
              </span>
            ) : null}
          </div>
        </div>

        {/* 完整地址横幅（分栏优化：操作按钮在顶部，地址独占整行防窄带折行） */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2 border-b border-blue-100/60 pb-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              完整英文地址 (USPS 标准)
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(data.fullAddress, "完整地址", "fullAddr")}
                className="inline-flex h-7 sm:h-8 items-center gap-1 rounded-lg bg-white px-2.5 sm:px-3 text-xs font-medium text-blue-700 shadow-xs border border-blue-200/80 hover:bg-blue-50 transition-colors"
              >
                {copiedKey === "fullAddr" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                复制
              </button>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 sm:h-8 items-center gap-1 rounded-lg bg-white px-2.5 sm:px-3 text-xs font-medium text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
                title="在 Google Maps 中验证卫星与街景"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                地图
              </a>
            </div>
          </div>

          <div className="font-mono text-sm sm:text-base font-bold text-slate-900 leading-relaxed select-all">
            {data.fullAddress}
          </div>
        </div>

        {/* 实用快捷操作栏：USPS 地址块一键复制与表单对照助手 */}
        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50/90 p-2.5 text-xs sm:text-[13px]">
          <button
            onClick={handleCopyUspsBlock}
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {copiedKey === "uspsBlock" ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            复制 USPS 格式地址块
          </button>

          <button
            onClick={() => setShowHelper(!showHelper)}
            className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-800 transition-colors self-start sm:self-auto"
          >
            <FileText className="h-4 w-4" />
            {showHelper ? "收起填写对照表" : "海外网站填写对照 (Amazon/Apple)"}
          </button>
        </div>

        {/* 表单填写对照展开面板（单行结构化排版，杜绝单词截断与孤立折行） */}
        {showHelper && (
          <div className="mt-2.5 rounded-xl border border-slate-200/80 bg-slate-50/95 p-3.5 text-xs text-slate-700 space-y-2 animate-in fade-in-50 duration-150">
            <div className="font-bold text-slate-800 text-xs sm:text-[13px] border-b border-slate-200/60 pb-1.5">
              海外网站 (Amazon / Apple / Stripe) 表单填写指引:
            </div>
            <div className="divide-y divide-slate-200/50 font-mono text-xs">
              <div className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-slate-500 shrink-0">Address Line 1 (街道地址)</span>
                <span className="font-bold text-slate-900 text-right break-all">{data.street}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-slate-500 shrink-0">Address Line 2 (公寓/门牌)</span>
                <span className="text-slate-400 text-right">留空 (Optional)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-slate-500 shrink-0">City (城市)</span>
                <span className="font-bold text-slate-900 text-right">{data.city}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-slate-500 shrink-0">State (州 / 缩写)</span>
                <span className="font-bold text-slate-900 text-right">{data.state} ({data.stateFullName})</span>
              </div>
              <div className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-slate-500 shrink-0">ZIP Code (邮政编码)</span>
                <span className="font-bold text-slate-900 text-right">{data.zipCode}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-slate-500 shrink-0">Country (国家)</span>
                <span className="font-bold text-slate-900 text-right">United States (US)</span>
              </div>
            </div>
          </div>
        )}

        {/* 地址细分字段 */}
        <div className="mt-2 divide-y divide-slate-100">
          {renderRow("street", "Street Address", "街道地址", data.street)}
          {renderRow("city", "City", "城市", data.city)}
          {renderRow("state", "State / Province", "州 / 缩写", stateFormatted)}
          {renderRow("zipCode", "Postal Code", "邮政编码", data.zipCode)}
          {renderRow("phone", "Phone Number", "电话号码", data.phone)}
          {renderRow("country", "Country", "国家", data.country)}
        </div>
      </div>

      {/* 模块 2：个人身份与特征 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100/80">
            <User className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight">
              个人身份与特征
            </h3>
            <p className="text-xs text-slate-400 font-mono">Personal & Physical Profile</p>
          </div>
        </div>

        <div className="mt-2 divide-y divide-slate-100">
          {renderRow("fullName", "Full Name", "全名", data.fullName)}
          {renderRow("firstName", "First Name", "名", data.firstName)}
          {renderRow("lastName", "Last Name", "姓", data.lastName)}
          {renderRow(
            "gender",
            "Gender",
            "性别",
            data.gender === "Male" ? "男 (Male)" : "女 (Female)",
          )}
          {renderRow("title", "Title", "称谓", data.title)}
          {renderRow("birthday", "Date of Birth", "出生日期", data.birthday)}

          {/* 生理特征紧凑展示区 */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 py-3 px-3.5 bg-slate-50/80 rounded-xl mt-2.5 border border-slate-100">
            <div>
              <div className="text-xs text-slate-400 font-medium">身高 (Height)</div>
              <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">{data.height}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">体重 (Weight)</div>
              <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">{data.weight}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">血型 (Blood)</div>
              <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">{data.bloodType}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">发色 (Hair)</div>
              <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">{data.hairColor}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 模块 3：信用卡与财务数据 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                信用卡与财务数据
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">Luhn Algorithm Validated</p>
            </div>
          </div>
          <button
            onClick={handleCopyCardDetails}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shrink-0"
            title="一键复制 卡号 + 有效期 + CVV"
          >
            {copiedKey === "cardDetails" ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            复制卡号三要素
          </button>
        </div>

        {/* 仿真信用卡展示组件 */}
        <div className="mt-4 mb-2">
          <CreditCardWidget data={data} />
        </div>

        <div className="mt-2 divide-y divide-slate-100">
          {renderRow("cardNumber", "Card Number", "信用卡卡号", data.cardNumber)}
          {renderRow("cardType", "Card Network", "发卡组织", data.cardType)}
          {renderRow("expiry", "Expiration Date", "有效期 (MM/YY)", data.expiry)}
          {renderRow("cvv", "Security Code", "安全码 (CVV)", data.cvv)}
          {renderRow("ssn", "SSN", "社会安全号", data.ssn)}
        </div>
      </div>
    </div>
  )
}
