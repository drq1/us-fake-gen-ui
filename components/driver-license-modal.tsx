"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, IdCard, Star, Heart, ArrowLeft, RotateCw, Download, ShieldCheck, User } from "lucide-react"
import type { PersonData } from "@/lib/types"
import { generateDriverLicense, type DriverLicenseData } from "@/lib/driver-license-generator"

interface DriverLicenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: PersonData
  defaultState?: string
  onBackToTemplates?: () => void
}

export function DriverLicenseModal({
  open,
  onOpenChange,
  person,
  defaultState,
  onBackToTemplates,
}: DriverLicenseModalProps) {
  const [selectedState, setSelectedState] = useState<string>(defaultState || person.state || "NY")
  const [showBack, setShowBack] = useState(false)
  const [cardData, setCardData] = useState<DriverLicenseData | null>(null)

  useEffect(() => {
    if (defaultState) {
      setSelectedState(defaultState)
    } else if (person.state) {
      setSelectedState(person.state)
    }
  }, [defaultState, person.state])

  useEffect(() => {
    if (person) {
      setCardData(generateDriverLicense(person, selectedState))
    }
  }, [person, selectedState])

  const handlePrint = () => {
    window.print()
  }

  const handleExportJson = () => {
    if (!cardData) return
    const blob = new Blob([JSON.stringify(cardData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Driver_License_${cardData.state}_${person.fullName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-3xl h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl print:bg-white print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto print:max-h-none print:overflow-visible">
        {/* 固定顶部操作栏 (独立置顶，绝不跟随滚动) */}
        <DialogHeader className="print:hidden border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 shrink-0 z-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                <IdCard className="h-5 w-5 text-blue-600" />
                美国驾驶执照 / 州身份证 (REAL ID Driver License)
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                符合美国国土安全部 REAL ID 黄金星标与 AAMVA 规范的标准实体卡面生成器
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

              {/* 州选择切换 */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-8 text-xs font-semibold bg-white border border-slate-300 rounded-md px-2.5 focus:outline-hidden"
              >
                <option value="NY">纽约州 (NY)</option>
                <option value="WI">威斯康星州 (WI)</option>
                <option value="CA">加利福尼亚州 (CA)</option>
                <option value="TX">德克萨斯州 (TX)</option>
                <option value="FL">佛罗里达州 (FL)</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBack(!showBack)}
                className="h-8 text-xs font-semibold bg-white"
              >
                <RotateCw className="mr-1.5 h-3.5 w-3.5" />
                {showBack ? "查看卡面正面" : "查看卡面背面"}
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                打印证件卡
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 驾照卡片主体独立滚动区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 print:p-0 print:overflow-visible">
          {cardData && (
            <div className="my-6 mx-auto w-full flex justify-center print:m-0">
              {!showBack ? (
                /* ========== 卡片正面 ========== */
                <div className="relative w-full max-w-[500px] aspect-[1.586] rounded-2xl bg-gradient-to-br from-amber-50/90 via-sky-50/70 to-slate-100 border-2 border-slate-400/60 shadow-xl overflow-hidden font-sans select-none text-slate-800 print:shadow-none print:border-black">
                  {/* 顶栏州名题头 */}
                  <div className={`bg-gradient-to-r ${cardData.bannerColor} text-white px-4 py-2 flex items-center justify-between`}>
                    <div>
                      <div className="text-base sm:text-lg font-black tracking-wider uppercase leading-none font-serif">
                        {cardData.stateFullName}
                      </div>
                      <div className="text-[8px] sm:text-[9px] tracking-widest font-bold uppercase text-amber-200/90 mt-0.5">
                        {cardData.motto} · DRIVER LICENSE
                      </div>
                    </div>

                    {/* REAL ID 金星 */}
                    <div className="h-7 w-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs shrink-0 border border-amber-300">
                      <Star className="h-4 w-4 fill-amber-950" />
                    </div>
                  </div>

                  {/* 卡面主体内容 */}
                  <div className="p-3.5 sm:p-4 grid grid-cols-12 gap-3 items-start h-[calc(100%-48px)]">
                    {/* 左侧照片与签名 */}
                    <div className="col-span-4 flex flex-col items-center">
                      <div className="w-full aspect-[0.78] rounded-lg bg-slate-200 border-2 border-slate-300 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative shadow-inner">
                        <User className="h-16 w-16 text-slate-400" />
                        <div className="absolute bottom-1 text-[7px] font-mono tracking-tighter text-slate-500 uppercase">
                          DMV PHOTO ID
                        </div>
                      </div>
                      {/* 签名档 */}
                      <div className="mt-1.5 w-full text-center border-b border-slate-400/60 pb-0.5">
                        <span className="font-serif italic font-bold text-xs text-blue-950 truncate block">
                          {cardData.personName}
                        </span>
                        <span className="text-[6.5px] text-slate-400 uppercase tracking-tighter block">SIGNATURE</span>
                      </div>
                    </div>

                    {/* 右侧核心 AAMVA 规范字段 */}
                    <div className="col-span-8 space-y-1 text-[11px] sm:text-xs leading-tight">
                      {/* 驾照号码 */}
                      <div className="flex items-center justify-between border-b border-slate-300/60 pb-1">
                        <div>
                          <span className="text-[8px] text-red-600 font-bold block uppercase">4d. DL NUMBER</span>
                          <span className="font-mono font-black text-sm text-red-700 tracking-wider">
                            {cardData.licenseNumber}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-slate-500 font-bold block uppercase">CLASS</span>
                          <span className="font-bold text-xs text-slate-900">{cardData.licenseClass}</span>
                        </div>
                      </div>

                      {/* 姓名与地址 */}
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">1. LN / 2. FN</span>
                        <span className="font-black text-xs text-slate-900 block truncate">{cardData.lastName}, {cardData.firstName}</span>
                      </div>

                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">8. ADDRESS</span>
                        <span className="font-medium text-[10px] text-slate-800 block truncate">{cardData.addressLine}</span>
                        <span className="font-medium text-[10px] text-slate-800 block truncate">{cardData.cityStateZip}</span>
                      </div>

                      {/* 日期网格 */}
                      <div className="grid grid-cols-3 gap-1 pt-0.5 text-[9.5px]">
                        <div>
                          <span className="text-[7.5px] text-slate-500 block uppercase">3. DOB</span>
                          <span className="font-bold font-mono text-slate-900">{cardData.dob}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-slate-500 block uppercase">4a. ISS</span>
                          <span className="font-mono text-slate-700">{cardData.issDate}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-red-600 font-bold block uppercase">4b. EXP</span>
                          <span className="font-bold font-mono text-red-700">{cardData.expDate}</span>
                        </div>
                      </div>

                      {/* 身体特征 */}
                      <div className="grid grid-cols-4 gap-1 text-[8.5px] pt-1 text-slate-700 font-mono">
                        <div><span className="text-[7px] text-slate-400 block">SEX</span><b>{cardData.sex}</b></div>
                        <div><span className="text-[7px] text-slate-400 block">HGT</span><b>{cardData.height}</b></div>
                        <div><span className="text-[7px] text-slate-400 block">WGT</span><b>{cardData.weight}</b></div>
                        <div><span className="text-[7px] text-slate-400 block">EYES</span><b>{cardData.eyes}</b></div>
                      </div>

                      {/* 器官捐献标记 */}
                      {cardData.donor && (
                        <div className="pt-0.5 flex items-center justify-end gap-1 text-[8px] font-bold text-rose-600">
                          <Heart className="h-3 w-3 fill-rose-600 text-rose-600" />
                          <span>ORGAN DONOR</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 仿真全息防伪透光底纹 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-purple-400/10 pointer-events-none" />
                </div>
              ) : (
                /* ========== 卡片背面 ========== */
                <div className="relative w-full max-w-[500px] aspect-[1.586] rounded-2xl bg-slate-100 border-2 border-slate-400/60 shadow-xl overflow-hidden font-sans select-none text-slate-800 p-3 sm:p-4 flex flex-col justify-between print:shadow-none print:border-black">
                  {/* 磁条 */}
                  <div className="w-full h-8 bg-slate-900 -mx-4 -mt-4 mb-2" />

                  {/* 2D PDF417 条码模拟 */}
                  <div className="bg-white p-2 border border-slate-300 rounded flex flex-col gap-1 items-center">
                    <div className="w-full h-12 bg-gradient-to-r from-black via-slate-700 to-black rounded-xs flex items-center justify-center text-[7px] text-white font-mono tracking-widest uppercase">
                      AAMVA COMPLIANT PDF417 2D SECURITY BARCODE
                    </div>
                    <div className="w-full flex justify-between text-[7px] font-mono text-slate-400">
                      <span>DL: {cardData.licenseNumber}</span>
                      <span>EXP: {cardData.expDate}</span>
                      <span>ST: {cardData.state}</span>
                    </div>
                  </div>

                  {/* 声明与法律合规条款 */}
                  <div className="text-[7px] text-slate-500 leading-tight space-y-0.5">
                    <p className="font-bold text-slate-700">DEPARTMENT OF MOTOR VEHICLES OFFICIAL NOTICE</p>
                    <p>This license must be carried when operating a motor vehicle. Notify DMV within 10 days of address change.</p>
                    <p>REAL ID act certified for federal identification and domestic commercial air travel.</p>
                  </div>

                  {/* 底部线性条码 */}
                  <div className="w-full h-5 border-t border-dashed border-slate-400 pt-1 flex items-center justify-center font-mono text-[8px] tracking-widest text-slate-600">
                    ||| | ||||| || |||| ||| ||||||| | |||| | |||||| ||| |
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部引导栏 (固定在底部，绝不跟随滚动) */}
        <div className="print:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>💡 提示：本卡面符合标准 CR80 比例，可直接以原寸彩色打印或另存为 PDF。</span>
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
              下载证件 JSON
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DriverLicenseModal
