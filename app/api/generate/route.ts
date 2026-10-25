import { NextRequest, NextResponse } from "next/server"
import { generatePersonData } from "@/lib/generator"
import { fetchRealAddressOnline } from "@/lib/real-addresses"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get("state") || undefined
    const city = searchParams.get("city") || undefined
    const gender = searchParams.get("gender") || undefined
    const minAge = Number.parseInt(searchParams.get("minAge") || "0", 10) || undefined
    const maxAge = Number.parseInt(searchParams.get("maxAge") || "0", 10) || undefined
    const seed = Number.parseInt(searchParams.get("seed") || searchParams.get("_refresh") || "0", 10) || undefined

    // 优先尝试获取在线 10万+ 官方真实物理地址，超时或失败由 generator 自动降级为全美离线真实库
    let onlineAddress = null
    if (state) {
      onlineAddress = await fetchRealAddressOnline(state, city, seed)
    }

    const data = generatePersonData({
      state,
      city,
      gender,
      minAge,
      maxAge,
      seed,
      realAddress: onlineAddress || undefined,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("API generate error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate fake data",
      },
      { status: 500 },
    )
  }
}
