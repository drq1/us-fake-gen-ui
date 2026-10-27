"use client"

import React from "react"
import type { UniversityTranscriptData } from "@/lib/university-transcript-types"
import { Award, CheckCircle2 } from "lucide-react"

interface NyuSternSheetProps {
  data: UniversityTranscriptData
  watermark: "OFFICIAL" | "ISSUED_TO_STUDENT" | "SAMPLE" | "NONE"
  isEditable?: boolean
  onUpdate?: (updated: UniversityTranscriptData) => void
}

export function NyuSternSheet({
  data,
  watermark,
  isEditable = false,
  onUpdate,
}: NyuSternSheetProps) {
  const leftSemesters = data.semesters.slice(0, Math.ceil(data.semesters.length / 2))
  const rightSemesters = data.semesters.slice(Math.ceil(data.semesters.length / 2))

  return (
    <div
      id="printable-university-transcript"
      className="relative w-full max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-300 print:shadow-none print:border-none print:p-6 font-sans leading-tight selection:bg-purple-100"
      style={{ minHeight: "1120px" }}
    >
      {/* 纽大斯特恩标志性 1:1 巨幅半透明 Unofficial 倾斜防伪水印 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
        <div className="transform -rotate-38 text-slate-300/35 font-serif font-black tracking-widest text-8xl sm:text-9xl uppercase">
          Unofficial
        </div>
      </div>

      {/* 附加官方水印 */}
      {watermark === "OFFICIAL" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
          <div className="transform -rotate-25 text-purple-900/10 font-black tracking-widest text-5xl uppercase border-4 border-dashed border-purple-900/15 p-6 rounded-2xl">
            OFFICIAL TRANSCRIPT · SECURE
          </div>
        </div>
      )}

      {/* 顶部：纽约大学与教务长抬头 */}
      <div className="border-b-2 border-[#57068c] pb-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-sm bg-[#57068c] text-white flex flex-col items-center justify-center font-serif font-black text-xs shadow-xs shrink-0">
            <span>NYU</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#57068c] uppercase">
              NEW YORK UNIVERSITY
            </h1>
            <div className="text-xs uppercase tracking-wider text-slate-700 font-bold">
              Office of the University Registrar · Academic Transcript
            </div>
            <div className="text-[10px] text-slate-500">
              383 Lafayette Street, New York, NY 10003 · Institution ID: 002785
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-600">
          <div className="font-bold text-slate-900">UNDERGRADUATE RECORD</div>
          <div>LEONARD N. STERN SCHOOL OF BUSINESS</div>
        </div>
      </div>

      {/* 学生元数据与学位授予双栏 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-[#57068c] uppercase border-b border-slate-200 pb-0.5">
            Student Identification
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Name:</span>
            <span className="font-bold text-slate-900">{data.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Student ID:</span>
            <span className="font-mono font-bold text-slate-900">N{data.studentId.replace(/\D/g, "").slice(0, 8) || "14892019"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Birthdate:</span>
            <span className="font-mono">{data.dob}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Print Date:</span>
            <span>{data.dateIssued}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-bold text-[#57068c] uppercase border-b border-slate-200 pb-0.5 flex items-center justify-between">
            <span>Degrees Conferred</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> CONFERRED
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Degree:</span>
            <span className="font-bold text-[#57068c]">{data.degreeConferred}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Confer Date:</span>
            <span className="font-semibold text-slate-900">{data.conferralDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Major / Plan:</span>
            <span className="font-semibold text-slate-900">{data.major}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Honors:</span>
            <span className="text-purple-800 font-bold">{data.degreeHonors || "Dean's Honor List"}</span>
          </div>
        </div>
      </div>

      {/* 纽大斯特恩双栏学期成绩表 (AHRS EHRS QHRS QPTS GPA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-300 pt-3 text-[11px]">
        {/* 左栏 */}
        <div className="space-y-3 sm:border-r sm:border-slate-200 sm:pr-3">
          {leftSemesters.map((sem) => (
            <div key={sem.term} className="border border-slate-200 rounded overflow-hidden">
              <div className="bg-[#57068c] text-white px-2 py-0.5 font-bold text-[10.5px] flex justify-between uppercase">
                <span>{sem.term}</span>
                <span>{sem.standing}</span>
              </div>
              <div className="bg-slate-100 text-slate-600 text-[9.5px] font-bold px-2 py-0.5 flex justify-between border-b border-slate-200">
                <span>COURSE / TITLE</span>
                <span>AHRS EHRS GRD PTS</span>
              </div>
              <div className="divide-y divide-slate-100 p-1">
                {sem.courses.map((c) => (
                  <div key={c.code} className="flex justify-between items-center text-[10px] py-0.5 hover:bg-purple-50/50">
                    <span className="truncate max-w-[170px]">
                      <b className="text-slate-900">{c.code}</b> {c.title}
                    </span>
                    <span className="shrink-0 font-mono font-semibold">
                      {c.creditsAttempted.toFixed(1)} {c.creditsEarned.toFixed(1)} <b className="text-purple-950">{c.grade}</b> {c.gradePoints.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-purple-50/60 px-2 py-0.5 text-[9.5px] font-mono text-slate-700 flex justify-between border-t border-purple-100">
                <span>TERM GPA: <b>{sem.termGpa.toFixed(2)}</b></span>
                <span>CUM GPA: <b className="text-[#57068c]">{sem.cumGpa.toFixed(2)}</b></span>
              </div>
            </div>
          ))}
        </div>

        {/* 右栏 */}
        <div className="space-y-3 sm:pl-1">
          {rightSemesters.map((sem) => (
            <div key={sem.term} className="border border-slate-200 rounded overflow-hidden">
              <div className="bg-[#57068c] text-white px-2 py-0.5 font-bold text-[10.5px] flex justify-between uppercase">
                <span>{sem.term}</span>
                <span>{sem.standing}</span>
              </div>
              <div className="bg-slate-100 text-slate-600 text-[9.5px] font-bold px-2 py-0.5 flex justify-between border-b border-slate-200">
                <span>COURSE / TITLE</span>
                <span>AHRS EHRS GRD PTS</span>
              </div>
              <div className="divide-y divide-slate-100 p-1">
                {sem.courses.map((c) => (
                  <div key={c.code} className="flex justify-between items-center text-[10px] py-0.5 hover:bg-purple-50/50">
                    <span className="truncate max-w-[170px]">
                      <b className="text-slate-900">{c.code}</b> {c.title}
                    </span>
                    <span className="shrink-0 font-mono font-semibold">
                      {c.creditsAttempted.toFixed(1)} {c.creditsEarned.toFixed(1)} <b className="text-purple-950">{c.grade}</b> {c.gradePoints.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-purple-50/60 px-2 py-0.5 text-[9.5px] font-mono text-slate-700 flex justify-between border-t border-purple-100">
                <span>TERM GPA: <b>{sem.termGpa.toFixed(2)}</b></span>
                <span>CUM GPA: <b className="text-[#57068c]">{sem.cumGpa.toFixed(2)}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 纽大官方总计栏 */}
      <div className="mt-4 p-2.5 bg-slate-100 rounded border border-slate-300 font-mono text-xs flex flex-wrap justify-between items-center">
        <div>ATTEMPTED HOURS: <b>{data.totalCreditsAttempted.toFixed(1)}</b></div>
        <div>EARNED HOURS: <b className="text-emerald-700">{data.totalCreditsEarned.toFixed(1)}</b></div>
        <div>QUALITY POINTS: <b>{data.totalGradePoints.toFixed(1)}</b></div>
        <div>CUMULATIVE GPA: <b className="text-[#57068c] text-sm">{data.cumulativeGpa.toFixed(2)}</b></div>
      </div>

      {/* 底部教务长签名与官方说明 */}
      <div className="mt-6 pt-3 border-t-2 border-[#57068c] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
        <div className="max-w-md leading-relaxed">
          <p className="font-bold text-slate-900 mb-0.5">NEW YORK UNIVERSITY · FERPA CERTIFIED</p>
          <p>
            This electronic transcript was generated directly from New York University official student information systems.
            In compliance with FERPA regulations, any unauthorized alteration or release voids this document.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-center">
          <div>
            <div className="font-serif italic text-2xl text-[#57068c] select-none font-bold">
              {data.registrarName}
            </div>
            <div className="border-t border-slate-800 w-44 pt-0.5 font-bold text-[11px] text-slate-900">
              {data.registrarName}
            </div>
            <div className="text-[10px] text-slate-500">University Registrar</div>
          </div>
          <div className="h-14 w-14 rounded-full border-2 border-[#57068c] flex flex-col items-center justify-center bg-purple-50 text-[#57068c] font-serif shadow-xs">
            <Award className="h-4 w-4 mb-0.5" />
            <span className="text-[6px] font-bold uppercase tracking-tighter">NYU SEAL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
