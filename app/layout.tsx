import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f8fafc",
}

export const metadata: Metadata = {
  title: "美国地址生成器 - US Fake Generator",
  description: "快速生成结构化、合规的美国真实地址与个人资料模拟数据",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
