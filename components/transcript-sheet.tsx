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
  onChange?: (updated: StudentTranscript) => void
}

export function TranscriptSheet({
  data,
  isEditable = false,
  watermarkText = "OFFICIAL TRANSCRIPT",
  styleVariant = "standard",
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
      className="relative mx-auto w-full max-w-[860px] bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300 p-8 sm:p-10 font-serif selection:bg-blue-100 print:m-0 print:p-8 print:shadow-none print:border-none print:w-full print:max-w-none text-[11px] leading-tight"
      style={{ minHeight: "1100px" }}
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
        <div className="bg-[#003865] text-white px-3 py-2 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans rounded-xs shadow-xs">
          <div className="flex items-center gap-3">
            <ParchmentLogo className="h-6 w-auto" />
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
      <div className="border-b-2 border-slate-900 pb-3 text-center relative">
        {/* Duplicate 补发公章 (1:1 还原 High_School_Duplicate_Transcript.pdf) */}
        {styleVariant === "duplicate" && (
          <div className="absolute right-0 top-0 border-2 border-dashed border-red-600 text-red-600 px-2 py-0.5 font-sans font-black text-[10px] tracking-wider transform rotate-3 uppercase rounded bg-red-50/50">
            OFFICIAL DUPLICATE COPY
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-sans text-[10px] tracking-wider uppercase font-semibold">
            <ShieldCheck className="h-4 w-4 text-slate-800" />
            <span>Official Academic Document</span>
          </div>
          <div className="text-[10px] font-sans text-slate-600 font-medium">
            CEEB Code: <span className="font-mono font-bold text-slate-900">{data.ceebCode}</span> | NCES ID:{" "}
            <span className="font-mono font-bold text-slate-900">{data.ncesId}</span>
          </div>
        </div>

        {/* 学校官方题头主排版：左官方印章 + 中学校名 + 右学术纹章 */}
        <div className="flex items-center justify-between gap-4 my-2">
          {/* 左侧：官方高中印章 / 州教育厅印章 */}
          <div className="flex items-center justify-center shrink-0">
            <img
              src={getHighSchoolLogoUrl(data.schoolName, data.schoolState)}
              alt="High School Official Seal"
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain drop-shadow-sm"
            />
          </div>

          {/* 中间：学校名称与学区信息 */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wider text-slate-950 font-serif leading-tight">
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

            <p className="text-xs text-slate-800 font-sans font-bold mt-1 tracking-wide">
              {data.districtName}
            </p>

            <p className="text-[11px] text-slate-600 font-sans mt-0.5">
              {data.schoolAddress}, {data.schoolCity}, {data.schoolState} {data.schoolZip} · Tel: {data.schoolPhone}
            </p>
          </div>

          {/* 右侧：个性化定制高中学术纹章 */}
          <div className="flex items-center justify-center shrink-0">
            <HighSchoolAcademicCrest
              schoolName={data.schoolName}
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 drop-shadow-sm"
            />
          </div>
        </div>

        <div className="mt-2 inline-block bg-slate-900 text-white px-4 py-0.5 text-xs font-sans font-bold tracking-widest uppercase">
          Official High School Transcript
        </div>
      </div>

      {/* 第一行：学生信息与学业统计双栏网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 font-sans text-[11px]">
        {/* 左侧：学生个人身份信息 */}
        <div className="border border-slate-900 rounded-xs p-3 bg-slate-50/50 print:bg-transparent">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 flex items-center justify-between">
            <span>Student Identification</span>
            <span className="font-mono text-slate-500 font-normal">{data.studentId}</span>
          </h2>
          <div className="grid grid-cols-2 gap-y-1.5">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Legal Name:</span>
              <span className="font-bold text-xs text-slate-950 font-serif">{data.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Date of Birth:</span>
              <span className="font-semibold text-slate-900 font-mono">{data.dob}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Gender:</span>
              <span className="font-medium text-slate-900">{data.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Counselor:</span>
              <span className="font-medium text-slate-900">{data.counselorName}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200">
              <span className="text-slate-500 block text-[9px] uppercase">Diploma Awarded:</span>
              <span className="font-bold text-slate-900">{data.diplomaType}</span>
            </div>
          </div>
        </div>

        {/* 右侧：学业核心统计 */}
        <div className="border border-slate-900 rounded-xs p-3 bg-slate-50/50 print:bg-transparent">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 flex items-center justify-between">
            <span>Cumulative Academic Summary</span>
            <span className="text-emerald-700 font-bold text-[9px] flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Graduated
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-y-1.5">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Unweighted GPA (4.0):</span>
              <span className="font-bold text-sm text-blue-950 font-mono">{data.unweightedGpa.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Weighted GPA (5.0):</span>
              <span className="font-bold text-sm text-indigo-950 font-mono">{data.weightedGpa.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Class Rank:</span>
              <span className="font-semibold text-slate-900 font-mono">{data.classRank}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Total Credits Earned:</span>
              <span className="font-bold text-slate-900 font-mono">{data.totalCreditsEarned.toFixed(2)}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200">
              <span className="text-slate-500 block text-[9px] uppercase">Graduation Date:</span>
              <span className="font-bold text-slate-900 font-mono">{data.graduationDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 第二行：四年学业明细 (4-Year Academic History 2x2 网格) */}
      <div className="border-t-2 border-slate-900 pt-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-sans flex items-center justify-between">
          <span>Complete Secondary Coursework & Marks</span>
          <span className="text-[10px] text-slate-500 font-normal">H = Honors (+0.5) · AP = Advanced Placement (+1.0)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.academicYears.map((year, yrIdx) => (
            <div key={year.gradeLevel} className="border border-slate-800 rounded-xs overflow-hidden">
              {/* 年级小标题 */}
              <div className="bg-slate-900 text-white px-2.5 py-1 text-[10px] font-sans font-bold flex items-center justify-between">
                <span>{year.gradeLevel}</span>
                <span className="font-mono text-slate-300 font-normal">{year.schoolYear}</span>
              </div>

              {/* 课程明细表格 */}
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 font-sans text-slate-700 text-[9px]">
                    <th className="py-1 px-1.5 w-14">Code</th>
                    <th className="py-1 px-1.5">Course Description</th>
                    <th className="py-1 px-1 text-center w-7">S1</th>
                    <th className="py-1 px-1 text-center w-7">S2</th>
                    <th className="py-1 px-1 text-center w-8">Mark</th>
                    <th className="py-1 px-1.5 text-right w-9">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 font-sans">
                  {year.courses.map((c, cIdx) => (
                    <tr key={c.code + cIdx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-1 px-1.5 font-mono text-[9px] text-slate-500">{c.code}</td>
                      <td className="py-1 px-1.5 font-medium text-slate-900 truncate max-w-[190px]">
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
                      <td className="py-1 px-1 text-center font-bold font-mono text-slate-800">{c.sem1}</td>
                      <td className="py-1 px-1 text-center font-bold font-mono text-slate-800">{c.sem2}</td>
                      <td className="py-1 px-1 text-center font-bold font-mono text-blue-900 bg-blue-50/50">
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
                      <td className="py-1 px-1.5 text-right font-mono text-slate-700 font-medium">{c.credits.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300 bg-slate-50/70 font-sans text-[9px] font-bold text-slate-800">
                    <td colSpan={2} className="py-1 px-1.5">
                      Term Credits: <span className="font-mono">{year.termCredits.toFixed(2)}</span>
                    </td>
                    <td colSpan={4} className="py-1 px-1.5 text-right">
                      Term Weighted GPA: <span className="font-mono text-blue-900 text-[10px]">{year.termGpa.toFixed(2)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* 第三行：标化成绩、学术荣誉与评分对照表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 pt-3 border-t border-slate-300 text-[10px] font-sans">
        {/* 标化成绩 */}
        <div className="border border-slate-300 p-2.5 rounded-xs">
          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1 mb-1.5 uppercase text-[9px] tracking-wide">
            College Board Testing
          </span>
          {data.satScore && (
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600">SAT Reasoning Test:</span>
                <span className="font-bold text-slate-900">{data.satScore.total}</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>EBRW: {data.satScore.erw}</span>
                <span>Math: {data.satScore.math}</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                <span>ACT Composite:</span>
                <span className="font-bold font-mono text-slate-800">{data.actScore || 32}</span>
              </div>
            </div>
          )}
        </div>

        {/* 学术荣誉 */}
        <div className="border border-slate-300 p-2.5 rounded-xs">
          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1 mb-1.5 uppercase text-[9px] tracking-wide">
            Honors & Distinctions
          </span>
          <ul className="space-y-1 text-slate-700 text-[9px]">
            {data.honors.map((h, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-blue-700 font-bold">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 评分刻度机制 */}
        <div className="border border-slate-300 p-2.5 rounded-xs">
          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1 mb-1.5 uppercase text-[9px] tracking-wide">
            Grading Scale Legend
          </span>
          <div className="grid grid-cols-2 gap-x-2 text-[9px] font-mono text-slate-600">
            <div>A+ (97-100) 4.0</div>
            <div>B+ (87-89) 3.3</div>
            <div>A  (93-96)  4.0</div>
            <div>B  (83-86) 3.0</div>
            <div>A- (90-92)  3.7</div>
            <div>C  (73-76) 2.0</div>
          </div>
          <div className="mt-1 text-[8px] text-slate-500 italic">
            Passing Grade: D (65) · Credit = 1.0/year
          </div>
        </div>
      </div>

      {/* 底部：法定认证签署与官方印章 */}
      <div className="border-t-2 border-slate-900 pt-3 mt-4">
        <p className="text-[9px] text-slate-600 italic text-center font-serif mb-4">
          I hereby certify that this is a true, authentic, and complete official academic record of the student named above.
          Valid only with authorized signature and embossed institutional seal.
        </p>

        <div className="grid grid-cols-3 items-end gap-4 text-center">
          {/* 校长签署 */}
          <div className="flex flex-col items-center">
            <div className="h-9 flex items-end">
              <span className="font-signature-formal text-2xl text-[#001f3f] -rotate-2 select-none leading-none">
                {data.principalName}
              </span>
            </div>
            <div className="w-full border-t border-slate-900 mt-1 pt-1">
              <span className="font-sans text-[9px] uppercase font-bold text-slate-800 block">
                Principal Signature
              </span>
              <span className="font-sans text-[8px] text-slate-500">{data.principalName}</span>
            </div>
          </div>

          {/* 官方州教育厅 / 学区防伪钢印大印 */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <OfficialStateEducationSeal
              stateName={data.schoolState || "STATE"}
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 drop-shadow-sm"
              color="#991b1b"
            />
          </div>

          {/* 教务主任/注册处 */}
          <div className="flex flex-col items-center">
            <div className="h-9 flex items-end">
              <span className="font-signature-formal text-2xl text-[#001f3f] -rotate-1 select-none leading-none">
                {data.registrarName}
              </span>
            </div>
            <div className="w-full border-t border-slate-900 mt-1 pt-1">
              <span className="font-sans text-[9px] uppercase font-bold text-slate-800 block">
                Registrar / Date Issued
              </span>
              <span className="font-mono text-[8px] text-slate-600 font-semibold">{data.issueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
