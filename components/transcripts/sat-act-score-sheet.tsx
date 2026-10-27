"use client"

import React, { useState } from "react"
import type { SatActReportData } from "@/lib/sat-act-types"
import { Award, CheckCircle2, TrendingUp, Check } from "lucide-react"
import { CollegeBoardLogo, ActLogo } from "@/components/brand-logos"

interface SatActScoreSheetProps {
  data: SatActReportData
  initialType?: "SAT" | "ACT"
}

export function SatActScoreSheet({ data, initialType = "SAT" }: SatActScoreSheetProps) {
  const [reportType, setReportType] = useState<"SAT" | "ACT">(initialType)

  return (
    <div className="w-full max-w-[850px] mx-auto space-y-4">
      {/* 顶部报告格式切换标签 */}
      <div className="flex justify-center print:hidden">
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 text-xs shadow-xs">
          <button
            onClick={() => setReportType("SAT")}
            className={`px-4 py-1.5 rounded-md font-bold transition-all ${
              reportType === "SAT" ? "bg-[#0077c8] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            College Board SAT 官方考试成绩单 (1:1 原件)
          </button>
          <button
            onClick={() => setReportType("ACT")}
            className={`px-4 py-1.5 rounded-md font-bold transition-all ${
              reportType === "ACT" ? "bg-[#002f6c] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ACT 官方学生考试成绩单 (1:1 矢量原件)
          </button>
        </div>
      </div>

      {/* 1. College Board SAT 官方报告 (1:1 还原 SAT_Official_Score_Report.png) */}
      {reportType === "SAT" && (
        <div
          id="printable-sat-report"
          className="relative bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-300 font-sans leading-tight selection:bg-blue-100 print:shadow-none print:border-none print:p-6"
          style={{ minHeight: "1100px" }}
        >
          {/* 顶栏：College Board 标志性官方题头 */}
          <div className="border-b-4 border-[#0077c8] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CollegeBoardLogo className="h-10 w-auto" />
              <div className="border-l-2 border-slate-300 pl-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  SAT® Score Report
                </h1>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600 font-mono">
              <div className="font-bold text-slate-900">TEST DATE: {data.sat.testDate.toUpperCase()}</div>
              <div>REGISTRATION #: {data.sat.registrationNumber}</div>
            </div>
          </div>

          {/* 考生信息与成绩主卡 */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 my-6">
            {/* 左侧：考生个人与学校档案 (5 列) */}
            <div className="sm:col-span-5 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="text-[11px] font-bold text-[#0077c8] uppercase border-b border-slate-200 pb-1 mb-2">
                Student & Testing Information
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Legal Name:</span>
                <span className="font-bold text-slate-900">{data.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sex / Gender:</span>
                <span>{data.sat.sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-mono">{data.sat.dob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mailing Address:</span>
                <span className="truncate max-w-[150px]">{data.address}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Attending High School:</div>
                <div className="font-bold text-slate-900 mt-0.5">{data.sat.highSchoolName}</div>
                <div className="text-slate-500 font-mono">School Code: {data.sat.highSchoolCode}</div>
              </div>
            </div>

            {/* 右侧：SAT 巨幅总分主卡 (7 列) */}
            <div className="sm:col-span-7 bg-gradient-to-br from-[#0077c8]/10 via-blue-50 to-white p-5 rounded-lg border-2 border-[#0077c8] flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-[#0077c8] flex items-center justify-between">
                  <span>Your Total Score</span>
                  <span className="bg-[#0077c8] text-white px-2 py-0.5 rounded text-[10px]">
                    OFFICIAL
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <div className="text-6xl font-black text-slate-950 font-mono tracking-tight">
                    {data.sat.totalScore}
                  </div>
                  <div className="text-slate-500 font-bold text-lg">/ 1600</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-2xl font-black text-[#0077c8] font-mono">
                    {data.sat.nationalPercentile}th
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">Nationally Representative Percentile</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {data.sat.userPercentile}th
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">SAT User Percentile - National</div>
                </div>
              </div>
            </div>
          </div>

          {/* 两个分项科目成绩卡 (Reading/Writing + Math) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Reading and Writing */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">
                Evidence-Based Reading and Writing
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 font-mono">{data.sat.erwScore}</span>
                <span className="text-slate-500 text-xs">200–800</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                <Check className="h-4 w-4" /> Meets or Exceeds College Readiness Benchmark (480)
              </div>
              <div className="text-[11px] text-slate-600 pt-1 flex justify-between font-mono">
                <span>Reading Test: <b>{data.sat.readingScore}</b> (10–40)</span>
                <span>Writing Test: <b>{data.sat.writingScore}</b> (10–40)</span>
              </div>
            </div>

            {/* Math */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">
                Mathematics Section
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 font-mono">{data.sat.mathScore}</span>
                <span className="text-slate-500 text-xs">200–800</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                <Check className="h-4 w-4" /> Meets or Exceeds College Readiness Benchmark (530)
              </div>
              <div className="text-[11px] text-slate-600 pt-1 flex justify-between font-mono">
                <span>Math Test: <b>{data.sat.mathCrossScore}</b> (10–40)</span>
                <span>Benchmark Status: <b>MET</b></span>
              </div>
            </div>
          </div>

          {/* 官方验证与说明 */}
          <div className="mt-8 pt-4 border-t-2 border-slate-300 text-[10.5px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="max-w-lg leading-relaxed">
              <p className="font-bold text-slate-700 mb-0.5">COLLEGE BOARD VERIFIED CREDENTIAL</p>
              <p>
                This official student score report is issued under the authority of the College Board. Scores are certified
                valid for undergraduate admissions, scholarship eligibility, and NCAA initial-eligibility clearinghouse.
              </p>
            </div>
            <div className="h-12 w-12 rounded-full border-2 border-[#0077c8] flex flex-col items-center justify-center text-[#0077c8] font-bold text-[7px] shrink-0">
              <Award className="h-4 w-4 mb-0.5" />
              <span>COLLEGE</span>
              <span>BOARD</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACT 官方考试成绩单 (1:1 还原 ACT_Official_Student_Score_Report.pdf) */}
      {reportType === "ACT" && (
        <div
          id="printable-act-report"
          className="relative bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-300 font-sans leading-tight selection:bg-blue-100 print:shadow-none print:border-none print:p-6"
          style={{ minHeight: "1100px" }}
        >
          {/* 顶栏：ACT 标志性官方题头 */}
          <div className="border-b-4 border-[#002f6c] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ActLogo className="h-10 w-auto shadow-xs" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#002f6c] tracking-tight">
                  ACT® Student Score Report
                </h1>
                <div className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                  Official College Readiness Examination Record
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600 font-mono">
              <div className="font-bold text-slate-900">TEST DATE: {data.act.testDate.toUpperCase()}</div>
              <div>ACT ID: {data.act.actId}</div>
            </div>
          </div>

          {/* 核心综合分主徽章 */}
          <div className="my-6 p-6 rounded-lg bg-slate-50 border-2 border-[#002f6c] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs uppercase font-bold text-[#002f6c] tracking-wider">
                Composite Score
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-6xl font-black text-[#002f6c] font-mono">{data.act.compositeScore}</span>
                <span className="text-slate-500 font-bold text-lg">/ 36</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Your ACT Composite score is the average of your four core test scores.
              </p>
            </div>

            <div className="flex items-center gap-6 divide-x divide-slate-300 text-center">
              <div className="px-4">
                <div className="text-3xl font-black text-slate-900 font-mono">{data.act.usRankPercentile}%</div>
                <div className="text-[11px] text-slate-600 font-semibold mt-0.5">US Rank</div>
              </div>
              <div className="pl-6">
                <div className="text-3xl font-black text-slate-900 font-mono">{data.act.stateRankPercentile}%</div>
                <div className="text-[11px] text-slate-600 font-semibold mt-0.5">State Rank</div>
              </div>
            </div>
          </div>

          {/* 四大单项成绩卡矩阵 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="border border-slate-300 rounded p-3 text-center bg-white shadow-2xs">
              <div className="text-xs font-bold text-slate-600 uppercase">Math</div>
              <div className="text-3xl font-black text-slate-900 font-mono my-1">{data.act.mathScore}</div>
              <div className="text-[10px] text-emerald-700 font-bold">Benchmark (22) Met</div>
            </div>
            <div className="border border-slate-300 rounded p-3 text-center bg-white shadow-2xs">
              <div className="text-xs font-bold text-slate-600 uppercase">Science</div>
              <div className="text-3xl font-black text-slate-900 font-mono my-1">{data.act.scienceScore}</div>
              <div className="text-[10px] text-emerald-700 font-bold">Benchmark (23) Met</div>
            </div>
            <div className="border border-slate-300 rounded p-3 text-center bg-white shadow-2xs">
              <div className="text-xs font-bold text-slate-600 uppercase">English</div>
              <div className="text-3xl font-black text-slate-900 font-mono my-1">{data.act.englishScore}</div>
              <div className="text-[10px] text-emerald-700 font-bold">Benchmark (18) Met</div>
            </div>
            <div className="border border-slate-300 rounded p-3 text-center bg-white shadow-2xs">
              <div className="text-xs font-bold text-slate-600 uppercase">Reading</div>
              <div className="text-3xl font-black text-slate-900 font-mono my-1">{data.act.readingScore}</div>
              <div className="text-[10px] text-emerald-700 font-bold">Benchmark (22) Met</div>
            </div>
          </div>

          {/* STEM, ELA & 写作成绩 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded bg-slate-100/70 border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-500">STEM Score:</span>{" "}
              <b className="font-mono text-sm text-[#002f6c]">{data.act.stemScore}</b> (Benchmark 26)
            </div>
            <div>
              <span className="text-slate-500">ELA Score:</span>{" "}
              <b className="font-mono text-sm text-[#002f6c]">{data.act.elaScore}</b> (Benchmark 20)
            </div>
            <div>
              <span className="text-slate-500">Writing Score:</span>{" "}
              <b className="font-mono text-sm text-[#002f6c]">{data.act.writingScore}</b> (Scale 2–12)
            </div>
          </div>

          {/* 考生档案 */}
          <div className="border border-slate-300 p-3 rounded text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div>
              <b>Student:</b> {data.studentName} ({data.address}, {data.cityStateZip})
            </div>
            <div>
              <b>High School:</b> {data.act.highSchoolName} (Code: {data.act.highSchoolCode})
            </div>
          </div>

          {/* 底部 ACT 认证章 */}
          <div className="mt-8 pt-4 border-t-2 border-[#002f6c] text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              ACT, Inc. · 500 ACT Drive, P.O. Box 168, Iowa City, IA 52243-0168 · Official Standardized Test Report
            </p>
            <div className="font-mono text-slate-400">SECURE VERIFIED DOCUMENT</div>
          </div>
        </div>
      )}
    </div>
  )
}
