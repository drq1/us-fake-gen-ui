"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Calendar, DollarSign, Download, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import type { PersonData, UniversityData } from "@/lib/types"
import { generateStudentSchedule, type StudentScheduleData } from "@/lib/schedule-generator"

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  university?: UniversityData | null
  seed?: number
  defaultTab?: "schedule" | "tuition"
  onBackToTemplates?: () => void
}

export function ScheduleModal({
  open,
  onOpenChange,
  person,
  university,
  seed = 2026,
  defaultTab = "schedule",
  onBackToTemplates,
}: ScheduleModalProps) {
  const [activeTab, setActiveTab] = useState<"schedule" | "tuition">(defaultTab)
  const [currentSeed, setCurrentSeed] = useState(seed)
  const [scheduleData, setScheduleData] = useState<StudentScheduleData | null>(null)

  useEffect(() => {
    if (defaultTab && open) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, open])

  useEffect(() => {
    if (person) {
      setScheduleData(generateStudentSchedule(person, university || null, currentSeed))
    }
  }, [person, university, currentSeed])

  const handlePrint = () => {
    window.print()
  }

  const handleRegenerate = () => {
    setCurrentSeed(Math.floor(Math.random() * 1000000))
  }

  const handleExportJson = () => {
    if (!scheduleData) return
    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeTab === "schedule" ? "Course_Schedule" : "Tuition_Statement"}_${person.fullName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-4xl h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto print:max-h-none print:overflow-visible">
        {/* 固定顶部操作栏 (独立置顶，绝不跟随滚动) */}
        <DialogHeader className="print:hidden border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 shrink-0 z-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                {activeTab === "schedule" ? (
                  <>
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    大学在读选课安排表 (Official Course Schedule)
                  </>
                ) : (
                  <>
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    学生学费账户清缴明细 (Tuition Account Statement)
                  </>
                )}
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                官方 Registrar / Student Financial Services 格式，证明在读注册状态与学费结清记录
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

              {/* Tab 切换 */}
              <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    activeTab === "schedule" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  选课课表
                </button>
                <button
                  onClick={() => setActiveTab("tuition")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    activeTab === "tuition" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  学费账单
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 text-xs font-semibold bg-white"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                换一批课程
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                打印 / 另存为 PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 凭单主纸张独立滚动区域 (1:1 还原 MIT 官方原样) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 print:p-0 print:overflow-visible">
          {scheduleData && (
            <div className="mx-auto w-full max-w-[560px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden font-sans text-slate-800 print:shadow-none print:border-none print:m-0">
              {/* Tab 1: 1:1 还原 MIT 真实选课安排表原件 */}
              {activeTab === "schedule" && (
                <div>
                  {/* MIT 经典深酒红官方题头 */}
                  <div className="bg-[#8b152b] text-white py-4 px-6 text-center">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                      Massachusetts Institute of Technology
                    </h1>
                    <p className="text-xs text-rose-100 font-medium mt-0.5">
                      Student Course Schedule
                    </p>
                  </div>

                  {/* 次级题头条 */}
                  <div className="bg-slate-50 border-b border-slate-200 py-2.5 text-center">
                    <h2 className="text-xs sm:text-sm font-black tracking-widest text-slate-800 uppercase">
                      COURSE SCHEDULE - {scheduleData.term.toUpperCase()}
                    </h2>
                  </div>

                  <div className="p-5 sm:p-7">
                    {/* 学生基本信息 */}
                    <div className="space-y-1.5 text-xs sm:text-[13px] border-b border-dotted border-slate-300 pb-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Student:</span>
                        <span className="font-medium text-slate-900">{scheduleData.studentName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">ID:</span>
                        <span className="font-mono font-medium text-slate-900">{scheduleData.studentId.replace(/\D/g, "") || "202675507"}</span>
                      </div>
                    </div>

                    {/* 课程清单表格 (1:1 对齐真实样本) */}
                    <table className="w-full text-left text-xs sm:text-[12.5px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-700 font-bold">
                          <th className="pb-2">Course</th>
                          <th className="pb-2">Description</th>
                          <th className="pb-2 text-center">Cr</th>
                          <th className="pb-2">Days</th>
                          <th className="pb-2">Time</th>
                          <th className="pb-2 text-right">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium">CMST 1101</td>
                          <td className="py-2.5">Business Statistics</td>
                          <td className="py-2.5 text-center font-bold">3</td>
                          <td className="py-2.5">Mon, Wed</td>
                          <td className="py-2.5">10:00 AM</td>
                          <td className="py-2.5 text-right font-mono text-slate-600">DPRH 210</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium">BLAW 2201</td>
                          <td className="py-2.5">Legal Environment</td>
                          <td className="py-2.5 text-center font-bold">3</td>
                          <td className="py-2.5">Tue, Thu</td>
                          <td className="py-2.5">10:05 AM</td>
                          <td className="py-2.5 text-right font-mono text-slate-600">DPRH 238</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium">MRKT 2101</td>
                          <td className="py-2.5">Professional Selling</td>
                          <td className="py-2.5 text-center font-bold">4</td>
                          <td className="py-2.5">Mon, Wed, Fri</td>
                          <td className="py-2.5">10:05 AM</td>
                          <td className="py-2.5 text-right font-mono text-slate-600">Williams</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium">FINC 3310</td>
                          <td className="py-2.5">Principles of Finance</td>
                          <td className="py-2.5 text-center font-bold">4</td>
                          <td className="py-2.5">Mon, Wed</td>
                          <td className="py-2.5">10:05 AM</td>
                          <td className="py-2.5 text-right font-mono text-slate-600">Online</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* 底部学分合计 */}
                    <div className="mt-6 pt-3 border-t border-slate-200 text-right">
                      <span className="text-xs sm:text-[13px] font-bold text-slate-900">
                        Total Registered Credits: 14
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: 1:1 还原 MIT 真实学费账户对账单原件 */}
              {activeTab === "tuition" && (
                <div>
                  {/* MIT 经典深酒红官方题头 */}
                  <div className="bg-[#8b152b] text-white py-4 px-6 text-center">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                      Massachusetts Institute of Technology
                    </h1>
                    <p className="text-xs text-rose-100 font-medium mt-0.5">
                      Student Business Services
                    </p>
                  </div>

                  {/* 次级题头条 */}
                  <div className="bg-slate-50 border-b border-slate-200 py-2.5 text-center">
                    <h2 className="text-xs sm:text-sm font-black tracking-widest text-slate-800 uppercase">
                      ACCOUNT STATEMENT
                    </h2>
                  </div>

                  <div className="p-5 sm:p-7">
                    {/* 学生基本信息 */}
                    <div className="space-y-1.5 text-xs sm:text-[13px] border-b border-dotted border-slate-300 pb-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">To:</span>
                        <span className="font-medium text-slate-900">{scheduleData.studentName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Student ID:</span>
                        <span className="font-mono font-medium text-slate-900">{scheduleData.studentId.replace(/\D/g, "") || "202675507"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Term:</span>
                        <span className="font-medium text-slate-900">{scheduleData.term}</span>
                      </div>
                    </div>

                    {/* 学费扣缴清单表格 (1:1 对齐真实样本) */}
                    <table className="w-full text-left text-xs sm:text-[12.5px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-700 font-bold">
                          <th className="pb-2">Description</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="py-2 font-medium">Tuition - Undergraduate (14 Credits)</td>
                          <td className="py-2 text-right font-mono">$5,480.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">University Tuition</td>
                          <td className="py-2 text-right font-mono">$1,710.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Computer Service Fee</td>
                          <td className="py-2 text-right font-mono">$210.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Library Fee</td>
                          <td className="py-2 text-right font-mono">$125.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Health Insurance</td>
                          <td className="py-2 text-right font-mono">$1,850.00</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold border-t border-b border-slate-200 text-slate-900">
                          <td className="py-2.5 px-2">TOTAL CHARGES</td>
                          <td className="py-2.5 px-2 text-right font-mono">$9,375.00</td>
                        </tr>
                        <tr className="text-slate-600">
                          <td className="py-2">Payments/Credits</td>
                          <td className="py-2 text-right font-mono">-$9,375.00</td>
                        </tr>
                        <tr className="font-bold border-t border-slate-200 text-emerald-600 text-sm">
                          <td className="py-2.5">BALANCE DUE</td>
                          <td className="py-2.5 text-right font-mono">$0.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部工具栏 (固定在底部，绝不跟随滚动) */}
        <div className="print:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>💡 提示：此选课单可作为学生身份、在读证明与学籍保留证明直接打印使用。</span>
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

export default ScheduleModal
