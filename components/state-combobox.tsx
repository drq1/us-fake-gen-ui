"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Sparkles } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { US_STATES, TAX_FREE_STATE_CODES } from "@/lib/constants"

interface StateComboboxProps {
  value: string
  onChange: (stateCode: string) => void
  placeholder?: string
  randomLabel?: string
  className?: string
  disabled?: boolean
}

export function StateCombobox({
  value,
  onChange,
  placeholder = "选择或搜索州...",
  randomLabel = "🇺🇸 全美 50 州随机",
  className = "",
  disabled = false,
}: StateComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedState = US_STATES.find((s) => s.code === value)
  const isTaxFreeSelected = value && TAX_FREE_STATE_CODES.includes(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className={`flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold shadow-xs hover:border-blue-300 hover:bg-slate-50/60 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-all ${className}`}
        >
          <span className="truncate text-slate-800">
            {selectedState ? (
              <span className="inline-flex items-center gap-1.5">
                <span>{selectedState.nameCn}</span>
                <span className="font-mono text-slate-400 font-normal">({selectedState.code})</span>
                {isTaxFreeSelected && (
                  <span className="rounded bg-emerald-50 px-1 py-0.2 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    免税
                  </span>
                )}
              </span>
            ) : (
              <span className="font-medium text-slate-600">{randomLabel}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[calc(100vw-32px)] sm:w-72 p-0 rounded-xl shadow-lg border-slate-200 z-[9999]"
        align="start"
      >
        <Command
          filter={(itemValue, search) => {
            const v = itemValue.toLowerCase()
            const s = search.toLowerCase().trim()
            return v.includes(s) ? 1 : 0
          }}
        >
          <CommandInput
            placeholder="输入中文、拼音或缩写 (如 加州/CA/免税)..."
            className="h-10 text-xs"
          />
          <CommandList className="max-h-72 overflow-y-auto p-1 text-xs">
            <CommandEmpty className="py-6 text-center text-xs text-slate-400">
              未找到匹配的美国州，请尝试输入缩写或拼音
            </CommandEmpty>

            <CommandGroup heading="快捷选项">
              <CommandItem
                value="random 全美随机 50州 all 不限"
                onSelect={() => {
                  onChange("")
                  setOpen(false)
                }}
                className="flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer text-xs font-bold text-blue-600 aria-selected:bg-blue-50"
              >
                <div className="flex items-center gap-2">
                  <span>{randomLabel}</span>
                </div>
                {!value && <Check className="h-3.5 w-3.5 text-blue-600" />}
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="全美各州 (支持中文/英文/缩写/免税搜索)">
              {US_STATES.map((s) => {
                const isSelected = value === s.code
                const isTaxFree = TAX_FREE_STATE_CODES.includes(s.code)
                const searchValue = `${s.nameCn} ${s.name} ${s.code} ${isTaxFree ? "免税 tax free" : ""}`

                return (
                  <CommandItem
                    key={s.code}
                    value={searchValue}
                    onSelect={() => {
                      onChange(s.code)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer text-xs aria-selected:bg-blue-50/70"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-slate-900">{s.nameCn}</span>
                      <span className="font-mono text-slate-400">({s.name} · {s.code})</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isTaxFree && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          0%免税
                        </span>
                      )}
                      {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 font-bold" />}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
