"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import ConfigDialog from "@/components/config-dialog"
import JsonDownloadDialog from "@/components/json-download-dialog"
import { TranscriptModal } from "@/components/transcript-modal"
import { BankStatementModal } from "@/components/bank-statement-modal"
import { ReferenceTemplatesModal } from "@/components/reference-templates-modal"
import { AdmissionLetterModal } from "@/components/admission-letter-modal"
import { ScheduleModal } from "@/components/schedule-modal"
import { DriverLicenseModal } from "@/components/driver-license-modal"
import { VitalRecordsModal } from "@/components/vital-records-modal"
import { QuickFilterBar } from "@/components/quick-filter-bar"
import { PresetScenarios } from "@/components/preset-scenarios"
import { AddressInfoCard } from "@/components/address-info-card"
import { DetailInfoCard } from "@/components/detail-info-card"
import type { PersonData, SchoolData, UniversityData } from "@/lib/types"
import { DEFAULT_VISIBLE_FIELDS } from "@/lib/constants"
import { generatePersonData } from "@/lib/generator"
import { fetchRealAddressOnline } from "@/lib/real-addresses"
import { getRealUniversity } from "@/lib/real-universities"
import { decodeSnapshotFromHash } from "@/lib/snapshot-helper"

const generateSeed = () => Math.floor(Math.random() * 1000000)

