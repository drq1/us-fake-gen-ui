"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, FileBadge, Award, HeartHandshake, Baby, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from "lucide-react"
import { OfficialStateEducationSeal } from "@/components/brand-logos"
import type { PersonData } from "@/lib/types"
import { generateVitalRecords, type VitalRecordsData } from "@/lib/vital-records-generator"

interface VitalRecordsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  seed?: number
  defaultDocType?: "birth" | "ged" | "marriage" | "skill"
  defaultVariant?: string
  onBackToTemplates?: () => void
}

export function VitalRecordsModal({
  open,
  onOpenChange,
  person,
  seed = 2026,
  defaultDocType = "birth",
  defaultVariant,
  onBackToTemplates,
}: VitalRecordsModalProps) {
  const [docType, setDocType] = useState<"birth" | "ged" | "marriage" | "skill">(defaultDocType)
  const [birthVariant, setBirthVariant] = useState<"standard" | "hospital" | "michigan" | "informational">("standard")
  const [gedVariant, setGedVariant] = useState<"diploma" | "transcript">("diploma")
  const [skillVariant, setSkillVariant] = useState<"cpr" | "trainer">("cpr")
  const [records, setRecords] = useState<VitalRecordsData | null>(null)

  useEffect(() => {
    if (defaultDocType && open) {
      setDocType(defaultDocType)
    }
  }, [defaultDocType, open])

  useEffect(() => {
    if (defaultVariant && open) {
      if (defaultVariant === "michigan" || defaultVariant === "informational" || defaultVariant === "standard" || defaultVariant === "hospital") {
        setBirthVariant(defaultVariant)
      } else if (defaultVariant === "transcript" || defaultVariant === "diploma") {
        setGedVariant(defaultVariant)
      } else if (defaultVariant === "trainer" || defaultVariant === "cpr") {
        setSkillVariant(defaultVariant)
      }
    }
  }, [defaultVariant, open])

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
      <DialogContent className="w-[98vw] max-w-4xl h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto print:max-h-none print:overflow-visible">
        {/* 固定顶部操作栏 (独立置顶，绝不跟随滚动) */}
        <DialogHeader className="print:hidden border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 shrink-0 z-10 text-left">
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

              {/* 细分真实样本版式选择 */}
              {docType === "birth" && (
                <select
                  value={birthVariant}
                  onChange={(e) => setBirthVariant(e.target.value as "standard" | "hospital" | "michigan" | "informational")}
                  className="h-8 text-xs font-semibold bg-white border border-slate-300 rounded-md px-2 focus:outline-hidden"
                >
                  <option value="standard">标准县级官方出生证明 (County Vital Record)</option>
                  <option value="hospital">医院活产医学证明·附脚印 (Hospital Certificate & Footprints)</option>
                  <option value="michigan">密歇根州官方出生证明 (State of Michigan)</option>
                  <option value="informational">加注 Informational 备案副本 (Informational Copy)</option>
                </select>
              )}
              {docType === "ged" && (
                <select
                  value={gedVariant}
                  onChange={(e) => setGedVariant(e.target.value as "diploma" | "transcript")}
                  className="h-8 text-xs font-semibold bg-white border border-slate-300 rounded-md px-2 focus:outline-hidden"
                >
                  <option value="diploma">GED 高中文凭证书 (Equivalency Diploma)</option>
                  <option value="transcript">GED 官方全科成绩单 (Official Test Results)</option>
                </select>
              )}
              {docType === "skill" && (
                <select
                  value={skillVariant}
                  onChange={(e) => setSkillVariant(e.target.value as "cpr" | "trainer")}
                  className="h-8 text-xs font-semibold bg-white border border-slate-300 rounded-md px-2 focus:outline-hidden"
                >
                  <option value="cpr">急救与心肺复苏 (BLS CPR / AED 证书)</option>
                  <option value="trainer">NASM 认证健身教练成绩单 (Personal Trainer Transcript)</option>
                </select>
              )}

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

        {/* 证书主纸张独立滚动区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 print:p-0 print:overflow-visible">
          {records && (
            <div className="mx-auto w-full max-w-[800px] bg-amber-50/40 rounded-xl shadow-lg border-8 border-double border-amber-800/60 p-6 sm:p-10 font-serif print:shadow-none print:border-black print:m-0 print:p-6 text-slate-800 relative">
              {/* 1. 出生证明 */}
              {docType === "birth" && (
                birthVariant === "hospital" ? (
                  <div>
                    <div className="text-center border-b-2 border-slate-800 pb-3 mb-5">
                      <div className="flex items-center justify-center gap-2 text-rose-700 mb-1">
                        <Baby className="h-6 w-6" />
                      </div>
                      <div className="text-xs uppercase font-sans tracking-widest text-slate-700 font-bold">
                        {records.birth.facilityName.toUpperCase()}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider uppercase mt-1">
                        Hospital Certificate of Birth
                      </h1>
                      <p className="text-xs font-mono text-slate-600 mt-1">
                        DEPARTMENT OF OBSTETRICS & NEONATOLOGY · REG NO: <b className="text-slate-900">HOSP-{records.birth.certificateNumber.replace(/\D/g, "").slice(0, 7) || "9482015"}</b>
                      </p>
                    </div>

                    <div className="text-center my-4 font-serif text-sm leading-relaxed text-slate-800">
                      <p className="italic text-slate-600">This certifies that</p>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-serif my-2 tracking-wide underline decoration-rose-300 underline-offset-8">
                        {records.birth.childFullName}
                      </h2>
                      <p className="text-xs font-sans text-slate-700 max-w-lg mx-auto">
                        was born at <b>{records.birth.facilityName}</b> in <b>{records.birth.cityOfBirth}, {records.birth.state}</b> at <b>{records.birth.timeOfBirth}</b> on <b>{records.birth.dateOfBirth}</b>.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 font-sans text-xs">
                      {/* 父母与生理指征 */}
                      <div className="bg-white/90 p-3.5 rounded border border-amber-300/80 space-y-2">
                        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 text-[11px] uppercase tracking-wider">
                          Parentage & Vital Signs
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Father / Parent Full Name</span>
                          <span className="font-bold text-slate-900">{records.birth.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Mother / Maiden Name</span>
                          <span className="font-bold text-slate-900">{records.birth.motherMaidenName}</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Infant Physical Metrics</span>
                          <span className="font-mono font-bold text-slate-800">Weight: 7 lbs 8 oz (3,400 g) · Length: 20.5 in · Sex: {records.birth.sex}</span>
                        </div>
                      </div>

                      {/* 新生儿足印框 (1:1 还原 Birth_Certificate_Standard_Hospital.jpeg) */}
                      <div className="bg-white/90 p-3.5 rounded border-2 border-dashed border-slate-400 flex flex-col items-center justify-between text-center min-h-[140px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Baby's Footprints (Newborn Imprint)
                        </span>
                        <div className="flex items-center justify-center gap-6 my-2 text-slate-800">
                          {/* 左脚印 SVG */}
                          <svg className="w-10 h-14 fill-slate-800/80 transform -rotate-6" viewBox="0 0 100 150">
                            <ellipse cx="50" cy="110" rx="28" ry="32" />
                            <circle cx="32" cy="50" r="14" />
                            <circle cx="48" cy="38" r="9" />
                            <circle cx="64" cy="34" r="8" />
                            <circle cx="78" cy="38" r="7" />
                            <circle cx="88" cy="48" r="6" />
                          </svg>
                          {/* 右脚印 SVG */}
                          <svg className="w-10 h-14 fill-slate-800/80 transform rotate-6" viewBox="0 0 100 150">
                            <ellipse cx="50" cy="110" rx="28" ry="32" />
                            <circle cx="68" cy="50" r="14" />
                            <circle cx="52" cy="38" r="9" />
                            <circle cx="36" cy="34" r="8" />
                            <circle cx="22" cy="38" r="7" />
                            <circle cx="12" cy="48" r="6" />
                          </svg>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">
                          CERTIFIED CLINICAL HOSPITAL REGISTRATION
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-300 flex items-center justify-between text-xs font-sans">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Attending Obstetrician / Physician</span>
                        <span className="font-signature-pen text-xl font-bold text-[#001f3f] block select-none transform -rotate-1">
                          Dr. Sarah Jenkins, M.D.
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-sans block">Attending Obstetrician, FACOG</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block">Hospital Administrator</span>
                        <span className="font-signature-formal text-xl font-bold text-slate-900 block select-none">
                          Karen Sterling, R.N.
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-sans block">Director of Obstetrics Admin</span>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="relative">
                  {/* Informational 水印 */}
                  {birthVariant === "informational" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
                      <div className="transform -rotate-25 text-red-900/15 font-black tracking-wider text-3xl sm:text-4xl uppercase border-4 border-dashed border-red-900/20 p-6 text-center max-w-lg">
                        INFORMATIONAL, NOT A VALID DOCUMENT TO ESTABLISH IDENTITY
                      </div>
                    </div>
                  )}

                  <div className="text-center border-b-2 border-amber-900 pb-3 mb-6">
                    <div className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                      {birthVariant === "michigan"
                        ? "STATE OF MICHIGAN · DEPARTMENT OF COMMUNITY HEALTH"
                        : `STATE OF ${records.birth.state.toUpperCase()} · DEPARTMENT OF HEALTH`}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-wider uppercase mt-1">
                      Certificate of Live Birth
                    </h1>
                    <p className="text-xs font-mono text-slate-600 mt-1">
                      {birthVariant === "michigan" ? "VITAL RECORDS DIVISION · LANSING, MI" : "STATE FILE NUMBER"}:{" "}
                      <b className="text-slate-900">{records.birth.certificateNumber}</b>
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
                        <span className="font-medium text-slate-900">
                          {records.birth.cityOfBirth}, {records.birth.county},{" "}
                          {birthVariant === "michigan" ? "Michigan" : records.birth.state}
                        </span>
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
                      <span className="font-signature-formal text-2xl font-bold text-[#001f3f] block select-none transform -rotate-1 py-0.5">
                        {birthVariant === "michigan" ? "Janet M. Olszewski" : records.birth.stateRegistrar.split("-")[0].trim()}
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-sans block">
                        {birthVariant === "michigan" ? "State Registrar of Michigan" : "State Registrar of Vital Statistics"}
                      </span>
                    </div>
                    <OfficialStateEducationSeal
                      stateName={birthVariant === "michigan" ? "MICHIGAN" : records.birth.state}
                      className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-sm shrink-0"
                      color="#92400e"
                    />
                  </div>
                </div>
                )
              )}

              {/* 2. GED 文凭证书与全科成绩单 (1:1 还原 GED_Equivalency_Diploma 与 GED_Official_Test_Results) */}
              {docType === "ged" && (
                gedVariant === "transcript" ? (
                  <div className="font-sans text-xs">
                    <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                      <div className="text-xs uppercase font-bold tracking-widest text-slate-700">
                        THE GED TESTING SERVICE · OFFICIAL TEST RESULTS & TRANSCRIPT
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-1">
                        High School Equivalency Examination Transcript
                      </h1>
                      <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                        DOCUMENT NO: {records.ged.documentNumber} · JURISDICTION: {records.ged.state.toUpperCase()}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-200 mb-4 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Candidate Name:</span>
                        <span className="font-bold text-sm text-slate-900">{records.ged.recipientName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Credential Status:</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> PASSED - EQUIVALENCY CONFERRED
                        </span>
                      </div>
                    </div>

                    {/* 官方单项考试成绩表 */}
                    <table className="w-full text-left text-xs border-collapse border border-slate-300 mb-4">
                      <thead>
                        <tr className="bg-slate-800 text-white text-[11px]">
                          <th className="p-2">TEST BATTERY SUBJECT</th>
                          <th className="p-2 text-center w-24">STANDARD SCORE</th>
                          <th className="p-2 text-center w-24">PASSING MIN</th>
                          <th className="p-2 text-right w-24">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {records.ged.standardScores.map((s, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/50">
                            <td className="p-2 font-medium text-slate-800">{s.subject}</td>
                            <td className="p-2 text-center font-mono font-bold text-slate-950">{s.score}</td>
                            <td className="p-2 text-center font-mono text-slate-500">145</td>
                            <td className="p-2 text-right font-bold text-emerald-700">PASSED</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-2.5 bg-slate-100 rounded border border-slate-300 flex justify-between font-mono text-xs font-bold mb-4">
                      <span>BATTERY AVERAGE: {records.ged.averageScore.toFixed(1)}</span>
                      <span>TOTAL POINTS: {records.ged.standardScores.reduce((a, b) => a + b.score, 0)} / 800</span>
                      <span className="text-blue-900">CREDENTIAL EARNED</span>
                    </div>

                    <div className="pt-2 flex justify-between items-end border-t border-slate-300 text-[10px] text-slate-500">
                      <div>Official Record Issued under auspices of American Council on Education (ACE).</div>
                      <div className="font-bold text-slate-800">State Superintendent Certified</div>
                    </div>
                  </div>
                ) : (
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

                    <div className="mt-8 flex justify-between items-center text-xs font-sans pt-2 border-t border-amber-200">
                      <div className="text-left">
                        <span className="font-mono text-slate-500">Document No: {records.ged.documentNumber}</span>
                        <span className="block text-slate-700 font-bold mt-0.5">Issue Date: {records.ged.issueDate}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <OfficialStateEducationSeal
                          stateName={records.ged.stateBoardName.replace(/Board of Education|Department of Education/i, "").trim() || "STATE"}
                          className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-sm shrink-0"
                          color="#b45309"
                        />
                      </div>
                      <div className="text-right">
                        <span className="font-signature-formal text-2xl font-bold text-slate-900 block select-none">
                          {records.ged.superintendentName}
                        </span>
                        <span className="text-[10px] text-slate-500">State Superintendent of Public Instruction</span>
                      </div>
                    </div>
                  </div>
                )
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
                      <span className="text-[10px] text-slate-400 block">Officiant Signature</span>
                      <span className="font-signature text-2xl font-bold text-[#3d2314] block select-none transform -rotate-2">
                        {records.marriage.officiantName}
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-sans block">Ordained Minister / Officiant</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <OfficialStateEducationSeal
                        stateName={records.marriage.state || "STATE"}
                        className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-sm shrink-0"
                        color="#78350f"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Attested by County Clerk</span>
                      <span className="font-signature-pen text-xl font-bold text-slate-900 block select-none">
                        {records.marriage.countyClerkName}
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-sans block">County Clerk of Vital Statistics</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. 技能资质与教练成绩单 (1:1 还原 Personal_Trainer_Certification_Transcript) */}
              {docType === "skill" && (
                skillVariant === "trainer" ? (
                  <div className="font-sans text-xs">
                    <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                      <div className="text-xs uppercase font-black tracking-wider text-slate-800">
                        NATIONAL ACADEMY OF SPORTS MEDICINE (NASM)
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-1">
                        Certified Personal Trainer (CPT) Transcript
                      </h1>
                      <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                        NCCA ACCREDITED · VERIFICATION ID: {records.skill.certificationId}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-200 mb-4 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Candidate:</span>
                        <span className="font-bold text-sm text-slate-900">{records.skill.recipientName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Certification Program:</span>
                        <span className="font-bold text-blue-900">NASM-CPT® Optimum Performance Training</span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse border border-slate-300 mb-4">
                      <thead>
                        <tr className="bg-slate-800 text-white text-[11px]">
                          <th className="p-2">COMPLETED COURSE MODULE</th>
                          <th className="p-2 text-center w-24">CEU CREDITS</th>
                          <th className="p-2 text-center w-24">GRADE</th>
                          <th className="p-2 text-right w-24">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="hover:bg-slate-50">
                          <td className="p-2 font-medium">Human Movement Science & Anatomy</td>
                          <td className="p-2 text-center font-mono">2.0</td>
                          <td className="p-2 text-center font-mono font-bold">A (4.0)</td>
                          <td className="p-2 text-right font-bold text-emerald-700">COMPLETED</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2 font-medium">Fitness Assessments & Postural Screening</td>
                          <td className="p-2 text-center font-mono">1.5</td>
                          <td className="p-2 text-center font-mono font-bold">A (4.0)</td>
                          <td className="p-2 text-right font-bold text-emerald-700">COMPLETED</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2 font-medium">Program Design & Integrated Training</td>
                          <td className="p-2 text-center font-mono">2.5</td>
                          <td className="p-2 text-center font-mono font-bold">A (4.0)</td>
                          <td className="p-2 text-right font-bold text-emerald-700">COMPLETED</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2 font-medium">Nutrition & Client Behavioral Coaching</td>
                          <td className="p-2 text-center font-mono">1.5</td>
                          <td className="p-2 text-center font-mono font-bold">A (4.0)</td>
                          <td className="p-2 text-right font-bold text-emerald-700">COMPLETED</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="p-2.5 bg-slate-100 rounded border border-slate-300 flex justify-between font-mono text-xs font-bold mb-4">
                      <span>TOTAL CEUS: 7.5</span>
                      <span>OVERALL GPA: 4.00</span>
                      <span className="text-emerald-800">NCCA CERTIFIED ACTIVE</span>
                    </div>

                    <div className="pt-2 flex justify-between items-end border-t border-slate-300 text-[10px] text-slate-500">
                      <div>Issued: {records.skill.issueDate} · Expiration: {records.skill.expDate}</div>
                      <div className="font-bold text-slate-800">Credentialing Director, NASM Board</div>
                    </div>
                  </div>
                ) : (
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
                        <span className="font-signature-pen text-xl font-bold text-[#001f3f] block select-none">
                          {records.skill.instructorName}
                        </span>
                        <span className="text-[10px] text-slate-500">Certified Authorized Instructor</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* 底部工具栏 (固定在底部，绝不跟随滚动) */}
        <div className="print:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
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
