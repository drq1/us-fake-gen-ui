"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, FileBadge, Award, HeartHandshake, Baby, ArrowLeft, Download, ShieldCheck } from "lucide-react"
import type { PersonData } from "@/lib/types"
import { generateVitalRecords, type VitalRecordsData } from "@/lib/vital-records-generator"

interface VitalRecordsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  seed?: number
  defaultDocType?: "birth" | "ged" | "marriage" | "skill"
  onBackToTemplates?: () => void
}

export function VitalRecordsModal({
  open,
  onOpenChange,
  person,
  seed = 2026,
  defaultDocType = "birth",
  onBackToTemplates,
}: VitalRecordsModalProps) {
  const [docType, setDocType] = useState<"birth" | "ged" | "marriage" | "skill">(defaultDocType)
  const [records, setRecords] = useState<VitalRecordsData | null>(null)

  useEffect(() => {
    if (defaultDocType && open) {
      setDocType(defaultDocType)
    }
  }, [defaultDocType, open])

  useEffect(() => {
    if (person) {
      setRecords(generateVitalRecords(person, seed))
    }
  }, [person, seed])

  const handlePrint = () => {
    window.print()
  }

  const handleExportJson = () => {
    if (!records) return
    const blob = new Blob([JSON.stringify(records[docType], null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${docType.toUpperCase()}_Certificate_${person.fullName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-4xl max-h-[95vh] overflow-y-auto p-3 sm:p-6 bg-slate-100 print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:max-h-none print:overflow-visible rounded-2xl">
        <DialogHeader className="print:hidden border-b border-slate-200 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                <FileBadge className="h-5 w-5 text-amber-600" />
                官方民政公文与资格文凭生成器 (Vital Records & Certs)
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                包含官方出生证明、GED 高中文凭证书、结婚证明与专业技能急救资质证书
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

              {/* 证件类型切换 */}
              <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                <button
                  onClick={() => setDocType("birth")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    docType === "birth" ? "bg-amber-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  出生证明
                </button>
                <button
                  onClick={() => setDocType("ged")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    docType === "ged" ? "bg-amber-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  GED 文凭
                </button>
                <button
                  onClick={() => setDocType("marriage")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    docType === "marriage" ? "bg-amber-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  结婚证明
                </button>
                <button
                  onClick={() => setDocType("skill")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    docType === "skill" ? "bg-amber-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  技能证书
                </button>
              </div>

              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                打印证书
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 证书主纸张 */}
        {records && (
          <div className="my-4 mx-auto w-full max-w-[800px] bg-amber-50/40 rounded-xl shadow-lg border-8 border-double border-amber-800/60 p-6 sm:p-10 font-serif print:shadow-none print:border-black print:m-0 print:p-6 text-slate-800 relative">
            {/* 1. 出生证明 */}
            {docType === "birth" && (
              <div>
                <div className="text-center border-b-2 border-amber-900 pb-3 mb-6">
                  <div className="text-xs uppercase font-sans tracking-widest text-slate-500 font-bold">
                    STATE OF {records.birth.state.toUpperCase()} · DEPARTMENT OF HEALTH
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-wider uppercase mt-1">
                    Certificate of Live Birth
                  </h1>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    STATE FILE NUMBER: <b className="text-slate-900">{records.birth.certificateNumber}</b>
                  </p>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <div className="bg-white/80 p-3.5 rounded border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Full Name of Child</span>
                      <span className="text-sm font-serif font-bold text-slate-900">{records.birth.childFullName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Date of Birth</span>
                      <span className="font-mono font-bold text-slate-900">{records.birth.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Time of Birth / Sex</span>
                      <span className="font-bold text-slate-800">{records.birth.timeOfBirth} · {records.birth.sex}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3.5 rounded border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Facility / Hospital</span>
                      <span className="font-medium text-slate-900">{records.birth.facilityName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">City, County, State</span>
                      <span className="font-medium text-slate-900">{records.birth.cityOfBirth}, {records.birth.county}, {records.birth.state}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3.5 rounded border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Father / Parent Full Name</span>
                      <span className="font-medium text-slate-900">{records.birth.fatherName} ({records.birth.fatherBirthState})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Mother / Maiden Name</span>
                      <span className="font-medium text-slate-900">{records.birth.motherMaidenName} ({records.birth.motherBirthState})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">State Registrar Signature</span>
                    <span className="font-serif italic text-sm font-bold text-slate-900">{records.birth.stateRegistrar}</span>
                  </div>
                  <div className="h-16 w-16 rounded-full border-2 border-amber-800/80 flex flex-col items-center justify-center text-[8px] font-bold text-amber-900 text-center">
                    <span>STATE SEAL</span>
                    <span className="text-[7px]">VITAL STATS</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. GED 文凭证书 */}
            {docType === "ged" && (
              <div className="text-center py-2">
                <div className="text-xs uppercase font-sans tracking-widest text-slate-500 font-bold">
                  {records.ged.stateBoardName.toUpperCase()}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase mt-2 tracking-wide">
                  High School Equivalency Diploma
                </h1>
                <p className="text-xs text-slate-500 italic mt-1 font-serif">
                  Awarded by authority of the State Board of Education
                </p>

                <p className="mt-6 text-sm">This is to certify that</p>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 my-2 underline decoration-amber-600/50 underline-offset-8">
                  {records.ged.recipientName}
                </h2>
                <p className="text-xs max-w-lg mx-auto text-slate-600 leading-relaxed font-sans">
                  has satisfactorily passed all standard battery examinations prescribed by the GED Testing Service and the State Board of Education, meeting the requirements for secondary school graduation equivalency.
                </p>

                <div className="my-6 max-w-md mx-auto bg-white/80 p-3 rounded-lg border border-amber-200 text-xs font-sans">
                  <div className="font-bold text-slate-700 mb-2">Standard Subject Scores</div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {records.ged.standardScores.map((s, idx) => (
                      <div key={idx} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-600 text-[11px] truncate">{s.subject}</span>
                        <b className="font-mono text-slate-900">{s.score}</b>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-end text-xs font-sans pt-2 border-t border-amber-200">
                  <div className="text-left">
                    <span className="font-mono text-slate-500">Document No: {records.ged.documentNumber}</span>
                    <span className="block text-slate-700 font-bold mt-0.5">Issue Date: {records.ged.issueDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif italic font-bold text-sm block">{records.ged.superintendentName}</span>
                    <span className="text-[10px] text-slate-500">State Superintendent of Public Instruction</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 结婚证明 */}
            {docType === "marriage" && (
              <div>
                <div className="text-center border-b-2 border-amber-900 pb-3 mb-6">
                  <div className="text-xs uppercase font-sans tracking-widest text-slate-500 font-bold">
                    STATE OF {records.marriage.state.toUpperCase()} · COUNTY OF {records.marriage.county.toUpperCase()}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-wider mt-1">
                    Certificate of Marriage
                  </h1>
                  <p className="text-xs font-mono text-slate-500 mt-1">RECORD NO: {records.marriage.marriageId}</p>
                </div>

                <div className="text-center my-6 space-y-3 font-serif">
                  <p className="text-xs font-sans uppercase tracking-widest text-slate-400">This Certifies That</p>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">{records.marriage.groomName}</div>
                  <p className="text-xs font-sans uppercase tracking-widest text-slate-400">AND</p>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">{records.marriage.brideName}</div>
                  <p className="text-xs font-sans text-slate-600 max-w-md mx-auto pt-2">
                    were united in Holy Matrimony in accordance with the laws of the State of {records.marriage.state} on{" "}
                    <b>{records.marriage.ceremonyDate}</b>.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-amber-200 flex justify-between items-center text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Officiant</span>
                    <span className="font-serif italic font-bold text-slate-800">{records.marriage.officiantName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Attested by</span>
                    <span className="font-bold text-slate-800">{records.marriage.countyClerkName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. 技能急救证书 */}
            {docType === "skill" && (
              <div className="text-center py-2">
                <div className="text-xs uppercase font-sans tracking-widest text-rose-800 font-bold">
                  {records.skill.organization}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide mt-2">
                  Certificate of Competency
                </h1>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  Certification of Successful Course Completion
                </p>

                <p className="mt-4 text-xs font-sans text-slate-400 uppercase">Awarded to</p>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 my-1 underline decoration-rose-600/50 underline-offset-6">
                  {records.skill.recipientName}
                </h2>
                <div className="text-sm font-bold text-rose-900 font-sans my-2">
                  {records.skill.certTitle}
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-sans leading-relaxed">
                  Has successfully met all classroom cognitive and hands-on skill evaluation criteria in accordance with the standard curriculum.
                </p>

                <div className="mt-8 pt-3 border-t border-amber-200 flex justify-between items-end text-xs font-sans">
                  <div className="text-left">
                    <span className="font-mono text-slate-500 block text-[11px]">ID: {records.skill.certificationId}</span>
                    <span className="font-semibold text-slate-800">Issue: {records.skill.issueDate} · Exp: {records.skill.expDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif italic font-bold text-sm block">{records.skill.instructorName}</span>
                    <span className="text-[10px] text-slate-500">Certified Authorized Instructor</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 底部工具栏 */}
        <div className="print:hidden border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>💡 提示：本公文与文凭证书支持 Letter 纸张横向或纵向高保真彩色打印。</span>
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
              下载证书 JSON
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VitalRecordsModal
