"use client"

import React from "react"
import type { StudentTranscript, CourseRecord } from "@/lib/transcript-types"
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react"
import {
  ParchmentLogo,
  OfficialStateEducationSeal,
  HighSchoolAcademicCrest,
  getHighSchoolLogoUrl,
} from "@/components/brand-logos"

interface TranscriptSheetProps {
  data: StudentTranscript
  isEditable?: boolean
  watermarkText?: string
  styleVariant?: "standard" | "parchment" | "duplicate"
  sealStyle?: "crimson" | "color" | "gold"
  onChange?: (updated: StudentTranscript) => void
}

export function TranscriptSheet({
  data,
  isEditable = false,
  watermarkText = "OFFICIAL TRANSCRIPT",
  styleVariant = "standard",
  sealStyle = "crimson",
  onChange,
}: TranscriptSheetProps) {
  // 简易字段修改分发器
  const handleFieldChange = (field: keyof StudentTranscript, value: unknown) => {
    if (!onChange) return
    onChange({
      ...data,
      [field]: value,
    })
  }

  // 课程修改分发器
  const handleCourseChange = (
    yearIndex: number,
    courseIndex: number,
    field: keyof CourseRecord,
    val: string | number | boolean,
  ) => {
    if (!onChange) return
    const newYears = [...data.academicYears]
    const currentYear = { ...newYears[yearIndex] }
    const newCourses = [...currentYear.courses]
    newCourses[courseIndex] = {
      ...newCourses[courseIndex],
      [field]: val,
    }
    currentYear.courses = newCourses
    newYears[yearIndex] = currentYear
    onChange({
      ...data,
      academicYears: newYears,
    })
  }

  return (
    <div
      id="printable-transcript"
      className="relative mx-auto w-full max-w-[860px] bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300 p-6 sm:p-8 font-serif selection:bg-blue-100 print:m-0 print:p-3 print:pt-2 print:shadow-none print:border-none print:w-full print:max-w-none text-[11px] leading-tight break-inside-avoid print:break-inside-avoid"
    >
      {/* 防伪防盗背底浅色水印 */}
      {watermarkText && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.04] select-none print:opacity-[0.03]">
          <span className="text-[90px] font-black uppercase tracking-widest -rotate-30 text-slate-900 border-8 border-slate-900 px-12 py-4">
            {watermarkText}
          </span>
        </div>
      )}

      {/* Parchment 官方电子交付题头 (1:1 还原 High_School_Official_Record_Parchment.pdf) */}
      {styleVariant === "parchment" && (
        <div className="bg-[#003865] text-white px-3 py-1.5 mb-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans rounded-xs shadow-xs">
          <div className="flex items-center gap-3">
            <ParchmentLogo className="h-5.5 w-auto" />
            <span className="text-[10.5px] text-blue-100 font-medium">
              Official Secure Electronic Document Delivery
            </span>
          </div>
          <div className="text-[10px] font-mono text-blue-200">
            DOC-ID: {data.ceebCode}-E{data.studentId.replace(/\D/g, "").slice(0, 7) || "8849201"} · DIGITALLY CERTIFIED
          </div>
        </div>
      )}

      {/* 顶部：学校官方抬头 */}
      <div className="border-b-2 border-slate-900 pb-2 text-center relative">
        {/* Duplicate 补发公章 (1:1 还原 High_School_Duplicate_Transcript.pdf) */}
        {styleVariant === "duplicate" && (
          <div className="absolute right-0 top-0 border-2 border-dashed border-red-600 text-red-600 px-2 py-0.5 font-sans font-black text-[10px] tracking-wider transform rotate-3 uppercase rounded bg-red-50/50">
            OFFICIAL DUPLICATE COPY
          </div>
        )}

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-slate-700 font-sans text-[10px] tracking-wider uppercase font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-800" />
            <span>Official Academic Document</span>
          </div>
          <div className="text-[10px] font-sans text-slate-600 font-medium">
            CEEB Code: <span className="font-mono font-bold text-slate-900">{data.ceebCode}</span> | NCES ID:{" "}
            <span className="font-mono font-bold text-slate-900">{data.ncesId}</span>
          </div>
        </div>

        {/* 学校官方题头主排版：左官方印章 + 中学校名 + 右学术纹章 */}
        <div className="flex items-center justify-between gap-3 my-1.5">
          {/* 左侧：官方高中印章 / 州教育厅印章 */}
          <div className="flex items-center justify-center shrink-0">
            <img
              src={getHighSchoolLogoUrl(data.schoolName, data.schoolState)}
              alt="High School Official Seal"
              className="h-18 w-18 sm:h-22 sm:w-22 print:h-17 print:w-17 object-contain drop-shadow-sm"
            />
          </div>

          {/* 中间：学校名称与学区信息 */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-xl sm:text-2xl print:text-xl font-black uppercase tracking-wider text-slate-950 font-serif leading-tight">
              {isEditable ? (
                <input
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => handleFieldChange("schoolName", e.target.value)}
                  className="w-full text-center bg-transparent border-b border-dashed border-blue-400 focus:outline-none"
                />
              ) : (
                data.schoolName
              )}
            </h1>

            <p className="text-xs print:text-[10.5px] text-slate-800 font-sans font-bold mt-0.5 tracking-wide">
              {data.districtName}
            </p>

            <p className="text-[10.5px] print:text-[9.5px] text-slate-600 font-sans mt-0.5">
              {data.schoolAddress}, {data.schoolCity}, {data.schoolState} {data.schoolZip} · Tel: {data.schoolPhone}
            </p>
          </div>

          {/* 右侧：个性化定制高中学术纹章 */}
          <div className="flex items-center justify-center shrink-0">
            <HighSchoolAcademicCrest
              schoolName={data.schoolName}
              className="h-18 w-18 sm:h-22 sm:w-22 print:h-17 print:w-17 drop-shadow-sm"
            />
          </div>
        </div>

        <div className="mt-1 inline-block bg-slate-900 text-white px-3.5 py-0.5 text-xs font-sans font-bold tracking-widest uppercase">
          Official High School Transcript
        </div>
      </div>

      {/* 第一行：学生信息与学业统计双栏网格 (锁定 2 列并排，防止打印折行) */}
      <div className="grid grid-cols-2 gap-3 my-2 print:my-1.5 font-sans text-[10px]">
        {/* 左侧：学生个人身份信息 */}
        <div className="border border-slate-900 rounded-xs p-2.5 print:p-2 bg-slate-50/50 print:bg-transparent">
          <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-0.5 mb-1 flex items-center justify-between">
            <span>Student Identification</span>
            <span className="font-mono text-slate-500 font-normal">{data.studentId}</span>
          </h2>
          <div className="grid grid-cols-2 gap-y-0.5">
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Legal Name:</span>
              <span className="font-bold text-xs text-slate-950 font-serif">{data.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Date of Birth:</span>
              <span className="font-semibold text-slate-900 font-mono text-[10px]">{data.dob}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Gender:</span>
              <span className="font-medium text-slate-900 text-[10px]">{data.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Counselor:</span>
              <span className="font-medium text-slate-900 text-[10px]">{data.counselorName}</span>
            </div>
            <div className="col-span-2 pt-0.5 border-t border-slate-200">
              <span className="text-slate-500 block text-[8.5px] uppercase">Diploma Awarded:</span>
              <span className="font-bold text-slate-900 text-[10px]">{data.diplomaType}</span>
            </div>
          </div>
        </div>

        {/* 右侧：学业核心统计 */}
        <div className="border border-slate-900 rounded-xs p-2.5 print:p-2 bg-slate-50/50 print:bg-transparent">
          <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-0.5 mb-1 flex items-center justify-between">
            <span>Cumulative Academic Summary</span>
            <span className="text-emerald-700 font-bold text-[8.5px] flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Graduated
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-y-0.5">
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Unweighted GPA (4.0):</span>
              <span className="font-bold text-sm text-blue-950 font-mono">{data.unweightedGpa.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Weighted GPA (5.0):</span>
              <span className="font-bold text-sm text-indigo-950 font-mono">{data.weightedGpa.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Class Rank:</span>
              <span className="font-semibold text-slate-900 font-mono text-[10px]">{data.classRank}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px] uppercase">Total Credits Earned:</span>
              <span className="font-bold text-slate-900 font-mono text-[10px]">{data.totalCreditsEarned.toFixed(2)}</span>
            </div>
            <div className="col-span-2 pt-0.5 border-t border-slate-200">
              <span className="text-slate-500 block text-[8.5px] uppercase">Graduation Date:</span>
              <span className="font-bold text-slate-900 font-mono text-[10px]">{data.graduationDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 第二行：四年学业明细 (4-Year Academic History 2x2 网格，锁定 2 列) */}
      <div className="border-t-2 border-slate-900 pt-2 print:pt-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 font-sans flex items-center justify-between">
          <span>Complete Secondary Coursework & Marks</span>
          <span className="text-[9px] text-slate-500 font-normal">H = Honors (+0.5) · AP = Advanced Placement (+1.0)</span>
        </h2>

        <div className="grid grid-cols-2 gap-2.5 print:gap-2">
          {data.academicYears.map((year, yrIdx) => (
            <div key={year.gradeLevel} className="border border-slate-800 rounded-xs overflow-hidden">
              {/* 年级小标题 */}
              <div className="bg-slate-900 text-white px-2 py-0.5 text-[9.5px] font-sans font-bold flex items-center justify-between">
                <span>{year.gradeLevel}</span>
                <span className="font-mono text-slate-300 font-normal">{year.schoolYear}</span>
              </div>

              {/* 课程明细表格 */}
              <table className="w-full text-left border-collapse text-[9.5px] leading-tight">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 font-sans text-slate-700 text-[8.5px]">
                    <th className="py-0.5 px-1.5 w-12">Code</th>
                    <th className="py-0.5 px-1">Course Description</th>
                    <th className="py-0.5 px-0.5 text-center w-6">S1</th>
                    <th className="py-0.5 px-0.5 text-center w-6">S2</th>
                    <th className="py-0.5 px-0.5 text-center w-7">Mark</th>
                    <th className="py-0.5 px-1.5 text-right w-8">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 font-sans">
                  {year.courses.map((c, cIdx) => (
                    <tr key={c.code + cIdx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-0.5 print:py-[2px] px-1.5 font-mono text-[8.5px] text-slate-500">{c.code}</td>
                      <td className="py-0.5 print:py-[2px] px-1 font-medium text-slate-900 truncate max-w-[170px]">
                        {isEditable ? (
                          <input
                            type="text"
                            value={c.title}
                            onChange={(e) => handleCourseChange(yrIdx, cIdx, "title", e.target.value)}
                            className="w-full bg-transparent border-b border-dashed border-slate-300 focus:outline-none"
                          />
                        ) : (
                          c.title
                        )}
                      </td>
                      <td className="py-0.5 print:py-[2px] px-0.5 text-center font-bold font-mono text-slate-800">{c.sem1}</td>
                      <td className="py-0.5 print:py-[2px] px-0.5 text-center font-bold font-mono text-slate-800">{c.sem2}</td>
                      <td className="py-0.5 print:py-[2px] px-0.5 text-center font-bold font-mono text-blue-900 bg-blue-50/50 print:bg-transparent">
                        {isEditable ? (
                          <input
                            type="text"
                            value={c.finalGrade}
                            onChange={(e) => handleCourseChange(yrIdx, cIdx, "finalGrade", e.target.value)}
                            className="w-5 text-center bg-transparent border-b border-dashed border-blue-400 focus:outline-none font-bold"
                          />
                        ) : (
                          c.finalGrade
                        )}
                      </td>
                      <td className="py-0.5 print:py-[2px] px-1.5 text-right font-mono text-slate-700 font-medium">{c.credits.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300 bg-slate-50/70 print:bg-transparent font-sans text-[8.5px] font-bold text-slate-800">
                    <td colSpan={2} className="py-0.5 px-1.5">
                      Term Credits: <span className="font-mono">{year.termCredits.toFixed(2)}</span>
                    </td>
                    <td colSpan={4} className="py-0.5 px-1.5 text-right">
                      Term Weighted GPA: <span className="font-mono text-blue-900 text-[9px]">{year.termGpa.toFixed(2)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* 第三行：标化成绩、学术荣誉与评分对照表 (锁定 3 列并排网格) */}
      <div className="grid grid-cols-3 gap-2.5 my-2 print:my-1.5 pt-2 border-t border-slate-300 text-[9.5px] font-sans">
        {/* 标化成绩 */}
        <div className="border border-slate-300 p-2.5 print:p-2 rounded-xs">
          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5 mb-1 uppercase text-[8.5px] tracking-wide">
            College Board Testing
          </span>
          {data.satScore && (
            <div className="space-y-0.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600">SAT Reasoning Test:</span>
                <span className="font-bold text-slate-900">{data.satScore.total}</span>
              </div>
              <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                <span>EBRW: {data.satScore.erw}</span>
                <span>Math: {data.satScore.math}</span>
              </div>
              <div className="flex justify-between text-[8.5px] text-slate-500 pt-0.5 border-t border-slate-100">
                <span>ACT Composite:</span>
                <span className="font-bold font-mono text-slate-800">{data.actScore || 32}</span>
              </div>
            </div>
          )}
        </div>

        {/* 学术荣誉 */}
        <div className="border border-slate-300 p-2.5 print:p-2 rounded-xs">
          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5 mb-1 uppercase text-[8.5px] tracking-wide">
            Honors & Distinctions
          </span>
          <ul className="space-y-0.5 text-slate-700 text-[8.5px]">
            {data.honors.map((h, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-blue-700 font-bold">•</span>
                <span className="truncate">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 评分刻度机制 */}
        <div className="border border-slate-300 p-2.5 print:p-2 rounded-xs">
          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5 mb-1 uppercase text-[8.5px] tracking-wide">
            Grading Scale Legend
          </span>
          <div className="grid grid-cols-2 gap-x-2 text-[8.5px] font-mono text-slate-600">
            <div>A+ (97-100) 4.0</div>
            <div>B+ (87-89) 3.3</div>
            <div>A  (93-96)  4.0</div>
            <div>B  (83-86) 3.0</div>
            <div>A- (90-92)  3.7</div>
            <div>C  (73-76) 2.0</div>
          </div>
          <div className="mt-0.5 text-[7.5px] text-slate-500 italic">
            Passing Grade: D (65) · Credit = 1.0/year
          </div>
        </div>
      </div>

      {/* 底部：法定认证签署与官方印章 */}
      <div className="border-t-2 border-slate-900 pt-2 print:pt-1.5 mt-2 print:mt-1.5 break-inside-avoid print:break-inside-avoid">
        <p className="text-[9px] text-slate-600 italic text-center font-serif mb-2 print:mb-1.5">
          I hereby certify that this is a true, authentic, and complete official academic record of the student named above.
          Valid only with authorized signature and embossed institutional seal.
        </p>

        <div className="grid grid-cols-3 items-end gap-3 text-center">
          {/* 校长签署 */}
          <div className="flex flex-col items-center">
            <div className="h-9 flex items-end">
              <span className="font-signature-formal text-2xl text-[#001f3f] -rotate-2 select-none leading-none">
                {data.principalName}
              </span>
            </div>
            <div className="w-full border-t border-slate-900 mt-1 pt-0.5">
              <span className="font-sans text-[8.5px] uppercase font-bold text-slate-800 block">
                Principal Signature
              </span>
              <span className="font-sans text-[8px] text-slate-500">{data.principalName}</span>
            </div>
          </div>

          {/* 官方州教育厅 / 官方注册处正规大印 (支持酒红印泥公章 / 官方全彩 / 烫金钢印) */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {sealStyle === "crimson" ? (
              /* 1. 美高纸质正件最常用：教务处酒红/深红印泥印鉴 (Crimson Inked Stamp) */
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative rounded-full p-1 border-3 border-double border-[#991b1b] bg-red-50/20 shadow-xs">
                  <img
                    src={getHighSchoolLogoUrl(data.schoolName, data.schoolState)}
                    alt="Official Accredited Registrar Seal"
                    className="h-18 w-18 sm:h-20 sm:w-20 print:h-18 print:w-18 object-contain filter contrast-150 sepia hue-rotate-[320deg] brightness-75"
                  />
                </div>
                <span className="text-[7px] font-sans font-black text-[#991b1b] uppercase tracking-widest mt-0.5">
                  OFFICIAL REGISTRAR EMBOSSED SEAL
                </span>
              </div>
            ) : sealStyle === "gold" ? (
              /* 2. 纸质毕业档：烫金防伪齿轮钢印 (Gold Foil Embossed Notary Seal) */
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative rounded-full p-1 border-3 border-dashed border-[#b45309] bg-amber-50/40 shadow-xs">
                  <img
                    src={getHighSchoolLogoUrl(data.schoolName, data.schoolState)}
                    alt="Official Accredited Registrar Seal"
                    className="h-18 w-18 sm:h-20 sm:w-20 print:h-18 print:w-18 object-contain filter contrast-125 sepia hue-rotate-[10deg] brightness-90"
                  />
                </div>
                <span className="text-[7px] font-sans font-black text-[#b45309] uppercase tracking-widest mt-0.5">
                  OFFICIAL GOLD EMBOSSED NOTARY
                </span>
              </div>
            ) : (
              /* 3. 现代电子交付档 (Parchment / Digital Delivery)：全彩官方州徽 */
              <div className="relative flex flex-col items-center justify-center">
                <img
                  src={getHighSchoolLogoUrl(data.schoolName, data.schoolState)}
                  alt="Official Accredited Registrar Seal"
                  className="h-18 w-18 sm:h-20 sm:w-20 print:h-18 print:w-18 object-contain drop-shadow-md"
                />
                <span className="text-[7.5px] font-sans font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                  OFFICIAL EMBOSSED SEAL
                </span>
              </div>
            )}
          </div>

          {/* 教务主任/注册处 */}
          <div className="flex flex-col items-center">
            <div className="h-9 flex items-end">
              <span className="font-signature-formal text-2xl text-[#001f3f] -rotate-1 select-none leading-none">
                {data.registrarName}
              </span>
            </div>
            <div className="w-full border-t border-slate-900 mt-1 pt-0.5">
              <span className="font-sans text-[8.5px] uppercase font-bold text-slate-800 block">
                Registrar / Date Issued
              </span>
              <span className="font-mono text-[8px] text-slate-600 font-semibold">{data.issueDate}</span>
            </div>
          </div>
        </div>

        {/* 底部微缩防伪安全说明栏 (1:1 还原真实成绩单纸张底部防伪条) */}
        <div className="mt-2.5 pt-1 border-t border-slate-300 flex items-center justify-between text-[7.5px] font-mono text-slate-500 uppercase tracking-tight">
          <span>SECURE DOCUMENT EMBEDDED WITH SECURITY WATERMARK · ALTERATION OR REPRODUCTION IS STRICTLY PROHIBITED</span>
          <span>FERPA COMPLIANT · OFFICIAL SECONDARY SCHOOL RECORD · PAGE 1 OF 1</span>
        </div>
      </div>
    </div>
  )
}
