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
import {
  HarvardVeritasShield,
  MitSloanLogo,
  UChicagoPhoenixBadge,
  TempleDiamondT,
  RitTigerEmblem,
  BerkeleyOfficialSeal,
  CsufOfficialSeal,
  VictoriaUniversityLogo,
  getHighSchoolLogoUrl,
  getUniversityLogoUrl,
} from "@/components/brand-logos"

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
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 print:p-0 print:overflow-visible">
          {letterData && (
            <div
              id="printable-admission-letter"
              className="mx-auto w-full max-w-[760px] bg-white rounded-lg shadow-md border border-slate-200 p-8 sm:p-14 text-slate-800 font-serif leading-relaxed print:shadow-none print:border-none print:m-0 print:p-2 sm:print:p-4"
            >
              {/* 院校 1:1 官方原版题头 */}
              {letterData.sealType === "berkeley" ? (
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <BerkeleyOfficialSeal className="h-20 w-20 sm:h-24 sm:w-24 shadow-sm shrink-0" />
                      <div>
                        <div className="font-serif tracking-widest text-lg sm:text-xl font-bold text-slate-900 uppercase">
                          University of California, Berkeley
                        </div>
                        <div className="text-xs font-sans text-slate-600 font-semibold uppercase tracking-wider">
                          Graduate Division · College of Engineering
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-sans text-slate-600 leading-tight">
                      <div>424 Sproul Hall, MC 5900</div>
                      <div>Berkeley, CA 94720</div>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-b border-slate-800 py-1 flex items-center justify-between text-[7px] sm:text-[8px] font-sans tracking-tight text-slate-600 uppercase">
                    <span className="truncate">BERKELEY · DAVIS · IRVINE · LOS ANGELES · MERCED · RIVERSIDE</span>
                    <span className="truncate">SAN DIEGO · SAN FRANCISCO · SANTA BARBARA · SANTA CRUZ</span>
                  </div>
                </div>
              ) : letterData.sealType === "mit" ? (
                <div className="mb-8 border-b-2 border-[#a31f34] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                  {/* MIT Sloan 官方权威全彩标识 */}
                  <div className="flex items-center gap-3">
                    <MitSloanLogo className="h-14 sm:h-16 w-auto" />
                  </div>
                  {/* MIT Sloan 官方地址 */}
                  <div className="text-right text-[11px] text-slate-600 leading-snug">
                    <div className="font-bold text-slate-900">Massachusetts Institute of Technology</div>
                    <div>Sloan School of Management</div>
                    <div>77 Massachusetts Avenue, Room E52-359</div>
                    <div>Cambridge, MA 02139</div>
                  </div>
                </div>
              ) : letterData.sealType === "harvard" ? (
                <div className="mb-8 border-b-2 border-[#a51c30] pb-4 flex items-center justify-between font-serif">
                  <div className="flex items-center gap-4">
                    <HarvardVeritasShield className="h-16 sm:h-20 w-auto shadow-sm" />
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#a51c30] uppercase">
                        HARVARD MEDICAL SCHOOL
                      </h1>
                      <p className="text-xs font-sans tracking-widest text-slate-700 uppercase font-semibold">
                        Graduate Education · Master of Science
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-sans text-slate-600 leading-tight">
                    <div className="font-bold text-slate-900">Gordon Hall</div>
                    <div>25 Shattuck Street</div>
                    <div>Boston, MA 02115</div>
                  </div>
                </div>
              ) : letterData.sealType === "uchicago" ? (
                <div className="mb-8 border-b-2 border-[#800000] pb-4 flex items-center justify-between font-serif">
                  <div className="flex items-center gap-4">
                    <UChicagoPhoenixBadge className="h-16 sm:h-20 w-auto shadow-sm" />
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#800000] uppercase">
                        THE UNIVERSITY OF CHICAGO
                      </h1>
                      <p className="text-xs font-sans tracking-wide text-slate-700 font-semibold">
                        Harris School of Public Policy
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-sans text-slate-600 leading-tight">
                    <div>1307 East 60th Street</div>
                    <div>Chicago, IL 60637</div>
                  </div>
                </div>
              ) : letterData.sealType === "csuf" ? (
                <div className="mb-8 border-b-2 border-[#00274c] pb-3 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-4">
                    <CsufOfficialSeal className="w-16 h-16 sm:w-20 sm:h-20 shadow-sm shrink-0" />
                    <div>
                      <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#00274c] uppercase">
                        CALIFORNIA STATE UNIVERSITY, FULLERTON
                      </h1>
                      <p className="text-xs tracking-wider text-[#f26a36] font-bold uppercase">
                        Office of Admissions and Records
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 leading-tight">
                    <div>P.O. Box 6900</div>
                    <div>Fullerton, CA 92834</div>
                  </div>
                </div>
              ) : letterData.sealType === "temple" ? (
                <div className="mb-8 border-b-2 border-[#9d2235] pb-3 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-3">
                    <TempleDiamondT className="h-14 sm:h-16 w-auto shadow-sm" />
                    <div>
                      <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#9d2235] uppercase">
                        TEMPLE UNIVERSITY
                      </h1>
                      <p className="text-xs tracking-wide text-slate-600 font-medium">
                        Office of Undergraduate Admissions · Conwell Hall
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 leading-tight">
                    <div>1801 N. Broad Street</div>
                    <div>Philadelphia, PA 19122</div>
                  </div>
                </div>
              ) : letterData.sealType === "victoria" ? (
                <div className="mb-8 border-b-2 border-[#002f6c] pb-3 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-3">
                    <VictoriaUniversityLogo className="h-14 sm:h-16 w-auto shadow-sm" />
                    <div>
                      <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#002f6c] uppercase">
                        VICTORIA UNIVERSITY
                      </h1>
                      <p className="text-[11px] tracking-wide text-slate-600 font-medium">
                        MELBOURNE AUSTRALIA · CRICOS Provider No. 00124K
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 leading-tight">
                    <div>Footscray Park Campus</div>
                    <div>Melbourne, VIC 3011, Australia</div>
                  </div>
                </div>
              ) : letterData.sealType === "rit" ? (
                <div className="mb-8 border-b-2 border-[#f76902] pb-3 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-3">
                    <RitTigerEmblem className="h-14 sm:h-16 w-auto shadow-sm" />
                    <div>
                      <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                        ROCHESTER INSTITUTE OF TECHNOLOGY
                      </h1>
                      <p className="text-[11px] tracking-wide text-[#f76902] font-bold">
                        B. Thomas Golisano College of Computing and Information Sciences
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 leading-tight font-sans">
                    <div className="font-semibold text-slate-800">Office of Graduate Enrollment</div>
                    <div>One Lomb Memorial Drive</div>
                    <div>Rochester, NY 14623-5603</div>
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
                  {getUniversityLogoUrl(letterData.universityName) ? (
                    <img
                      src={getUniversityLogoUrl(letterData.universityName)!}
                      alt="University Official Seal"
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-sm shrink-0"
                    />
                  ) : (
                    <img
                      src={getHighSchoolLogoUrl(undefined, letterData.cityStateZip.split(",")[1]?.trim())}
                      alt="State Department of Higher Education Official Seal"
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-sm shrink-0"
                    />
                  )}
                </div>
              )}

              {/* 发件人与地址 (对齐官方公函格式) */}
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

              {/* 信件正文 (学校定制化 1:1 官方文书措辞) */}
              {letterData.sealType === "berkeley" ? (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  <p>
                    <b>Congratulations!</b> I am delighted to offer you admission to graduate study in the{" "}
                    <b>{letterData.degreeProgram}</b> program, beginning <b>{letterData.admitTerm}</b>. Please accept my warmest congratulations on the many accomplishments and achievements that have earned you admission to this unique institution. We hope that you will accept our offer.
                  </p>
                  <p>
                    Berkeley is an incomparable place to earn a graduate degree. You will have the opportunity to work with and learn from a world-renowned and devoted faculty, alongside diverse and talented student colleagues. As a Berkeley graduate student, you will join a vibrant scholarly community that will support you in pursuing your particular academic or professional interests. In addition, you will be able to take advantage of a wider intellectual context engaged in cutting-edge teaching, research, professional activities, and public service in more than 100 top-ranked graduate programs.
                  </p>
                  <p>
                    Berkeley offers you access to state-of-the-art research facilities and world-class libraries with the largest public collections in North America. For relaxation, the scenic 1,200 acre campus lies in the heart of one of America's most exciting and multicultural metropolitan areas.
                  </p>
                  <p>
                    Along with this letter you will find instructions on how to respond to our offer of admission. Because many other applicants are hoping for the place reserved for you, we would appreciate it if you could respond as soon as possible (no later than <b>{letterData.responseDeadline}</b> for full admission).
                  </p>
                  <p>
                    This letter notifies you of our admission offer only. In recognition of your academic excellence, you have been nominated for the <b>{letterData.scholarshipTitle}</b> in the amount of <b>{letterData.scholarshipAmount}</b>. You will receive detailed information about financial support separately from your department.
                  </p>
                  <p>
                    Again, many congratulations. I look forward to welcoming you to Berkeley soon!
                  </p>
                </div>
              ) : letterData.sealType === "mit" ? (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  <p>
                    <b>Congratulations!</b> On behalf of the Sloan School of Management Admissions Committee, I am delighted to offer you admission to the <b>{letterData.degreeProgram}</b> program for the academic session entering in <b>{letterData.admitTerm}</b>.
                  </p>
                  <p>
                    Your application was selected from an exceptionally competitive and accomplished global applicant pool. The Admissions Committee was deeply impressed by your analytical prowess, demonstrated leadership acumen, and commitment to driving innovation in management practice. At MIT Sloan, you will collaborate with faculty renowned for groundbreaking research and peers dedicated to inventing the future.
                  </p>
                  <p>
                    In recognition of your exceptional academic credentials and leadership potential, the Committee has awarded you the <b>{letterData.scholarshipTitle}</b> in the amount of <b>{letterData.scholarshipAmount}</b>, to be credited toward your tuition across your enrolled terms.
                  </p>
                  <p>
                    To accept our offer and secure your seat in the incoming class, please submit your formal reply and enrollment deposit via your MIT Sloan Applicant Portal no later than <b>{letterData.responseDeadline}</b>.
                  </p>
                  <p>
                    We are thrilled to welcome you to the MIT community. I wish you every success in your studies and look forward to meeting you on campus this fall.
                  </p>
                </div>
              ) : letterData.sealType === "harvard" ? (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  <p>
                    <b>Congratulations!</b> On behalf of the Harvard Medical School faculty and the Graduate Education Admissions Committee, it is our privilege to offer you admission to the <b>{letterData.degreeProgram}</b> program beginning in <b>{letterData.admitTerm}</b>.
                  </p>
                  <p>
                    The Committee reviewed hundreds of outstanding applications from across the globe, and your dedication to the intersection of health, evidence-based science, and public communication distinguished your portfolio. At Harvard Medical School, you will learn and collaborate alongside pioneering clinicians, scholars, and public health innovators in the Longwood Medical Area.
                  </p>
                  <p>
                    In recognition of your academic excellence, we are pleased to confirm your fellowship award for the <b>{letterData.scholarshipTitle}</b> totaling <b>{letterData.scholarshipAmount}</b>. Details regarding fellowship disbursement and health coverage are enclosed.
                  </p>
                  <p>
                    Please confirm your acceptance of this offer by completing your enrollment reply in the HMS Admitted Student Portal on or before <b>{letterData.responseDeadline}</b>.
                  </p>
                  <p>
                    We warmly welcome you to Harvard Medical School and look forward to the vital contributions you will make to the field.
                  </p>
                </div>
              ) : letterData.sealType === "uchicago" ? (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  <p>
                    <b>Congratulations!</b> On behalf of the faculty and Admissions Committee of the Harris School of Public Policy at The University of Chicago, I am pleased to offer you admission to the <b>{letterData.degreeProgram}</b> program for <b>{letterData.admitTerm}</b>.
                  </p>
                  <p>
                    At Harris Public Policy, we believe that rigorous analytical training, rigorous evidence, and bold questions are required to address today's most intractable public challenges. Your application demonstrated the intellectual curiosity, analytical capability, and drive needed to lead change in the policy arena.
                  </p>
                  <p>
                    We are pleased to offer you a merit scholarship: the <b>{letterData.scholarshipTitle}</b> in the amount of <b>{letterData.scholarshipAmount}</b>. To accept this offer, please submit your response form and deposit by <b>{letterData.responseDeadline}</b>.
                  </p>
                  <p>
                    Welcome to the Harris community. We look forward to seeing the impact you will make in Chicago and around the world.
                  </p>
                </div>
              ) : letterData.sealType === "victoria" ? (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  <p>
                    <b>Congratulations!</b> Victoria University is delighted to offer you admission to the{" "}
                    <b>{letterData.degreeProgram}</b> program commencing in <b>{letterData.admitTerm}</b>.
                  </p>
                  <p>
                    Victoria University (VU) is globally recognized for the revolutionary VU Block Model®, empowering students to achieve deeper subject mastery and enhanced career outcomes. At our Melbourne campuses, you will engage with world-class faculty and a thriving scholarly community representing over 100 countries.
                  </p>
                  <p>
                    In recognition of your academic excellence, we are pleased to confirm that you have been awarded the{" "}
                    <b>{letterData.scholarshipTitle}</b> in the amount of <b>{letterData.scholarshipAmount}</b>, to be credited toward your tuition across your enrolled semesters.
                  </p>
                  <p>
                    To accept this offer and reserve your place, please sign and return the enclosed International Student Acceptance Agreement via your VU portal no later than <b>{letterData.responseDeadline}</b>.
                  </p>
                  <p>
                    We look forward to welcoming you to Victoria University and Melbourne, Australia!
                  </p>
                </div>
              ) : letterData.sealType === "rit" ? (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  <p>
                    <b>Congratulations!</b> It is a pleasure to inform you of your acceptance to Rochester Institute of Technology in the <b>{letterData.degreeProgram}</b> program at the <b>{letterData.schoolCollege}</b> for <b>{letterData.admitTerm}</b>.
                  </p>
                  <p>
                    Your academic credentials, technical innovation, and career ambitions distinguish you as an outstanding candidate. As an RIT graduate student, you will learn from renowned faculty pioneers in computing, artificial intelligence, and cybersecurity while collaborating in world-class laboratories.
                  </p>
                  <p>
                    In recognition of your academic excellence, we are pleased to award you the <b>{letterData.scholarshipTitle}</b> in the amount of <b>{letterData.scholarshipAmount}</b>, distributed evenly across your semesters of graduate study.
                  </p>
                  <p>
                    To secure your enrollment and reserve your graduate assistantship or scholarship, please submit your acceptance confirmation and enrollment deposit through the RIT Graduate Portal by <b>{letterData.responseDeadline}</b>.
                  </p>
                  <p>
                    Welcome to the RIT Tiger community! We look forward to your arrival on campus and your contributions to technological innovation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-800 text-justify">
                  {letterData.letterBody.slice(1).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              {/* 落款与亲笔签字 (支持双导师联合签署) */}
              <div className="mt-8 pt-4 border-t border-slate-200">
                <p className="text-xs font-serif text-slate-700 mb-2">Sincerely yours,</p>
                {letterData.signatoryName2 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="font-signature-formal text-3xl font-normal text-[#002244] tracking-wide py-1 select-none transform -rotate-1">
                        {letterData.signatoryName}
                      </div>
                      <p className="text-xs font-serif font-bold text-slate-900 mt-1">
                        {letterData.signatoryName}
                      </p>
                      <p className="text-[11px] font-serif text-slate-600 leading-snug">
                        {letterData.signatoryTitle}
                      </p>
                    </div>
                    <div>
                      <div className="font-signature-formal text-3xl font-normal text-[#002244] tracking-wide py-1 select-none transform -rotate-1">
                        {letterData.signatoryName2}
                      </div>
                      <p className="text-xs font-serif font-bold text-slate-900 mt-1">
                        {letterData.signatoryName2}
                      </p>
                      <p className="text-[11px] font-serif text-slate-600 leading-snug">
                        {letterData.signatoryTitle2}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-signature-formal text-3xl font-normal text-[#002244] tracking-wide py-1 select-none transform -rotate-1">
                      {letterData.signatoryName}
                    </div>
                    <p className="text-xs font-serif font-bold text-slate-900 mt-1">
                      {letterData.signatoryName}
                    </p>
                    <p className="text-[11px] font-serif text-slate-600 max-w-sm leading-snug">
                      {letterData.signatoryTitle}
                    </p>
                  </div>
                )}
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
