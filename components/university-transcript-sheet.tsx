"use client"

import React from "react"
import type { UniversityTranscriptData } from "@/lib/university-transcript-types"
import { TexasAmSheet } from "./transcripts/texas-am-sheet"
import { NyuSternSheet } from "./transcripts/nyu-stern-sheet"
import { StandardUniversitySheet } from "./transcripts/standard-university-sheet"

export type UniversityTranscriptStyle =
  | "texas_am"
  | "nyu_stern"
  | "harvard"
  | "ucla"
  | "mit"
  | "standard"

interface UniversityTranscriptSheetProps {
  data: UniversityTranscriptData
  watermark: "OFFICIAL" | "ISSUED_TO_STUDENT" | "SAMPLE" | "NONE"
  styleVariant?: UniversityTranscriptStyle
  isEditable?: boolean
  onUpdate?: (updated: UniversityTranscriptData) => void
}

export function UniversityTranscriptSheet({
  data,
  watermark,
  styleVariant,
  isEditable = false,
  onUpdate,
}: UniversityTranscriptSheetProps) {
  // 智能推断版式或使用用户显式指定版式
  const resolvedStyle: UniversityTranscriptStyle = React.useMemo(() => {
    if (styleVariant) return styleVariant
    const lowerName = data.universityName.toLowerCase()
    if (lowerName.includes("texas a&m") || lowerName.includes("texas am")) return "texas_am"
    if (lowerName.includes("new york university") || lowerName.includes("nyu") || lowerName.includes("stern")) return "nyu_stern"
    if (lowerName.includes("harvard")) return "harvard"
    if (lowerName.includes("los angeles") || lowerName.includes("ucla")) return "ucla"
    if (lowerName.includes("massachusetts institute") || lowerName.includes("mit")) return "mit"
    return "standard"
  }, [styleVariant, data.universityName])

  if (resolvedStyle === "texas_am") {
    return (
      <TexasAmSheet
        data={data}
        watermark={watermark}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    )
  }

  if (resolvedStyle === "nyu_stern") {
    return (
      <NyuSternSheet
        data={data}
        watermark={watermark}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    )
  }

  return (
    <StandardUniversitySheet
      data={data}
      watermark={watermark}
      styleVariant={resolvedStyle === "standard" ? "standard" : resolvedStyle}
      isEditable={isEditable}
      onUpdate={onUpdate}
    />
  )
}
