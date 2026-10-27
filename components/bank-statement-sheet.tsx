"use client"

import React from "react"
import type { BankStatementData } from "@/lib/bank-statement-generator"
import { Building2, ShieldCheck, CheckCircle2 } from "lucide-react"

interface BankStatementSheetProps {
  data: BankStatementData
  isEditable?: boolean
  watermark?: "OFFICIAL" | "SAMPLE" | "NONE"
  onUpdate?: (updated: BankStatementData) => void
}

export function BankStatementSheet({
  data,
  isEditable = false,
  watermark = "OFFICIAL",
  onUpdate,
}: BankStatementSheetProps) {
  const handleChange = (field: keyof BankStatementData, val: unknown) => {
    if (!onUpdate) return
    onUpdate({
      ...data,
      [field]: val,
    })
  }

  const isUsBank = data.bankId === "usbank"

  return (
    <div
      id="printable-bank-statement"
      className={`relative w-full max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-300 print:shadow-none print:border-none print:p-8 font-sans leading-tight ${
        isUsBank ? "selection:bg-blue-100" : "selection:bg-red-100"
      }`}
      style={{ minHeight: "1050px" }}
    >
      {/* 水印 */}
      {watermark !== "NONE" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
          <div className="transform -rotate-36 text-slate-200/40 font-black tracking-widest text-6xl sm:text-7xl uppercase border-8 border-dashed border-slate-200/40 p-8 rounded-3xl">
            {watermark === "OFFICIAL" && "OFFICIAL STATEMENT"}
            {watermark === "SAMPLE" && "SAMPLE COPY - VOID"}
          </div>
        </div>
      )}

      {/* 头部：银行红蓝经典 LOGO 与对账周期 */}
      <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b-2 pb-4 ${
        isUsBank ? "border-[#0c2340]" : "border-red-600"
      }`}>
        <div>
          {isUsBank ? (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-[#0c2340] rounded-sm flex items-center justify-center text-[#d9272e] font-black text-sm border border-[#0c2340]">
                <div className="w-4 h-4 bg-[#d9272e] rounded-xs" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#0c2340] font-sans">
                  us bank
                </span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-widest">
                  National Association
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-8 w-10 bg-red-600 rounded-xs flex items-center justify-center text-white font-black text-xs tracking-tighter">
                BofA
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-blue-950 font-serif">
                {data.bankLogoText}
              </span>
            </div>
          )}
          <div className="text-xs text-slate-500 mt-1">
            {data.bankAddress} · {data.website}
          </div>
        </div>

        <div className="text-left sm:text-right text-xs space-y-0.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account Statement</div>
          <div className="font-bold text-slate-900 font-mono text-sm">{data.accountNumberMasked}</div>
          <div className="text-slate-600">Statement Period: <b className="text-slate-900">{data.statementPeriod}</b></div>
          <div className="text-slate-500">Customer Service: {data.customerServicePhone}</div>
        </div>
      </div>

      {/* 客户地址证明块 (Proof of Address Block) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-200 text-xs">
        {/* 左侧：信封开窗客户法定姓名与真实地址 */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Account Holder & Mailing Address
          </div>
          {isEditable ? (
            <div className="space-y-1.5">
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                className="w-full font-bold text-sm border-b border-blue-400 bg-blue-50/50 p-0.5"
              />
              <textarea
                value={data.customerAddress}
                onChange={(e) => handleChange("customerAddress", e.target.value)}
                className="w-full text-xs border border-blue-400 bg-blue-50/50 p-1 rounded"
                rows={2}
              />
            </div>
          ) : (
            <div>
              <div className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                {data.customerName}
              </div>
              <div className="text-xs text-slate-700 mt-1 leading-relaxed font-mono whitespace-pre-line">
                {data.customerAddress}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：账户资金汇总表 */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
            Account Summary (USD)
          </div>
          <div className="flex justify-between text-xs py-0.5 border-b border-slate-200">
            <span className="text-slate-600">Starting Balance:</span>
            <span className="font-mono font-semibold text-slate-900">${data.startingBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs py-0.5 border-b border-slate-200">
            <span className="text-emerald-700 font-medium">Deposits & Credits (+):</span>
            <span className="font-mono font-semibold text-emerald-700">+${data.totalDeposits.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs py-0.5 border-b border-slate-200">
            <span className="text-rose-600 font-medium">Withdrawals & Debits (-):</span>
            <span className="font-mono font-semibold text-rose-600">-${data.totalWithdrawals.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm py-1 font-bold">
            <span className="text-blue-950">Ending Balance:</span>
            <span className="font-mono text-blue-900">${data.endingBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 交易流水明细表格 (Transaction History) */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Checking Account Transactions
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Routing (ABA): {data.routingNumber}</span>
        </div>

        <table className="w-full text-left text-xs border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px]">
              <th className="py-2 px-3 w-16">Date</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3 text-right w-24">Amount ($)</th>
              <th className="py-2 px-3 text-right w-28">Balance ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {data.transactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-1.5 px-3 text-slate-600">{tx.date}</td>
                <td className="py-1.5 px-3 font-sans text-slate-800 uppercase">{tx.description}</td>
                <td
                  className={`py-1.5 px-3 text-right font-semibold ${
                    tx.type === "deposit" ? "text-emerald-700" : "text-slate-900"
                  }`}
                >
                  {tx.type === "deposit" ? `+${tx.amount.toFixed(2)}` : `-${tx.amount.toFixed(2)}`}
                </td>
                <td className="py-1.5 px-3 text-right text-slate-700">{tx.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 底部：FDIC 承保与官方防伪声明 */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 leading-normal flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="max-w-lg">
          <p className="font-semibold text-slate-700">MEMBER FDIC · EQUAL HOUSING LENDER</p>
          <p>
            This official account statement is generated for address verification and banking records.
            Bank of America, N.A. Member FDIC. © 2026 Bank of America Corporation. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-mono font-bold text-slate-700 text-[10px]">VERIFIED STATEMENT</span>
        </div>
      </div>
    </div>
  )
}

export default BankStatementSheet
