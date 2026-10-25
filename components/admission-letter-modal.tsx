"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Edit3, Eye, RefreshCw, GraduationCap, Download, ArrowLeft, Award, CheckCircle } from "lucide-react"
import type { PersonData, UniversityData } from "@/lib/types"
import {
  generateAdmissionLetter,
  PRESET_INSTITUTIONS,
  type AdmissionLetterData,
} from "@/lib/admission-letter-generator"

interface AdmissionLetterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  university?: UniversityData | null
  seed?: number
  defaultSchoolId?: string
  onBackToTemplates?: () => void
}

export function AdmissionLetterModal({
  open,
  onOpenChange,
  person,
  university,
  seed = 2026,
  defaultSchoolId,
  onBackToTemplates,
}: AdmissionLetterModalProps) {
  const [selectedInstId, setSelectedInstId] = useState<string>(defaultSchoolId || "berkeley")
  const [currentSeed, setCurrentSeed] = useState(seed)
  const [letterData, setLetterData] = useState<AdmissionLetterData | null>(null)
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    if (defaultSchoolId) {
      setSelectedInstId(defaultSchoolId)
    }
  }, [defaultSchoolId])

  useEffect(() => {
    if (person) {
      setLetterData(generateAdmissionLetter(person, university || null, currentSeed, selectedInstId))
    }
  }, [person, university, currentSeed, selectedInstId])

  const handlePrint = () => {
    window.print()
  }

  const handleRegenerate = () => {
    setCurrentSeed(Math.floor(Math.random() * 1000000))
  }

  const handleExportJson = () => {
    if (!letterData) return
    const blob = new Blob([JSON.stringify(letterData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Admission_Offer_${person.fullName.replace(/\s+/g, "_")}.json`
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
                <GraduationCap className="h-5 w-5 text-blue-700" />
                名校官方录取通知书 (Admission Offer Letter)
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                全美顶级高校官方公函排版，含院系题头、学籍 ID、奖学金授予与院长亲笔签署
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

              {/* 高校快速切换 */}
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="h-8 text-xs font-semibold bg-white border border-slate-300 rounded-md px-2.5 focus:outline-hidden"
              >
                {PRESET_INSTITUTIONS.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name.split(",")[0]}
                  </option>
                ))}
              </select>

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

              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 text-xs font-semibold bg-white"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                刷新文书
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                打印 / 另存为 PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 录取公函主信纸独立滚动区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 print:p-0 print:overflow-visible">
          {letterData && (
            <div className="mx-auto w-full max-w-[800px] bg-white rounded-lg shadow-md border border-slate-200/80 p-8 sm:p-12 text-slate-800 font-serif leading-relaxed print:shadow-none print:border-none print:m-0 print:p-8">
              {/* 顶栏官方题头 */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
                    {letterData.universityName}
                  </h1>
                  <p className="text-xs sm:text-sm font-sans tracking-wide text-slate-600 font-medium mt-0.5">
                    {letterData.schoolCollege}
                  </p>
                  <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                    {letterData.addressLine} · {letterData.cityStateZip} · Tel: {letterData.phone}
                  </p>
                </div>

                <div className="h-14 w-14 rounded-full border-2 border-blue-900 bg-blue-50/50 flex flex-col items-center justify-center text-blue-900 font-sans text-center shrink-0">
                  <GraduationCap className="h-6 w-6 text-blue-900" />
                  <span className="text-[8px] font-bold tracking-tighter uppercase mt-0.5">OFFICIAL SEAL</span>
                </div>
              </div>

              {/* 信件元数据 (日期与学籍编号) */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs font-sans text-slate-600 mb-6">
                <div>
                  <p className="font-semibold text-slate-900">{letterData.issueDate}</p>
                  <div className="mt-2 text-xs leading-tight">
                    <p className="font-bold text-slate-900 text-sm font-serif">{letterData.recipientName}</p>
                    <p>{letterData.recipientAddress}</p>
                    <p>{letterData.recipientCityStateZip}</p>
                  </div>
                </div>

                <div className="sm:text-right bg-slate-50 p-2.5 rounded-md border border-slate-200/80 text-[11px]">
                  <p><span className="text-slate-400">Application ID:</span> <b className="font-mono text-slate-900">{letterData.applicationId}</b></p>
                  <p><span className="text-slate-400">Student ID:</span> <b className="font-mono text-slate-900">{letterData.studentId}</b></p>
                  <p><span className="text-slate-400">Admitted Program:</span> <b className="text-blue-900 font-medium">{letterData.degreeProgram}</b></p>
                  <p><span className="text-slate-400">Matriculation Term:</span> <b className="text-slate-900">{letterData.admitTerm}</b></p>
                </div>
              </div>

              {/* 信件正文 */}
              <div className="space-y-3.5 text-[13.5px] leading-relaxed text-slate-800">
                {letterData.letterBody.map((paragraph, idx) => (
                  <p
                    key={idx}
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className={isEditable ? "outline-dashed outline-1 outline-amber-400 p-1 rounded" : ""}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* 奖学金荣誉醒目条 */}
              <div className="my-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between gap-4 font-sans text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-amber-900 tracking-wider">
                      Fellowship & Merit Award Confirmed
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {letterData.scholarshipTitle}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-amber-800 font-medium block">Award Amount</span>
                  <span className="text-lg font-bold text-amber-900 font-mono">{letterData.scholarshipAmount}</span>
                </div>
              </div>

              {/* 落款与签名 */}
              <div className="mt-8 pt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-sans text-slate-500 mb-2">Sincerely,</p>
                  <div className="font-serif italic text-xl font-bold text-blue-950 font-script tracking-wide py-1">
                    {letterData.signatoryName}
                  </div>
                  <p className="font-sans font-bold text-xs text-slate-900 mt-1">
                    {letterData.signatoryName}
                  </p>
                  <p className="font-sans text-[11px] text-slate-500 max-w-xs leading-snug">
                    {letterData.signatoryTitle}
                  </p>
                </div>

                {/* 官方钢印视觉水印 */}
                <div className="h-24 w-24 rounded-full border-4 border-dashed border-amber-500/40 flex flex-col items-center justify-center text-amber-700/60 font-sans text-center rotate-[-12deg] select-none">
                  <CheckCircle className="h-6 w-6 mb-0.5" />
                  <span className="text-[8px] font-bold tracking-widest uppercase">REGISTRAR SEAL</span>
                  <span className="text-[7px] font-mono tracking-tighter">VERIFIED ADMISSION</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部工具栏 (固定在底部，绝不跟随滚动) */}
        <div className="print:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            💡 提示：作为出国留学、签证申请或海外学生优惠验证时，在打印选项中勾选「背景图形」以呈现精美公函底纹。
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
              下载录取 JSON
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdmissionLetterModal
