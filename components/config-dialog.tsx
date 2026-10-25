"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AgeRangeSlider from "./age-range-slider"
import { StateCombobox } from "./state-combobox"
import { US_STATES, FIELD_CATEGORIES, FIELD_LABELS } from "@/lib/constants"
import { getCitiesForState } from "@/lib/us-cities"

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentConfig: {
    state: string
    city: string
    gender: string
    minAge: number
    maxAge: number
    visibleFields: string[]
    seed: number
    birthYear: number
    highState: string
    highCity: string
    universityState: string
    universityCity: string
  }
}

function ConfigDialog({ open, onOpenChange, currentConfig }: ConfigDialogProps) {
  const [state, setState] = useState(currentConfig.state)
  const [city, setCity] = useState(currentConfig.city)
  const [cities, setCities] = useState<string[]>(() => getCitiesForState(currentConfig.state))
  const [gender, setGender] = useState(currentConfig.gender)
  const [minAge, setMinAge] = useState(currentConfig.minAge || 18)
  const [maxAge, setMaxAge] = useState(currentConfig.maxAge || 65)
  const [visibleFields, setVisibleFields] = useState<string[]>(currentConfig.visibleFields)
  const [seed, setSeed] = useState(currentConfig.seed.toString())

  // 高中配置
  const [highState, setHighState] = useState(currentConfig.highState)
  const [highCity, setHighCity] = useState(currentConfig.highCity)
  const [highCities, setHighCities] = useState<string[]>(() => getCitiesForState(currentConfig.highState))

  // 大学配置
  const [universityState, setUniversityState] = useState(currentConfig.universityState)
  const [universityCity, setUniversityCity] = useState(currentConfig.universityCity)
  const [universityCities, setUniversityCities] = useState<string[]>(() => getCitiesForState(currentConfig.universityState))

  const router = useRouter()

  // 同步外部配置状态
  useEffect(() => {
    setState(currentConfig.state)
    setCity(currentConfig.city)
    setGender(currentConfig.gender)
    setMinAge(currentConfig.minAge || 18)
    setMaxAge(currentConfig.maxAge || 65)
    setVisibleFields(currentConfig.visibleFields)
    setSeed(currentConfig.seed.toString())
    setHighState(currentConfig.highState)
    setHighCity(currentConfig.highCity)
    setUniversityState(currentConfig.universityState)
    setUniversityCity(currentConfig.universityCity)
  }, [currentConfig])

  // 当州改变时立即切换城市列表（本地瞬时计算，0ms 响应，零网络请求与 404）
  useEffect(() => {
    setCities(getCitiesForState(state))
  }, [state])

  useEffect(() => {
    setHighCities(getCitiesForState(highState))
  }, [highState])

  useEffect(() => {
    setUniversityCities(getCitiesForState(universityState))
  }, [universityState])

  const handleFieldToggle = (field: string, checked: boolean) => {
    if (checked) {
      setVisibleFields([...visibleFields, field])
    } else {
      setVisibleFields(visibleFields.filter((f) => f !== field))
    }
  }

  const handleCategoryToggle = (categoryFields: readonly string[], checked: boolean) => {
    if (checked) {
      const newFields = Array.from(new Set([...visibleFields, ...categoryFields]))
      setVisibleFields(newFields)
    } else {
      setVisibleFields(visibleFields.filter((f) => !categoryFields.includes(f)))
    }
  }

  const handleAgeRangeChange = (newMinAge: number, newMaxAge: number) => {
    setMinAge(newMinAge)
    setMaxAge(newMaxAge)
  }

  const handleApply = () => {
    const params = new URLSearchParams()

    if (state && state !== "random") params.set("state", state)
    if (city && city !== "random") params.set("city", city)
    if (gender && gender !== "random") params.set("gender", gender)
    if (minAge > 0) params.set("minAge", minAge.toString())
    if (maxAge > 0) params.set("maxAge", maxAge.toString())
    if (seed) params.set("seed", seed)
    if (highState && highState !== "random") params.set("highState", highState)
    if (highCity && highCity !== "random") params.set("highCity", highCity)
    if (universityState && universityState !== "random") params.set("universityState", universityState)
    if (universityCity && universityCity !== "random") params.set("universityCity", universityCity)
    params.set("fields", visibleFields.join(","))

    router.push(`/?${params.toString()}`)
    onOpenChange(false)
  }

  const handleSelectAll = () => {
    const allFields = Object.values(FIELD_CATEGORIES).flatMap((cat) => cat.fields)
    setVisibleFields(allFields)
  }

  const handleSelectNone = () => {
    setVisibleFields([])
  }

  const getStateDisplayName = (stateCode: string) => {
    const stateInfo = US_STATES.find((s) => s.code === stateCode)
    return stateInfo ? `${stateInfo.nameCn} (${stateInfo.code})` : stateCode
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>配置生成参数</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本参数</TabsTrigger>
            <TabsTrigger value="education">教育机构</TabsTrigger>
            <TabsTrigger value="fields">显示字段</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="state">州 (可选，支持输入拼音/缩写/中文快速搜索)</Label>
                  <div className="mt-1.5">
                    <StateCombobox
                      value={state}
                      onChange={(val) => {
                        setState(val)
                        setCity("")
                      }}
                      randomLabel="全美 50 州随机"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="city">城市 (可选)</Label>
                  <Select
                    value={city || "random"}
                    onValueChange={(val) => setCity(val === "random" ? "" : val)}
                    disabled={!state || state === "random"}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !state || state === "random"
                            ? "请先选择州"
                            : cities.length > 0
                              ? "选择城市"
                              : "全州随机"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">随机</SelectItem>
                      {cities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {state && state !== "random"
                      ? `已选择州: ${getStateDisplayName(state)}`
                      : "注意：只有在选择了州的情况下才能指定城市"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="seed">随机种子</Label>
                  <Input
                    id="seed"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="自动生成"
                  />
                  <p className="text-sm text-gray-500 mt-1">用于确保结果可重现</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="gender">性别过滤 (可选)</Label>
                  <Select
                    value={gender || "random"}
                    onValueChange={(val) => setGender(val === "random" ? "" : val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">随机</SelectItem>
                      <SelectItem value="Male">男</SelectItem>
                      <SelectItem value="Female">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>年龄范围 (可选)</Label>
                  <AgeRangeSlider
                    minAge={minAge}
                    maxAge={maxAge}
                    onRangeChange={handleAgeRangeChange}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">设置年龄范围后，生日将根据年龄重新计算</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">高中筛选</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="highState">高中州 (可选，支持输入搜索)</Label>
                    <div className="mt-1.5">
                      <StateCombobox
                        value={highState}
                        onChange={(val) => {
                          setHighState(val)
                          setHighCity("")
                        }}
                        randomLabel="不限制 (全美随机)"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="highCity">高中城市 (可选)</Label>
                    <Select
                      value={highCity || "random"}
                      onValueChange={(val) => setHighCity(val === "random" ? "" : val)}
                      disabled={!highState || highState === "random"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !highState || highState === "random"
                              ? "请先选择高中州"
                              : highCities.length > 0
                                ? "选择高中城市"
                                : "不限制"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">不限制</SelectItem>
                        {highCities.map((cityName) => (
                          <SelectItem key={cityName} value={cityName}>
                            {cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">默认使用个人信息的州和城市，如果找不到则去掉城市限制</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">大学筛选</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="universityState">大学州 (可选，支持输入搜索)</Label>
                    <div className="mt-1.5">
                      <StateCombobox
                        value={universityState}
                        onChange={(val) => {
                          setUniversityState(val)
                          setUniversityCity("")
                        }}
                        randomLabel="不限制 (全美随机)"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="universityCity">大学城市 (可选)</Label>
                    <Select
                      value={universityCity || "random"}
                      onValueChange={(val) => setUniversityCity(val === "random" ? "" : val)}
                      disabled={!universityState || universityState === "random"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !universityState || universityState === "random"
                              ? "请先选择大学州"
                              : universityCities.length > 0
                                ? "选择大学城市"
                                : "不限制"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">不限制</SelectItem>
                        {universityCities.map((cityName) => (
                          <SelectItem key={cityName} value={cityName}>
                            {cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">默认使用个人信息的州，如果找不到则去掉城市限制</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">选择要显示的字段</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  全选
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectNone}>
                  全不选
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(FIELD_CATEGORIES).map(([categoryKey, category]) => {
                const categoryFields = category.fields
                const selectedCount = categoryFields.filter((field) => visibleFields.includes(field)).length
                const isAllSelected = selectedCount === categoryFields.length
                const isPartialSelected = selectedCount > 0 && selectedCount < categoryFields.length

                return (
                  <Card key={categoryKey}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isAllSelected ? true : isPartialSelected ? "indeterminate" : false}
                          onCheckedChange={(checked) => handleCategoryToggle(categoryFields, checked === true)}
                        />
                        <CardTitle className="text-base">
                          {category.title} ({selectedCount}/{categoryFields.length})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {categoryFields.map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            checked={visibleFields.includes(field)}
                            onCheckedChange={(checked) => handleFieldToggle(field, checked as boolean)}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {FIELD_LABELS[field]}
                          </label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleApply}>应用配置</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfigDialog
