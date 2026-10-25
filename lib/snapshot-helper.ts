import type { PersonData, SchoolData, UniversityData } from "./types"

export interface SnapshotPayload {
  person: PersonData
  school?: SchoolData | null
  university?: UniversityData | null
  savedAt?: number
}

/**
 * 将字符串编码为 URL-safe Base64 字符串 (支持任意 UTF-8 中英文字符与特殊标点)
 */
export function toBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str)
  let binary = ""
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

/**
 * 将 URL-safe Base64 字符串无损解码回 UTF-8 字符串
 */
export function fromBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) {
    base64 += "="
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

/**
 * 为当前资料（包括自定义上传或修改过的数据）生成专属快照恢复 URL
 * 数据保存在 URL Hash (#snapshot=...) 中，纯前端即时解算，不经服务器，不受 URL 查询参数长度限制
 */
export function generateSnapshotUrl(payload: SnapshotPayload): string {
  if (typeof window === "undefined") return ""
  try {
    const compactData: Record<string, unknown> = {
      ...payload.person,
      school: payload.school || undefined,
      university: payload.university || undefined,
      _savedAt: payload.savedAt || Date.now(),
    }
    const jsonStr = JSON.stringify(compactData)
    const base64Url = toBase64Url(jsonStr)
    const origin = window.location.origin
    const pathname = window.location.pathname
    return `${origin}${pathname}#snapshot=${base64Url}`
  } catch (err) {
    console.error("Failed to generate snapshot URL:", err)
    return window.location.href
  }
}

/**
 * 从 URL Hash 中提取并解析快照数据
 */
export function decodeSnapshotFromHash(
  hashString: string,
): { person: PersonData; school?: SchoolData; university?: UniversityData } | null {
  try {
    if (!hashString || !hashString.includes("#snapshot=")) {
      return null
    }

    const rawToken = hashString.split("#snapshot=")[1]?.split("&")[0]
    if (!rawToken) return null

    const jsonStr = fromBase64Url(rawToken)
    const parsed = JSON.parse(jsonStr)

    if (!parsed || (!parsed.fullName && !parsed.street)) {
      return null
    }

    const school = parsed.school as SchoolData | undefined
    const university = parsed.university as UniversityData | undefined

    const personClean: Record<string, unknown> = { ...parsed }
    delete personClean.school
    delete personClean.university
    delete personClean._savedAt

    return {
      person: personClean as unknown as PersonData,
      school,
      university,
    }
  } catch (err) {
    console.warn("Failed to decode snapshot from hash:", err)
    return null
  }
}
