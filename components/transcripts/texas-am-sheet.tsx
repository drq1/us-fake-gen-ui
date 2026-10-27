"use client"

import React from "react"
import type { UniversityTranscriptData } from "@/lib/university-transcript-types"
import { Award, ShieldCheck } from "lucide-react"
import { TexasAmOfficialSeal } from "@/components/brand-logos"

interface TexasAmSheetProps {
  data: UniversityTranscriptData
  watermark: "OFFICIAL" | "ISSUED_TO_STUDENT" | "SAMPLE" | "NONE"
  isEditable?: boolean
  onUpdate?: (updated: UniversityTranscriptData) => void
}

export function TexasAmSheet({
  data,
  watermark,
  isEditable = false,
  onUpdate,
}: TexasAmSheetProps) {
  const leftSemesters = data.semesters.slice(0, Math.ceil(data.semesters.length / 2))
  const rightSemesters = data.semesters.slice(Math.ceil(data.semesters.length / 2))

  return (
    <div
      id="printable-university-transcript"
      className="relative w-full max-w-[850px] mx-auto bg-[#fdf2f4] text-slate-900 shadow-2xl rounded-sm p-6 sm:p-9 border-4 border-double border-[#7c1d30] print:shadow-none print:p-6 font-mono leading-tight selection:bg-rose-100"
      style={{ minHeight: "1120px" }}
    >
      {/* 德州农工粉色防伪底纹微缩网点 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d88b9a_1px,transparent_1px)] [background-size:12px_12px] opacity-40 print:opacity-30" />

      {/* 居中半透明德州农工官方巨幅印章水印 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0 select-none">
        <div className="h-96 w-96 rounded-full border-8 border-dashed border-[#500000]/10 flex flex-col items-center justify-center text-[#500000]/12 font-serif font-black">
          <div className="text-6xl font-bold">ATM</div>
          <div className="text-sm tracking-widest uppercase mt-2">TEXAS A&M UNIVERSITY</div>
          <div className="text-xs tracking-widest mt-1">1876</div>
        </div>
      </div>

      {/* 附加水印层 */}
      {watermark !== "NONE" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
          <div className="transform -rotate-36 text-rose-900/15 font-black tracking-widest text-6xl uppercase border-8 border-dashed border-rose-900/15 p-8 rounded-3xl">
            {watermark === "OFFICIAL" && "OFFICIAL TRANSCRIPT"}
            {watermark === "ISSUED_TO_STUDENT" && "ISSUED TO STUDENT"}
            {watermark === "SAMPLE" && "SAMPLE COPY - VOID"}
          </div>
        </div>
      )}

      {/* 核心票据内容区域 */}
      <div className="relative z-1">
        {/* 顶部：德州农工官方抬头 */}
        <div className="text-center border-b-2 border-[#500000] pb-3 mb-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-[#500000] uppercase">
            TEXAS A&M UNIVERSITY
          </h1>
          <div className="text-xs font-bold tracking-wider text-slate-800 uppercase mt-0.5">
            OFFICE OF THE REGISTRAR · P.O. BOX 30014 · COLLEGE STATION, TEXAS 77842-4014
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            PHONE: (979) 845-1003 · FICE CODE: 003632 · OFFICIAL SECURITY TRANSCRIPT
          </div>
        </div>

        {/* 学生档案元数据网格 (打字机对齐风格) */}
        <div className="border border-slate-400 bg-white/70 p-3 rounded-xs text-[11px] mb-4 space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">RECORD OF:</span>
              <span className="font-bold text-slate-950 uppercase">{data.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">STUDENT UIN:</span>
              <span className="font-bold text-slate-950">{data.studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">DATE OF BIRTH:</span>
              <span>{data.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">SSN (MASKED):</span>
              <span>{data.ssnMasked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">DEGREE AWARDED:</span>
              <span className="font-bold text-[#500000]">{data.degreeConferred.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">DATE CONFERRED:</span>
              <span className="font-bold text-slate-950">{data.conferralDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">MAJOR:</span>
              <span className="font-bold text-slate-950 uppercase">{data.major}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">ACADEMIC HONORS:</span>
              <span className="text-rose-900 font-bold">{data.degreeHonors || "DISTINGUISHED STUDENT"}</span>
            </div>
          </div>
        </div>

        {/* 1:1 双栏打字机排版课程记录 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-400 py-3 text-[10.5px]">
          {/* 左栏 */}
          <div className="space-y-4 sm:border-r sm:border-slate-300 sm:pr-3">
            {leftSemesters.map((sem) => (
              <div key={sem.term} className="space-y-1">
                <div className="bg-[#500000] text-white px-2 py-0.5 text-[10px] font-bold flex justify-between uppercase">
                  <span>{sem.term}</span>
                  <span>{sem.standing}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-bold border-b border-slate-300 pb-0.5 flex justify-between">
                  <span>COURSE & TITLE</span>
                  <span>CRD GRD PTS</span>
                </div>
                {sem.courses.map((c) => (
                  <div key={c.code} className="flex justify-between items-center text-[10px] hover:bg-rose-50/50">
                    <span className="truncate max-w-[190px]">
                      <b className="text-slate-900">{c.code}</b> {c.title}
                    </span>
                    <span className="shrink-0 font-bold">
                      {c.creditsEarned.toFixed(1)} {c.grade} {c.gradePoints.toFixed(1)}
                    </span>
                  </div>
                ))}
                <div className="text-[9.5px] text-slate-600 border-t border-dotted border-slate-300 pt-0.5 flex justify-between font-bold">
                  <span>TERM GPA: {sem.termGpa.toFixed(3)}</span>
                  <span>CUM GPA: {sem.cumGpa.toFixed(3)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 右栏 */}
          <div className="space-y-4 sm:pl-1">
            {rightSemesters.map((sem) => (
              <div key={sem.term} className="space-y-1">
                <div className="bg-[#500000] text-white px-2 py-0.5 text-[10px] font-bold flex justify-between uppercase">
                  <span>{sem.term}</span>
                  <span>{sem.standing}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-bold border-b border-slate-300 pb-0.5 flex justify-between">
                  <span>COURSE & TITLE</span>
                  <span>CRD GRD PTS</span>
                </div>
                {sem.courses.map((c) => (
                  <div key={c.code} className="flex justify-between items-center text-[10px] hover:bg-rose-50/50">
                    <span className="truncate max-w-[190px]">
                      <b className="text-slate-900">{c.code}</b> {c.title}
                    </span>
                    <span className="shrink-0 font-bold">
                      {c.creditsEarned.toFixed(1)} {c.grade} {c.gradePoints.toFixed(1)}
                    </span>
                  </div>
                ))}
                <div className="text-[9.5px] text-slate-600 border-t border-dotted border-slate-300 pt-0.5 flex justify-between font-bold">
                  <span>TERM GPA: {sem.termGpa.toFixed(3)}</span>
                  <span>CUM GPA: {sem.cumGpa.toFixed(3)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 终极统计栏与成绩结束标记 */}
        <div className="my-3 p-2 bg-white/80 border border-slate-300 flex flex-wrap items-center justify-between text-xs font-bold">
          <div>TOTAL ATTEMPTED: {data.totalCreditsAttempted.toFixed(1)}</div>
          <div>TOTAL EARNED: {data.totalCreditsEarned.toFixed(1)}</div>
          <div>QUALITY POINTS: {data.totalGradePoints.toFixed(1)}</div>
          <div className="text-[#500000]">OVERALL GPA: {data.cumulativeGpa.toFixed(3)}</div>
        </div>

        <div className="text-center font-bold text-xs tracking-widest text-slate-500 my-2">
          *** END OF TRANSCRIPT · TEXAS A&M UNIVERSITY ***
        </div>

        {/* 底部教务长签名与官方圆章 (1:1 还原 Venesa A. Heidick 签名实物) */}
        <div className="mt-4 pt-3 border-t-2 border-[#500000] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <div className="max-w-md text-slate-600 leading-snug">
            <p className="font-bold text-[#500000] mb-0.5">AUTHENTICITY & SECURITY FEATURES:</p>
            <p>
              This official transcript is printed on pink security paper and requires no raised seal. In accordance with
              FERPA, this document cannot be released to a third party without student consent.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-center">
            <div>
              <div className="font-signature-formal text-3xl text-[#1a237e] select-none py-0.5 transform -rotate-2">
                Venesa A. Heidick
              </div>
              <div className="border-t border-slate-800 w-44 pt-0.5 font-bold text-[11px] text-slate-900">
                Venesa A. Heidick
              </div>
              <div className="text-[10px] text-slate-600">Registrar</div>
            </div>

            {/* 德州农工官方酒红圆形教务印章 */}
            <TexasAmOfficialSeal className="h-16 w-16 shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}
