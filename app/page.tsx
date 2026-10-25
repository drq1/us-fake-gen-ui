"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import ConfigDialog from "@/components/config-dialog"
import JsonDownloadDialog from "@/components/json-download-dialog"
import { TranscriptModal } from "@/components/transcript-modal"
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
  const [transcriptTab, setTranscriptTab] = useState<"highSchool" | "university">("highSchool")
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [universityData, setUniversityData] = useState<UniversityData | null>(null)
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [restoredFromSnapshot, setRestoredFromSnapshot] = useState(false)
  const [, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const router = useRouter()

  // URL 配置参数
  const state = searchParams.get("state") || ""
  const city = searchParams.get("city") || ""
  const gender = searchParams.get("gender") || ""
  const nameSet = searchParams.get("nameSet") || "american"
  const minAge = Number.parseInt(searchParams.get("minAge") || "0", 10) || 0
  const maxAge = Number.parseInt(searchParams.get("maxAge") || "0", 10) || 0
  
  // 智能识别旧版残缺字段 URL 并自动升级为全量字段
  const rawFields = searchParams.get("fields")
  const isOutdatedFields = !rawFields || !rawFields.includes("occupation")
  const visibleFields = isOutdatedFields ? DEFAULT_VISIBLE_FIELDS : rawFields.split(",")

  const seedParam = searchParams.get("seed")
  const seed = Number.parseInt(seedParam || "0", 10) || generateSeed()

  const highState = searchParams.get("highState") || ""
  const highCity = searchParams.get("highCity") || ""
  const universityState = searchParams.get("universityState") || ""
  const universityCity = searchParams.get("universityCity") || ""

  // 初始化必要参数与迁移旧 URL 缓存
  useEffect(() => {
    if (!searchParams.get("fields") || !searchParams.get("fields")?.includes("occupation") || !searchParams.get("seed")) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("fields", DEFAULT_VISIBLE_FIELDS.join(","))
      if (!params.get("seed")) {
        params.set("seed", generateSeed().toString())
      }
      router.replace(`/?${params.toString()}`)
    }
  }, [searchParams, router])

  const updateUrlParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      startTransition(() => {
        router.replace(`/?${params.toString()}`)
      })
    },
    [searchParams, router],
  )

  const fetchEducationData = async (
    personState: string,
    personCity: string,
    querySeed: number,
  ) => {
    // 1. 中学信息：从 NCES 官方数据库检索 100% 真实高中
    let schoolResult: SchoolData | null = null
    const schoolStateToUse = highState || personState
    const schoolCityToUse = highCity || personCity

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
    const universityStateToUse = universityState || personState
    const universityResult = getRealUniversity(universityStateToUse, querySeed)

    setSchoolData(schoolResult)
    setUniversityData(universityResult)
  }

  const fetchData = useCallback(
    async (targetSeed: number) => {
      setLoading(true)
      try {
        let onlineRealAddress = null
        if (state) {
          onlineRealAddress = await fetchRealAddressOnline(state, city, targetSeed)
        }

        const result = generatePersonData({
          state,
          city,
          gender,
          nameSet,
          minAge,
          maxAge,
          seed: targetSeed,
          realAddress: onlineRealAddress || undefined,
        })

        setData(result)
        await fetchEducationData(result.state, result.city, targetSeed)
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

  useEffect(() => {
    if (restoredFromSnapshot) return
    if (searchParams.get("fields") && searchParams.get("seed")) {
      fetchData(seed)
    }
  }, [searchParams, seed, fetchData, restoredFromSnapshot])

  const handleRegenerate = () => {
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
    }
    setRestoredFromSnapshot(false)
    updateUrlParams({ seed: generateSeed().toString() })
  }

  const handleStateChange = (newState: string) => {
    updateUrlParams({ state: newState, city: "", seed: generateSeed().toString() })
  }

  const handleGenderChange = (newGender: string) => {
    updateUrlParams({ gender: newGender, seed: generateSeed().toString() })
  }

  const handleNameSetChange = (newNameSet: string) => {
    updateUrlParams({
      nameSet: newNameSet === "american" ? "" : newNameSet,
      seed: generateSeed().toString(),
    })
  }

  const handleAgeChange = (newMin: number, newMax: number) => {
    updateUrlParams({
      minAge: newMin ? newMin.toString() : "",
      maxAge: newMax ? newMax.toString() : "",
      seed: generateSeed().toString(),
    })
  }

  const handleApplyPreset = (params: { state: string; minAge?: number; maxAge?: number }) => {
    updateUrlParams({
      state: params.state,
      city: "",
      minAge: params.minAge ? params.minAge.toString() : "",
      maxAge: params.maxAge ? params.maxAge.toString() : "",
      seed: generateSeed().toString(),
    })
  }

  const handleRestoreData = (restored: { person: PersonData; school?: SchoolData; university?: UniversityData }) => {
    setData(restored.person)
    if (restored.school) setSchoolData(restored.school)
    if (restored.university) setUniversityData(restored.university)
    if (restored.person.state) {
      updateUrlParams({
        state: restored.person.state,
        city: restored.person.city || "",
        gender: restored.person.gender || "",
        nameSet: restored.person.nameSet || "",
      })
    }
  }

  const handleOpenTranscript = (tab: "highSchool" | "university" = "highSchool") => {
    setTranscriptTab(tab)
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
        />

        {/* 核心双栏平衡数据展示板 */}
        <main className="mt-5">
          {data && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* 左栏（地址核心 + 个人身份特征 + 仿真信用卡金融） */}
              <div className="space-y-5">
                <AddressInfoCard data={data} visibleFields={visibleFields} />
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
          onOpenChange={setTranscriptOpen}
          person={data}
          school={schoolData}
          university={universityData}
          seed={seed}
          defaultTab={transcriptTab}
        />
      )}
    </div>
  )
}
