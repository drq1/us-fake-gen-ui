"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Edit3, Eye, RefreshCw, Landmark, Download, FileText, ArrowLeft } from "lucide-react"
import type { PersonData } from "@/lib/types"
import { generateBankStatement, type BankStatementData } from "@/lib/bank-statement-generator"
import { BankStatementSheet } from "./bank-statement-sheet"

interface BankStatementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  seed?: number
  onBackToTemplates?: () => void
}

export function BankStatementModal({
  open,
  onOpenChange,
  person,
  seed = 2026,
  onBackToTemplates,
}: BankStatementModalProps) {
  const [statementData, setStatementData] = useState<BankStatementData | null>(null)
  const [isEditable, setIsEditable] = useState(false)
  const [watermark, setWatermark] = useState<"OFFICIAL" | "SAMPLE" | "NONE">("OFFICIAL")
  const [currentSeed, setCurrentSeed] = useState(seed)

  useEffect(() => {
    if (person) {
      setStatementData(generateBankStatement(person, currentSeed))
    }
  }, [person, currentSeed])

  const handlePrint = () => {
    window.print()
  }

  const handleRegenerate = () => {
    setCurrentSeed(Math.floor(Math.random() * 1000000))
  }

  const handleExportJson = () => {
    if (!statementData) return
    const blob = new Blob([JSON.stringify(statementData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Bank_Statement_${person.fullName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-5xl max-h-[95vh] overflow-y-auto p-3 sm:p-6 bg-slate-100 print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:max-h-none print:overflow-visible rounded-2xl">
        <DialogHeader className="print:hidden border-b border-slate-200 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                <Landmark className="h-5 w-5 text-red-600" />
                美国银行月度流水对账单 (Bank of America Statement)
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                权威真实的美国地址证明 (Proof of Address) 与资金流水，支持在线微调与矢量高保真 PDF 导出
              </p>
            </div>

            {/* 控制条操作工具栏 */}
            <div className="flex flex-wrap items-center gap-2">
              {onBackToTemplates && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBackToTemplates}
                  className="h-8 text-xs font-bold bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 shadow-2xs"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  返回参考模板库
                </Button>
              )}

              <Button
                variant={isEditable ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditable(!isEditable)}
                className={`h-8 text-xs font-semibold ${
                  isEditable ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-white"
                }`}
              >
                {isEditable ? (
                  <>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    完成编辑
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                    在线微调
                  </>
                )}
              </Button>

              <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                {[
                  { id: "OFFICIAL", label: "OFFICIAL" },
                  { id: "SAMPLE", label: "SAMPLE" },
                  { id: "NONE", label: "无水印" },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWatermark(w.id as typeof watermark)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      watermark === w.id ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 text-xs font-semibold bg-white"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                换一批流水
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                打印 / 另存为 PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 账单主体预览区域 */}
        <div className="my-3 overflow-x-auto print:my-0 print:overflow-visible">
          {statementData && (
            <BankStatementSheet
              data={statementData}
              isEditable={isEditable}
              watermark={watermark}
              onUpdate={setStatementData}
            />
          )}
        </div>

        {/* 底部引导栏 */}
        <div className="print:hidden border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            💡 提示：用于海外金融平台、加密货币或跨国电商验证时，打印「另存为 PDF」并选择 <b>Letter</b> 纸张即可。
          </span>
          <div className="flex items-center gap-2">
            {onBackToTemplates && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToTemplates}
                className="h-7 text-xs border-slate-300 text-blue-700 bg-blue-50/50 hover:bg-blue-100/80 font-medium"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                返回参考模板库
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleExportJson} className="h-7 text-xs text-slate-600">
              <Download className="mr-1 h-3 w-3" />
              下载本单 JSON
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BankStatementModal
