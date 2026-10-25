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

        {/* 录取公函主信纸独立滚动区域 (1:1 还原加州大学伯克利/名校原版公文) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex justify-center print:p-0 print:overflow-visible">
          {letterData && (
            <div className="w-full max-w-[760px] bg-white rounded-lg shadow-md border border-slate-200 p-8 sm:p-14 text-slate-800 font-serif leading-relaxed print:shadow-none print:border-none print:m-0 print:p-8">
              {/* UC 伯克利 1:1 官方原版题头 */}
              {letterData.sealType === "berkeley" ? (
                <div className="mb-8">
                  <div className="text-center font-serif tracking-widest text-base sm:text-lg font-bold text-slate-900 uppercase">
                    University of California, Berkeley
                  </div>
                  <div className="mt-2 border-t border-b border-slate-800 py-1 flex items-center justify-between text-[7px] sm:text-[8px] font-sans tracking-tight text-slate-600 uppercase">
                    <span className="truncate">BERKELEY · DAVIS · IRVINE · LOS ANGELES · MERCED · RIVERSIDE</span>
                    <div className="mx-2 h-7 w-7 rounded-full border border-slate-900 bg-white flex items-center justify-center text-[6px] font-serif font-black shrink-0">
                      CAL
                    </div>
                    <span className="truncate">SAN DIEGO · SAN FRANCISCO · SANTA BARBARA · SANTA CRUZ</span>
                  </div>
                </div>
              ) : (
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
                      {letterData.universityName}
                    </h1>
                    <p className="text-xs font-sans tracking-wide text-slate-600 font-medium mt-0.5">
                      {letterData.schoolCollege}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold font-sans">
                    SEAL
                  </div>
                </div>
              )}

              {/* 发件人与地址 (对齐伯克利 Sproul Hall 格式) */}
              <div className="text-xs font-serif leading-snug text-slate-800 mb-6 space-y-0.5">
                <p className="font-bold text-slate-900">{letterData.signatoryName}</p>
                <p>{letterData.signatoryTitle}</p>
                <p>{letterData.universityName}</p>
                <p>{letterData.addressLine}</p>
                <p>{letterData.cityStateZip}</p>
                <p className="pt-3 font-semibold text-slate-900">{letterData.issueDate}</p>
              </div>

              {/* 收件人 */}
              <div className="text-xs font-serif mb-4">
                <p className="text-slate-900 font-bold text-sm">Dear {letterData.recipientName},</p>
              </div>

              {/* 信件正文 (1:1 还原 UC 伯克利研究生院真实录取文书措辞) */}
              <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                <p>
                  <b>Congratulations!</b> I am delighted to offer you admission to graduate study in the{" "}
                  <b>{letterData.degreeProgram}</b> program, beginning <b>{letterData.admitTerm}</b>. Please accept my warmest congratulations on the many accomplishments and achievements that have earned you admission to this unique institution. We hope that you will accept our offer.
                </p>
                <p>
                  Berkeley is an incomparable place to earn a graduate degree. You will have the opportunity to work with and learn from a world-renowned and devoted faculty, alongside diverse and talented student colleagues. As a Berkeley graduate student, you will join a vibrant scholarly community that will support you in pursuing your particular academic or professional interests. In addition, you will be able to take advantage of a wider intellectual context engaged in cutting-edge teaching, research, professional activities, and public service in more than 100 top-ranked graduate programs.
                </p>
                <p>
                  Berkeley offers you access to state-of-the-art research facilities and world-class libraries with the largest public collections in North America. For relaxation, the scenic 1,200 acre campus lies in the heart of one of America's most exciting and multicultural metropolitan areas. Outstanding recreational opportunities are easily accessible, locally and throughout California.
                </p>
                <p>
                  When you complete your degree, you will join a flourishing network of graduate alumni throughout the world. I hear repeatedly from them that Berkeley played a pivotal role in shaping their lives and subsequent successes.
                </p>
                <p>
                  Along with this letter you will find instructions on how to respond to our offer of admission. Because many other applicants are hoping for the place reserved for you, we would appreciate it if you could respond as soon as possible (no later than <b>{letterData.responseDeadline}</b> for full admission). If you have questions, please contact your department directly or send an email to our office at <code className="text-blue-900 font-sans text-xs">gradadm@berkeley.edu</code>.
                </p>
                <p>
                  This letter notifies you of our admission offer only. In recognition of your academic excellence, you have been nominated for the <b>{letterData.scholarshipTitle}</b> in the amount of <b>{letterData.scholarshipAmount}</b>. You will receive detailed information about financial support separately from your department or the university.
                </p>
                <p>
                  Again, many congratulations. I look forward to welcoming you to Berkeley soon!
                </p>
              </div>

              {/* 落款与亲笔签字 */}
              <div className="mt-8 pt-2">
                <p className="text-xs font-serif text-slate-700 mb-2">Sincerely yours,</p>
                <div className="font-serif italic text-2xl font-bold text-blue-950 font-script tracking-wide py-1">
                  {letterData.signatoryName}
                </div>
                <p className="text-xs font-serif font-bold text-slate-900 mt-1">
                  {letterData.signatoryName}
                </p>
                <p className="text-[11px] font-serif text-slate-600 max-w-sm leading-snug">
                  {letterData.signatoryTitle}
                </p>
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
