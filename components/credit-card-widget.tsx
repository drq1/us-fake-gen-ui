"use client"

import { useState } from "react"
import { Copy, Check, Eye, EyeOff, CreditCard as CardIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { PersonData } from "@/lib/types"

interface CreditCardWidgetProps {
  data: PersonData
}

export function CreditCardWidget({ data }: CreditCardWidgetProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showFullNumber, setShowFullNumber] = useState(false)

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

  const rawNumber = data.cardNumber.replace(/\s+/g, "")
  const maskedNumber = showFullNumber
    ? data.cardNumber
    : `${data.cardNumber.slice(0, 4)} **** **** ${data.cardNumber.slice(-4)}`

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 text-white shadow-xl shadow-indigo-950/20">
      {/* 卡片背景装饰光斑 */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      {/* 卡片顶部：芯片与卡种 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* 仿真金色芯片 */}
          <div className="relative h-8 w-11 sm:h-9 sm:w-12 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-sm">
            <div className="absolute inset-x-1.5 top-2.5 h-px bg-amber-700/40" />
            <div className="absolute inset-x-1.5 bottom-2.5 h-px bg-amber-700/40" />
            <div className="absolute inset-y-1 left-3.5 sm:left-4 w-px bg-amber-700/40" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-widest text-slate-400">
            DEBIT / CREDIT
          </span>
        </div>

        <span className="rounded-md bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
          {data.cardType}
        </span>
      </div>

      {/* 卡号 */}
      <div className="mt-5 sm:mt-7">
        <div className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-400">
          Card Number
        </div>
        <div className="mt-1 flex items-center justify-between gap-1">
          <span className="font-mono text-base sm:text-lg lg:text-xl font-bold tracking-wider sm:tracking-widest text-white truncate">
            {maskedNumber}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFullNumber(!showFullNumber)}
              className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              title={showFullNumber ? "隐藏卡号" : "查看完整卡号"}
            >
              {showFullNumber ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => handleCopy(rawNumber, "信用卡号", "cardNum")}
              className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              title="复制卡号"
            >
              {copiedKey === "cardNum" ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 持卡人、到期日与 CVV */}
      <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
        <div>
          <div className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
            Cardholder Name
          </div>
          <div className="mt-0.5 font-mono text-xs font-semibold uppercase text-slate-200">
            {data.fullName}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div
            onClick={() => handleCopy(data.expiry, "到期日", "expiry")}
            className="group cursor-pointer text-center"
          >
            <div className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
              Expires
            </div>
            <div className="mt-0.5 flex items-center gap-1 font-mono text-xs font-semibold text-slate-200 group-hover:text-amber-300">
              {data.expiry}
              {copiedKey === "expiry" ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
              )}
            </div>
          </div>

          <div
            onClick={() => handleCopy(data.cvv.toString(), "CVV 安全码", "cvv")}
            className="group cursor-pointer text-right"
          >
            <div className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
              CVV / CVC
            </div>
            <div className="mt-0.5 flex items-center justify-end gap-1 font-mono text-xs font-semibold text-amber-300">
              {data.cvv}
              {copiedKey === "cvv" ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
