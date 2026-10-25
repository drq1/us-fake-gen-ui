"use client"

import React from "react"
import type { UniversityTranscriptData } from "@/lib/university-transcript-types"
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react"

interface UniversityTranscriptSheetProps {
  data: UniversityTranscriptData
  watermark: "OFFICIAL" | "ISSUED_TO_STUDENT" | "SAMPLE" | "NONE"
  isEditable?: boolean
  onUpdate?: (updated: UniversityTranscriptData) => void
}

export function UniversityTranscriptSheet({
  data,
  watermark,
  isEditable = false,
  onUpdate,
}: UniversityTranscriptSheetProps) {
  const handleChange = (field: keyof UniversityTranscriptData, val: unknown) => {
    if (!onUpdate) return
    onUpdate({
      ...data,
      [field]: val,
    })
  }

  const handleSemesterChange = (semIdx: number, field: string, val: unknown) => {
    if (!onUpdate) return
    const newSemesters = [...data.semesters]
    newSemesters[semIdx] = {
      ...newSemesters[semIdx],
      [field]: val,
    }
    onUpdate({
      ...data,
      semesters: newSemesters,
    })
  }

  const handleCourseChange = (semIdx: number, courseIdx: number, field: string, val: unknown) => {
    if (!onUpdate) return
    const newSemesters = [...data.semesters]
    const newCourses = [...newSemesters[semIdx].courses]
    newCourses[courseIdx] = {
      ...newCourses[courseIdx],
      [field]: val,
    }
    newSemesters[semIdx] = {
      ...newSemesters[semIdx],
      courses: newCourses,
    }
    onUpdate({
      ...data,
      semesters: newSemesters,
    })
  }

  return (
    <div
      id="printable-university-transcript"
      className="relative w-full max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-300 print:shadow-none print:border-none print:p-8 font-serif leading-tight selection:bg-blue-100"
      style={{ minHeight: "1100px" }}
    >
      {/* 水印层 */}
      {watermark !== "NONE" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
          <div className="transform -rotate-36 text-slate-200/40 font-sans font-black tracking-widest text-6xl sm:text-7xl uppercase border-8 border-dashed border-slate-200/40 p-8 rounded-3xl">
            {watermark === "OFFICIAL" && "OFFICIAL TRANSCRIPT"}
            {watermark === "ISSUED_TO_STUDENT" && "ISSUED TO STUDENT"}
            {watermark === "SAMPLE" && "SAMPLE COPY - VOID"}
          </div>
        </div>
      )}

      {/* 外围微缩安全防伪边框 */}
      <div className="relative border-4 border-double border-slate-800 p-4 sm:p-6 print:p-4 bg-[radial-gradient(#f8fafc_1px,transparent_1px)] [background-size:16px_16px]">
        {/* 顶部：院校抬头与教务长公章 */}
        <div className="border-b-2 border-slate-900 pb-3 text-center relative">
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-blue-900 flex items-center justify-center bg-blue-50 text-blue-950 font-sans font-bold text-xs sm:text-sm shrink-0">
              SEAL
            </div>
            <div>
              {isEditable ? (
                <input
                  type="text"
                  value={data.universityName}
                  onChange={(e) => handleChange("universityName", e.target.value)}
                  className="w-full text-center font-bold text-xl sm:text-2xl tracking-wide uppercase border-b border-blue-400 bg-blue-50/50"
                />
              ) : (
                <h1 className="font-bold text-xl sm:text-2xl tracking-wide uppercase text-slate-950">
                  {data.universityName}
                </h1>
              )}
              <div className="text-xs sm:text-sm uppercase tracking-widest text-slate-700 font-sans font-semibold mt-0.5">
                Office of the University Registrar · Academic Record
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-600 font-sans flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
            <span>{data.address}, {data.city}, {data.state} {data.zip}</span>
            <span>·</span>
            <span>Tel: {data.telephone}</span>
            <span>·</span>
            <span>IPEDS ID: {data.ipedsId}</span>
          </div>
        </div>

        {/* 学生与学位信息双栏 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 py-3 border-b border-slate-400 font-sans text-xs">
          {/* 左栏：学生个人识别信息 */}
          <div className="space-y-1 bg-slate-50/80 p-2.5 rounded border border-slate-200">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
              <span>Student Identification</span>
              <span className="text-[10px] text-slate-400 font-normal">CONFIDENTIAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Legal Name:</span>
              <span className="font-bold text-slate-900 font-serif text-sm">{data.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student ID (UID):</span>
              <span className="font-mono font-bold text-slate-900">{data.studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date of Birth:</span>
              <span className="font-mono">{data.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SSN (Masked):</span>
              <span className="font-mono">{data.ssnMasked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Record Issue Date:</span>
              <span>{data.dateIssued}</span>
            </div>
          </div>

          {/* 右栏：授予学位与学术地位 */}
          <div className="space-y-1 bg-slate-50/80 p-2.5 rounded border border-slate-200">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
              <span>Degree Conferred</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> OFFICIAL CONFERRAL
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Degree:</span>
              <span className="font-bold text-blue-900">{data.degreeConferred}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Major:</span>
              <span className="font-semibold text-slate-900">{data.major}</span>
            </div>
            {data.minor && (
              <div className="flex justify-between">
                <span className="text-slate-500">Minor:</span>
                <span>{data.minor}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Conferral Date:</span>
              <span className="font-semibold text-slate-900">{data.conferralDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Honors:</span>
              <span className="font-bold text-amber-700">{data.degreeHonors || "Honors Program"}</span>
            </div>
          </div>
        </div>

        {/* 核心学期成绩矩阵（4年 8个学期，按双栏呈现） */}
        <div className="py-3">
          <div className="text-center font-bold font-sans text-xs uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Complete Undergraduate Coursework Record
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.semesters.map((sem, sIdx) => (
              <div key={sem.term} className="border border-slate-300 rounded overflow-hidden text-xs font-sans">
                {/* 学期头 */}
                <div className="bg-slate-800 text-white px-2 py-1 flex items-center justify-between font-bold text-[11px]">
                  <span>{sem.term.toUpperCase()} ({sem.standing.toUpperCase()})</span>
                  {sem.honors && (
                    <span className="bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded text-[10px] font-bold">
                      {sem.honors}
                    </span>
                  )}
                </div>

                {/* 课程列表 */}
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                      <th className="py-1 pl-2 pr-1 font-semibold w-14">COURSE</th>
                      <th className="py-1 px-1 font-semibold">TITLE</th>
                      <th className="py-1 px-0.5 font-semibold text-center w-7">ATT</th>
                      <th className="py-1 px-0.5 font-semibold text-center w-7">ERN</th>
                      <th className="py-1 px-0.5 font-semibold text-center w-7">GRD</th>
                      <th className="py-1 pl-0.5 pr-2.5 font-semibold text-right w-12">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sem.courses.map((c, cIdx) => (
                      <tr key={c.code} className="hover:bg-slate-50">
                        <td className="py-0.5 pl-2 pr-1 font-mono font-semibold text-slate-800 whitespace-nowrap">
                          {c.code}
                        </td>
                        <td className="py-0.5 px-1 text-slate-700 truncate max-w-[130px] sm:max-w-[155px]" title={c.title}>
                          {c.title}
                        </td>
                        <td className="py-0.5 px-0.5 text-center font-mono">{c.creditsAttempted.toFixed(1)}</td>
                        <td className="py-0.5 px-0.5 text-center font-mono">{c.creditsEarned.toFixed(1)}</td>
                        <td className="py-0.5 px-0.5 text-center font-mono font-bold text-slate-900">
                          {isEditable ? (
                            <input
                              type="text"
                              value={c.grade}
                              onChange={(e) => handleCourseChange(sIdx, cIdx, "grade", e.target.value)}
                              className="w-6 text-center border border-blue-400 rounded bg-blue-50/50"
                            />
                          ) : (
                            c.grade
                          )}
                        </td>
                        <td className="py-0.5 pl-0.5 pr-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                          {c.gradePoints.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 学期总计 */}
                <div className="bg-slate-100/90 border-t border-slate-200 px-2 py-1 text-[10px] text-slate-600 flex justify-between font-mono">
                  <span>TERM GPA: <b className="text-slate-900">{sem.termGpa.toFixed(2)}</b></span>
                  <span>CUM GPA: <b className="text-blue-900">{sem.cumGpa.toFixed(2)}</b></span>
                  <span>EARN: {sem.cumEarned.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 终极总计与学术资质统计 */}
        <div className="mt-3 border-2 border-slate-800 p-3 bg-slate-50 font-sans text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center divide-x divide-slate-300">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Total Credits Attempted</div>
              <div className="text-base font-bold font-mono text-slate-900">{data.totalCreditsAttempted.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Total Credits Earned</div>
              <div className="text-base font-bold font-mono text-emerald-800">{data.totalCreditsEarned.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Total Quality Points</div>
              <div className="text-base font-bold font-mono text-slate-900">{data.totalGradePoints.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Final Cumulative GPA</div>
              <div className="text-base font-bold font-mono text-blue-900">{data.cumulativeGpa.toFixed(2)} / 4.00</div>
            </div>
          </div>
        </div>

        {/* 官方签字与机构防伪公章 */}
        <div className="mt-6 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
          {/* 左侧：机构认证与 FERPA 保密声明 */}
          <div className="max-w-md text-[10px] text-slate-500 leading-normal">
            <p className="font-semibold text-slate-700 mb-0.5">ACCREDITATION & SECURITY NOTICE:</p>
            <p>
              This official transcript is certified under the authority of the Family Educational Rights and Privacy Act (FERPA).
              Accredited by {data.accreditation}. Alteration or forgery of this academic record constitutes a federal violation.
            </p>
          </div>

          {/* 右侧：教务长手写签名与印鉴 */}
          <div className="flex items-center gap-4 shrink-0 text-center">
            <div className="relative">
              <div className="font-cursive text-2xl text-blue-950 italic select-none transform -rotate-3 font-bold">
                {data.registrarName}
              </div>
              <div className="border-t border-slate-800 w-48 mt-1 pt-0.5 font-bold text-[11px] text-slate-900">
                {data.registrarName}
              </div>
              <div className="text-[10px] text-slate-500">{data.registrarTitle}</div>
            </div>

            {/* 烫金/深蓝立体印章 */}
            <div className="h-16 w-16 rounded-full border-2 border-double border-blue-900 flex flex-col items-center justify-center p-1 bg-blue-50/60 shadow-xs text-blue-950 font-serif">
              <Award className="h-5 w-5 text-amber-600 mb-0.5" />
              <span className="text-[7px] font-bold uppercase tracking-tighter">OFFICIAL SEAL</span>
              <span className="text-[6px] tracking-widest uppercase">REGISTRAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
