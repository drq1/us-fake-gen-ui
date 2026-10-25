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

        {/* 凭单主纸张独立滚动区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 print:p-0 print:overflow-visible">
          {scheduleData && (
            <div className="mx-auto w-full max-w-[800px] bg-white rounded-lg shadow-md border border-slate-200/80 p-6 sm:p-10 font-sans print:shadow-none print:border-none print:m-0 print:p-6 text-slate-800">
              {/* 顶栏官方题头 */}
              <div className="border-b-2 border-slate-800 pb-4 mb-5 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                    {scheduleData.universityName}
                  </h1>
                  <p className="text-xs font-bold text-slate-600 uppercase mt-0.5">
                    Office of the Registrar · Student Financial Services
                  </p>
                  <p className="text-[11px] text-slate-400">Official Enrollment & Account Verification Record</p>
                </div>

                <div className="text-right text-xs">
                  <span className="font-mono text-slate-500">Date Issued: </span>
                  <span className="font-bold text-slate-900">{scheduleData.statementDate}</span>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      STATUS: FULL-TIME ENROLLED
                    </span>
                  </div>
                </div>
              </div>

              {/* 学生基本信息条 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
                  <span className="font-bold text-slate-900">{scheduleData.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student ID</span>
                  <span className="font-mono font-bold text-slate-900">{scheduleData.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Academic Term</span>
                  <span className="font-bold text-slate-900">{scheduleData.term}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Major / Program</span>
                  <span className="font-medium text-slate-800 truncate block">{scheduleData.major}</span>
                </div>
              </div>

              {/* Tab 1: 选课时间表 */}
              {activeTab === "schedule" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold uppercase text-slate-800 tracking-wide">
                      Registered Course Schedule ({scheduleData.totalCredits} Enrolled Credits)
                    </h2>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Course Code</th>
                          <th className="py-2.5 px-3">Course Title</th>
                          <th className="py-2.5 px-2">Sec</th>
                          <th className="py-2.5 px-2 text-center">Units</th>
                          <th className="py-2.5 px-3">Days & Time</th>
                          <th className="py-2.5 px-3">Location</th>
                          <th className="py-2.5 px-3">Instructor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {scheduleData.courses.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/60 font-medium text-slate-700">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{c.courseCode}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{c.title}</td>
                            <td className="py-2.5 px-2 font-mono text-slate-500">{c.section}</td>
                            <td className="py-2.5 px-2 text-center font-bold text-slate-900">{c.credits}</td>
                            <td className="py-2.5 px-3">{c.schedule}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{c.room}</td>
                            <td className="py-2.5 px-3 text-slate-600">{c.instructor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: 学费账户账单 */}
              {activeTab === "tuition" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold uppercase text-slate-800 tracking-wide">
                      Tuition & Fee Activity ({scheduleData.term})
                    </h2>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg mb-4">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Trans Date</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3 text-right">Charges ($)</th>
                          <th className="py-2.5 px-3 text-right">Payments / Credits ($)</th>
                          <th className="py-2.5 px-3 text-right">Balance ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-xs">
                        {scheduleData.tuitionItems.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 text-slate-500">{item.date}</td>
                            <td className="py-2.5 px-3 font-sans font-medium text-slate-800">{item.description}</td>
                            <td className="py-2.5 px-3 text-right text-slate-800">
                              {item.charges > 0 ? item.charges.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "-"}
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">
                              {item.payments > 0 ? item.payments.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "-"}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                              {item.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
                        <tr>
                          <td colSpan={2} className="py-2.5 px-3 font-sans text-right">Term Account Totals:</td>
                          <td className="py-2.5 px-3 text-right font-mono">${scheduleData.totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700">${scheduleData.totalPayments.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-blue-900">${scheduleData.currentBalance.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* 结清印戳 */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold text-emerald-900">ACCOUNT STATUS: PAID IN FULL</div>
                        <div className="text-[11px] text-emerald-700">No holds or outstanding dues on student record. Eligible for course registration & transcripts.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Current Due</span>
                      <span className="text-base font-bold font-mono text-emerald-900">$0.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 官方认证注脚 */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Electronic Record Certified by University Student Information System</span>
                <span className="font-mono">VERIFIED HASH: {Math.abs(seed * 7919).toString(16).toUpperCase()}</span>
              </div>
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