export default function HomePage() {
  const [data, setData] = useState<PersonData | null>(null)
  const [loading, setLoading] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [transcriptTab, setTranscriptTab] = useState<"highSchool" | "university" | "satAct">("highSchool")
  const [transcriptSchoolStyle, setTranscriptSchoolStyle] = useState<string | undefined>(undefined)
  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [bankStatementType, setBankStatementType] = useState<"bofa" | "usbank">("bofa")
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false)
  const [fromTemplatesModal, setFromTemplatesModal] = useState(false)
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false)
  const [admissionSchoolId, setAdmissionSchoolId] = useState<string | undefined>(undefined)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleTab, setScheduleTab] = useState<"schedule" | "tuition">("schedule")
  const [licenseModalOpen, setLicenseModalOpen] = useState(false)
  const [licenseState, setLicenseState] = useState<string | undefined>(undefined)
  const [licenseGender, setLicenseGender] = useState<"M" | "F" | undefined>(undefined)
  const [vitalModalOpen, setVitalModalOpen] = useState(false)
  const [vitalDocType, setVitalDocType] = useState<"birth" | "ged" | "marriage" | "skill">("birth")
  const [vitalVariant, setVitalVariant] = useState<string | undefined>(undefined)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [universityData, setUniversityData] = useState<UniversityData | null>(null)
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [restoredFromSnapshot, setRestoredFromSnapshot] = useState(false)
  const searchParams = useSearchParams()

  // 核心生成与筛选参数（由内部 React State 管理，保持地址栏极致干净）
  const [state, setState] = useState<string>(() => searchParams.get("state") || "")
  const [city, setCity] = useState<string>(() => searchParams.get("city") || "")
  const [gender, setGender] = useState<string>(() => searchParams.get("gender") || "")
  const [nameSet, setNameSet] = useState<string>(() => searchParams.get("nameSet") || "american")
  const [minAge, setMinAge] = useState<number>(() => Number.parseInt(searchParams.get("minAge") || "0", 10) || 0)
  const [maxAge, setMaxAge] = useState<number>(() => Number.parseInt(searchParams.get("maxAge") || "0", 10) || 0)
  const [seed, setSeed] = useState<number>(() => {
    const s = searchParams.get("seed")
    return s ? Number.parseInt(s, 10) || generateSeed() : generateSeed()
  })

  // 教育偏好配置
  const [highState, setHighState] = useState<string>(() => searchParams.get("highState") || "")
  const [highCity, setHighCity] = useState<string>(() => searchParams.get("highCity") || "")
  const [universityState, setUniversityState] = useState<string>(() => searchParams.get("universityState") || "")
  const [universityCity, setUniversityCity] = useState<string>(() => searchParams.get("universityCity") || "")

  // 可见字段偏好（持久化在 localStorage，杜绝在地址栏堆砌数百字符的字段参数）
  const [visibleFields, setVisibleFields] = useState<string[]>(DEFAULT_VISIBLE_FIELDS)

  // 客户端挂载时：从 localStorage 加载用户偏好字段，并静默清理地址栏中历史残留的冗长 fields=... 参数
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("us_fake_gen_visible_fields")
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0 && parsed.includes("occupation")) {
            setVisibleFields(parsed)
          }
        } else {
          // 兼容读取旧书签/历史 URL 中的 fields 参数一次并转存至本地
          const urlFields = searchParams.get("fields")
          if (urlFields && urlFields.includes("occupation")) {
            const list = urlFields.split(",")
            setVisibleFields(list)
            localStorage.setItem("us_fake_gen_visible_fields", JSON.stringify(list))
          }
        }
      } catch (e) {
        console.error("Failed to load visibleFields cache:", e)
      }

      // 静默移除地址栏中的 fields 参数，保持地址栏极致纯净
      if (window.location.search && window.location.search.includes("fields=")) {
        const url = new URL(window.location.href)
        url.searchParams.delete("fields")
        const cleanSearch = url.searchParams.toString()
        const cleanUrl = cleanSearch ? `${url.pathname}?${cleanSearch}` : url.pathname
        window.history.replaceState(null, "", cleanUrl)
      }
    }
  }, [searchParams])

  const updateVisibleFields = (fields: string[]) => {
    setVisibleFields(fields)
    try {
      localStorage.setItem("us_fake_gen_visible_fields", JSON.stringify(fields))
    } catch (e) {
      console.error("Failed to save visibleFields to localStorage:", e)
    }
  }

  const fetchEducationData = async (
    personState: string,
    personCity: string,
    querySeed: number,
    customHighState?: string,
    customHighCity?: string,
    customUniState?: string,
    customUniCity?: string,
  ) => {
    // 1. 中学信息：从 NCES 官方数据库检索 100% 真实高中
    let schoolResult: SchoolData | null = null
    const schoolStateToUse = (customHighState !== undefined ? customHighState : highState) || personState
    const schoolCityToUse = (customHighCity !== undefined ? customHighCity : highCity) || personCity

    if (schoolStateToUse) {
      try {
        const schoolParams = new URLSearchParams()
        schoolParams.append("select", "name,ncesid,zip,website,address,city,state,telephone,st_grade,end_grade")
        let whereClause = `state="${schoolStateToUse}" AND end_grade = "12"`
        if (schoolCityToUse) {
          whereClause += ` AND city="${schoolCityToUse.toUpperCase()}"`
        }
        schoolParams.append("where", whereClause)
        schoolParams.append("order_by", `random(${querySeed})`)
        schoolParams.append("limit", "1")

        const schoolResponse = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-public-schools/records?${schoolParams.toString()}`,
        )
        const schoolApiData = await schoolResponse.json()

        if (schoolApiData.results && schoolApiData.results.length > 0) {
          const s = schoolApiData.results[0]
          schoolResult = {
            name: s.name || "",
            ncesid: s.ncesid || "",
            zip: s.zip || "",
            website: s.website || "",
            address: s.address || "",
            city: s.city || "",
            state: s.state || "",
            telephone: s.telephone || "",
            st_grade: s.st_grade || "",
            end_grade: s.end_grade || "",
          }
        }
      } catch (err) {
        console.error("Failed to fetch school data:", err)
      }
    }

    // 2. 大学信息：使用官方认证权威全美 50 州真实大学数据库（100% 保证有数据且真实存在）
    const universityStateToUse = (customUniState !== undefined ? customUniState : universityState) || personState
    const universityResult = getRealUniversity(universityStateToUse, querySeed)

    setSchoolData(schoolResult)
    setUniversityData(universityResult)
  }

  const fetchData = useCallback(
    async (
      targetSeed: number,
      overrides?: {
        state?: string
        city?: string
        gender?: string
        nameSet?: string
        minAge?: number
        maxAge?: number
        highState?: string
        highCity?: string
        universityState?: string
        universityCity?: string
      },
    ) => {
      const activeState = overrides?.state !== undefined ? overrides.state : state
      const activeCity = overrides?.city !== undefined ? overrides.city : city
      const activeGender = overrides?.gender !== undefined ? overrides.gender : gender
      const activeNameSet = overrides?.nameSet !== undefined ? overrides.nameSet : nameSet
      const activeMinAge = overrides?.minAge !== undefined ? overrides.minAge : minAge
      const activeMaxAge = overrides?.maxAge !== undefined ? overrides.maxAge : maxAge
      const activeHighState = overrides?.highState !== undefined ? overrides.highState : highState
      const activeHighCity = overrides?.highCity !== undefined ? overrides.highCity : highCity
      const activeUniState = overrides?.universityState !== undefined ? overrides.universityState : universityState
      const activeUniCity = overrides?.universityCity !== undefined ? overrides.universityCity : universityCity

      setLoading(true)
      try {
        let onlineRealAddress = null
        if (activeState) {
          onlineRealAddress = await fetchRealAddressOnline(activeState, activeCity, targetSeed)
        }

        const result = generatePersonData({
          state: activeState,
          city: activeCity,
          gender: activeGender,
          nameSet: activeNameSet,
          minAge: activeMinAge,
          maxAge: activeMaxAge,
          seed: targetSeed,
          realAddress: onlineRealAddress || undefined,
        })

        setData(result)
        await fetchEducationData(
          result.state,
          result.city,
          targetSeed,
          activeHighState,
          activeHighCity,
          activeUniState,
          activeUniCity,
        )
      } catch (error) {
        console.error("Generate error:", error)
        toast({
          title: "生成失败",
          description: "生成数据时发生错误，请重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [state, city, gender, nameSet, minAge, maxAge, highState, highCity, universityState, universityCity],
  )

  // 优先检测 URL Hash 中的快照数据（支持通过一个链接直接恢复上传或生成的信息）
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("#snapshot=")) {
      const restored = decodeSnapshotFromHash(window.location.hash)
      if (restored && restored.person) {
        setData(restored.person)
        if (restored.school) setSchoolData(restored.school)
        if (restored.university) setUniversityData(restored.university)
        setRestoredFromSnapshot(true)
        toast({
          title: "专属快照已直接还原！",
          description: `已成功加载 ${restored.person.fullName} 的完整人设、地址与教育数据。`,
        })
      }
    }
  }, [])

  // 初次进入页面时立即生成初始数据
  useEffect(() => {
    if (restoredFromSnapshot) return
    fetchData(seed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRegenerate = () => {
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname)
    }
    setRestoredFromSnapshot(false)
    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed)
  }

  const handleStateChange = (newState: string) => {
    setState(newState)
    setCity("")
    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed, { state: newState, city: "" })
  }

  const handleGenderChange = (newGender: string) => {
    setGender(newGender)
    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed, { gender: newGender })
  }

  const handleNameSetChange = (newNameSet: string) => {
    const formatted = newNameSet === "american" ? "" : newNameSet
    setNameSet(formatted)
    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed, { nameSet: formatted })
  }

  const handleAgeChange = (newMin: number, newMax: number) => {
    setMinAge(newMin)
    setMaxAge(newMax)
    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed, { minAge: newMin, maxAge: newMax })
  }

  const handleApplyPreset = (params: { state: string; minAge?: number; maxAge?: number }) => {
    const minA = params.minAge || 0
    const maxA = params.maxAge || 0
    setState(params.state)
    setCity("")
    setMinAge(minA)
    setMaxAge(maxA)
    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed, {
      state: params.state,
      city: "",
      minAge: minA,
      maxAge: maxA,
    })
  }

  const handleApplyConfig = (newConfig: {
    state: string
    city: string
    gender: string
    nameSet?: string
    minAge: number
    maxAge: number
    visibleFields: string[]
    highState: string
    highCity: string
    universityState: string
    universityCity: string
  }) => {
    setState(newConfig.state)
    setCity(newConfig.city)
    setGender(newConfig.gender)
    setNameSet(newConfig.nameSet || "american")
    setMinAge(newConfig.minAge)
    setMaxAge(newConfig.maxAge)
    setHighState(newConfig.highState)
    setHighCity(newConfig.highCity)
    setUniversityState(newConfig.universityState)
    setUniversityCity(newConfig.universityCity)
    updateVisibleFields(newConfig.visibleFields)

    const newSeed = generateSeed()
    setSeed(newSeed)
    fetchData(newSeed, {
      state: newConfig.state,
      city: newConfig.city,
      gender: newConfig.gender,
      nameSet: newConfig.nameSet || "american",
      minAge: newConfig.minAge,
      maxAge: newConfig.maxAge,
      highState: newConfig.highState,
      highCity: newConfig.highCity,
      universityState: newConfig.universityState,
      universityCity: newConfig.universityCity,
    })
  }

  const handleRestoreData = (restored: { person: PersonData; school?: SchoolData; university?: UniversityData }) => {
    setData(restored.person)
    if (restored.school) setSchoolData(restored.school)
    if (restored.university) setUniversityData(restored.university)
    if (restored.person.state) {
      setState(restored.person.state)
      setCity(restored.person.city || "")
      setGender(restored.person.gender || "")
      setNameSet(restored.person.nameSet || "")
    }
  }

  const handleOpenTranscript = (
    tab: "highSchool" | "university" | "satAct" = "highSchool",
    schoolStyle?: string
  ) => {
    setTranscriptTab(tab)
    setTranscriptSchoolStyle(schoolStyle)
    setTranscriptOpen(true)
  }

  const handleCopyAll = async () => {
    if (!data) return

    const summary = `【美国真实地址与个人资料】
全名: ${data.fullName} (${data.title} / ${data.gender === "Male" ? "男" : "女"})
生日: ${data.birthday}
真实完整地址: ${data.fullAddress}
街道: ${data.street}
城市: ${data.city}
州/省: ${data.stateFullName} (${data.state})
邮政编码: ${data.zipCode}
电话: ${data.phone}
邮箱: ${data.email}
社会安全号 (SSN): ${data.ssn}
信用卡: ${data.cardType} ${data.cardNumber} (到期: ${data.expiry}, CVV: ${data.cvv})
职业: ${data.occupation}
就职公司: ${data.company} (薪资: ${data.salary})
用户名: ${data.username} / 密码: ${data.password}
密保问题: ${data.securityQuestion} -> ${data.securityAnswer}
最高学历: ${data.education}${universityData ? ` (${universityData.name})` : ""}`

    try {
      await navigator.clipboard.writeText(summary)
      toast({
        title: "全套资料已复制",
        description: "整套身份与地址数据已复制到剪贴板，可直接粘贴使用",
      })
    } catch {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased">
      <div className="container mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
        {/* 顶部标题栏 */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                美国真实地址与身份生成器
              </h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200/80">
                v2.0 Pro
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              US Real Address & Identity Generator · 全美 50 州真实物理街道 · 真实邮政编码与高校数据库
            </p>
          </div>
        </div>

        {/* 顶部场景快捷直达条 (免税海淘、Apple ID、硅谷码农等) */}
        <div className="mb-3.5">
          <PresetScenarios
            currentState={state}
            currentMinAge={minAge}
            currentMaxAge={maxAge}
            onApplyPreset={handleApplyPreset}
          />
        </div>

        {/* 顶部快捷筛选与操作栏（免税州直达、指定州切换、性别切换、年龄段切换） */}
        <QuickFilterBar
          state={state}
          gender={gender}
          nameSet={nameSet}
          minAge={minAge}
          maxAge={maxAge}
          loading={loading}
          onStateChange={handleStateChange}
          onGenderChange={handleGenderChange}
          onNameSetChange={handleNameSetChange}
          onAgeChange={handleAgeChange}
          onRegenerate={handleRegenerate}
          onCopyAll={handleCopyAll}
          onOpenConfig={() => setConfigOpen(true)}
          onOpenJsonExport={() => setJsonDialogOpen(true)}
          onOpenTranscript={handleOpenTranscript}
          onOpenBankStatement={() => setBankModalOpen(true)}
          onOpenTemplates={() => setTemplatesModalOpen(true)}
        />

        {/* 核心双栏平衡数据展示板 */}
        <main className="mt-5">
          {data && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* 左栏（地址核心 + 个人身份特征 + 仿真信用卡金融） */}
              <div className="space-y-5">
                <AddressInfoCard
                  data={data}
                  visibleFields={visibleFields}
                  onOpenBankStatement={() => setBankModalOpen(true)}
                />
              </div>

              {/* 右栏（工作就职 + 账号安全 + 权威教育背景 + 设备技术指纹） */}
              <div className="space-y-5">
                <DetailInfoCard
                  data={data}
                  schoolData={schoolData}
                  universityData={universityData}
                  visibleFields={visibleFields}
                  onOpenTranscript={handleOpenTranscript}
                />
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
              <p className="text-slate-500">点击上方“生成新地址”开始生成数据</p>
            </div>
          )}
        </main>
      </div>

      {/* 参数配置弹窗 */}
      <ConfigDialog
        open={configOpen}
        onOpenChange={setConfigOpen}
        currentConfig={{
          state,
          city,
          gender,
          nameSet,
          minAge,
          maxAge,
          visibleFields,
          seed,
          birthYear: 0,
          highState,
          highCity,
          universityState,
          universityCity,
        }}
        onApplyConfig={handleApplyConfig}
      />

      {/* JSON 导出与下载弹窗 */}
      <JsonDownloadDialog
        open={jsonDialogOpen}
        onOpenChange={setJsonDialogOpen}
        data={data}
        schoolData={schoolData}
        universityData={universityData}
        visibleFields={visibleFields}
        onRestore={handleRestoreData}
      />

      {/* 官方教育成绩单生成器与打印弹窗 (美高 + 大学双轨) */}
      {data && (
        <TranscriptModal
          open={transcriptOpen}
          onOpenChange={(isOpen) => {
            setTranscriptOpen(isOpen)
            if (!isOpen && fromTemplatesModal) {
              setFromTemplatesModal(false)
              setTemplatesModalOpen(true)
            }
          }}
          onBackToTemplates={() => {
            setTranscriptOpen(false)
            setFromTemplatesModal(false)
            setTemplatesModalOpen(true)
          }}
          person={data}
          school={schoolData}
          university={universityData}
          seed={seed}
          defaultTab={transcriptTab}
          schoolStyle={transcriptSchoolStyle}
        />
      )}

      {/* 银行流水对账单与官方地址证明生成器 */}
      {data && (
        <BankStatementModal
          open={bankModalOpen}
          onOpenChange={(isOpen) => {
            setBankModalOpen(isOpen)
            if (!isOpen && fromTemplatesModal) {
              setFromTemplatesModal(false)
              setTemplatesModalOpen(true)
            }
          }}
          onBackToTemplates={() => {
            setBankModalOpen(false)
            setFromTemplatesModal(false)
            setTemplatesModalOpen(true)
          }}
          person={data}
          seed={seed}
          defaultBankId={bankStatementType}
        />
      )}

      {/* 真实凭证与参考模板库浏览下载弹窗 */}
      <ReferenceTemplatesModal
        open={templatesModalOpen}
        onOpenChange={(isOpen) => {
          setTemplatesModalOpen(isOpen)
          if (!isOpen) {
            setFromTemplatesModal(false)
          }
        }}
        onGenerateBankStatement={(bankId = "bofa") => {
          setFromTemplatesModal(true)
          setTemplatesModalOpen(false)
          setBankStatementType(bankId)
          setBankModalOpen(true)
        }}
        onGenerateTranscript={(tab = "highSchool", schoolStyle) => {
          setFromTemplatesModal(true)
          setTemplatesModalOpen(false)
          handleOpenTranscript(tab, schoolStyle)
        }}
        onGenerateAdmissionLetter={(schoolId) => {
          setFromTemplatesModal(true)
          setTemplatesModalOpen(false)
          setAdmissionSchoolId(schoolId)
          setAdmissionModalOpen(true)
        }}
        onGenerateSchedule={(tab = "schedule") => {
          setFromTemplatesModal(true)
          setTemplatesModalOpen(false)
          setScheduleTab(tab)
          setScheduleModalOpen(true)
        }}
        onGenerateDriverLicense={(st, gender) => {
          setFromTemplatesModal(true)
          setTemplatesModalOpen(false)
          setLicenseState(st)
          setLicenseGender(gender)
          setLicenseModalOpen(true)
        }}
        onGenerateVitalRecord={(docType = "birth", variant) => {
          setFromTemplatesModal(true)
          setTemplatesModalOpen(false)
          setVitalDocType(docType)
          setVitalVariant(variant)
          setVitalModalOpen(true)
        }}
      />

      {/* 1. 名校官方录取通知书生成器 (Offer Letter) */}
      {data && (
        <AdmissionLetterModal
          open={admissionModalOpen}
          onOpenChange={(isOpen) => {
            setAdmissionModalOpen(isOpen)
            if (!isOpen && fromTemplatesModal) {
              setFromTemplatesModal(false)
              setTemplatesModalOpen(true)
            }
          }}
          onBackToTemplates={() => {
            setAdmissionModalOpen(false)
            setFromTemplatesModal(false)
            setTemplatesModalOpen(true)
          }}
          person={data}
          university={universityData}
          seed={seed}
          defaultSchoolId={admissionSchoolId}
        />
      )}

      {/* 2. 大学选课表与在读/学费账单生成器 (Schedule & Tuition) */}
      {data && (
        <ScheduleModal
          open={scheduleModalOpen}
          onOpenChange={(isOpen) => {
            setScheduleModalOpen(isOpen)
            if (!isOpen && fromTemplatesModal) {
              setFromTemplatesModal(false)
              setTemplatesModalOpen(true)
            }
          }}
          onBackToTemplates={() => {
            setScheduleModalOpen(false)
            setFromTemplatesModal(false)
            setTemplatesModalOpen(true)
          }}
          person={data}
          university={universityData}
          seed={seed}
          defaultTab={scheduleTab}
        />
      )}

      {/* 3. 美国驾驶执照与 REAL ID 实体卡面生成器 (Driver License) */}
      {data && (
        <DriverLicenseModal
          open={licenseModalOpen}
          onOpenChange={(isOpen) => {
            setLicenseModalOpen(isOpen)
            if (!isOpen && fromTemplatesModal) {
              setFromTemplatesModal(false)
              setTemplatesModalOpen(true)
            }
          }}
          onBackToTemplates={() => {
            setLicenseModalOpen(false)
            setFromTemplatesModal(false)
            setTemplatesModalOpen(true)
          }}
          person={data}
          defaultState={licenseState}
          defaultGender={licenseGender}
        />
      )}

      {/* 4. 官方民政与资格文凭生成器 (Birth / GED / Marriage / Skill) */}
      {data && (
        <VitalRecordsModal
          open={vitalModalOpen}
          onOpenChange={(isOpen) => {
            setVitalModalOpen(isOpen)
            if (!isOpen && fromTemplatesModal) {
              setFromTemplatesModal(false)
              setTemplatesModalOpen(true)
            }
          }}
          onBackToTemplates={() => {
            setVitalModalOpen(false)
            setFromTemplatesModal(false)
            setTemplatesModalOpen(true)
          }}
          person={data}
          seed={seed}
          defaultDocType={vitalDocType}
          defaultVariant={vitalVariant}
        />
      )}
    </div>
  )
}
