"use client"

import React from "react"

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  alt?: string
}

// 1. College Board 官方橡果蓝黄标识与字标
export function CollegeBoardLogo({ className = "h-8", alt = "College Board", ...props }: LogoProps) {
  return (
    <img
      src="/logos/college_board.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 2. ACT 官方标准标识
export function ActLogo({ className = "h-8", alt = "ACT", ...props }: LogoProps) {
  return (
    <img
      src="/logos/act.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 3. Parchment 官方电子交付绿色螺旋与字标 (保留极小内联矢量)
export function ParchmentLogo({ className = "h-6", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="18" cy="18" r="14" fill="#003865" />
      <path
        d="M12 18C12 14.686 14.686 12 18 12C21.314 12 24 14.686 24 18C24 21.314 21.314 24 18 24C16.343 24 15 22.657 15 21C15 19.343 16.343 18 18 18"
        stroke="#48bb78"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="40" y="24" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="18" letterSpacing="0.5">
        parchment
      </text>
    </svg>
  )
}

// 4. Bank of America 官方红蓝双色旗标与字标
export function BankOfAmericaLogo({ className = "h-8", alt = "Bank of America", ...props }: LogoProps) {
  return (
    <img
      src="/logos/bofa.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 5. U.S. Bank 官方红白蓝盾标与 usbank 标志
export function UsBankLogo({ className = "h-8", alt = "U.S. Bank", ...props }: LogoProps) {
  return (
    <img
      src="/logos/usbank.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 6. 哈佛大学 (Harvard University) Veritas 官方绯红神圣盾徽
export function HarvardVeritasShield({ className = "h-14", alt = "Harvard University Veritas Shield", ...props }: LogoProps) {
  return (
    <img
      src="/logos/harvard.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 7. 麻省理工学院 (MIT) 官方 7-bar 标志
export function MitStripesLogo({ className = "h-8", alt = "MIT Logo", ...props }: LogoProps) {
  return (
    <img
      src="/logos/mit.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 7.1 MIT 斯隆管理学院 (MIT Sloan) 官方标识
export function MitSloanLogo({ className = "h-10", alt = "MIT Sloan School of Management", ...props }: LogoProps) {
  return (
    <img
      src="/logos/mit_sloan.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 8. 芝加哥大学 (The University of Chicago) 官方盾徽与展翅凤凰
export function UChicagoPhoenixBadge({ className = "h-12", alt = "University of Chicago Shield", ...props }: LogoProps) {
  return (
    <img
      src="/logos/uchicago.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 9. 罗切斯特理工学院 (RIT) 官方校徽钢印
export function RitTigerEmblem({ className = "h-11", alt = "RIT Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/rit.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 10. 天普大学 (Temple University) 官方钻石 "T" 字标
export function TempleDiamondT({ className = "h-10", alt = "Temple University Logo", ...props }: LogoProps) {
  return (
    <img
      src="/logos/temple.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 11. 德州农工大学 (Texas A&M) 官方教务长大印与大奖章
export function TexasAmOfficialSeal({ className = "h-16", alt = "Texas A&M University Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/texas_am.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 12. 纽约大学 (NYU) 斯特恩紫罗兰官方校徽火炬大印
export function NyuTorchBadge({ className = "h-12", alt = "New York University Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/nyu.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 13. 加州大学伯克利分校 (UC Berkeley) 官方公章大印
export function BerkeleyOfficialSeal({ className = "h-16", alt = "UC Berkeley Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/berkeley.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 14. 加州州立大学富勒顿分校 (CSUF) 官方校徽
export function CsufOfficialSeal({ className = "h-14", alt = "CSUF Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/csuf.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 15. 维多利亚大学 (Victoria University) 官方蓝黄标识
export function VictoriaUniversityLogo({ className = "h-10", alt = "Victoria University Logo", ...props }: LogoProps) {
  return (
    <img
      src="/logos/victoria.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 16. 加州大学洛杉矶分校 (UCLA) 官方公章大印
export function UclaOfficialSeal({ className = "h-14", alt = "UCLA Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/ucla.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 17. 斯坦福大学 (Stanford University) 官方杉树校徽
export function StanfordOfficialSeal({ className = "h-14", alt = "Stanford University Official Seal", ...props }: LogoProps) {
  return (
    <img
      src="/logos/stanford.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  )
}

// 18. 美国国土安全部 REAL ID 黄金五角星标
export function RealIdStarBadge({ className = "h-7", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="16" cy="16" r="15" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <polygon
        points="16,6 18.8,12.5 26,13.2 20.6,18 22.2,25 16,21.2 9.8,25 11.4,18 6,13.2 13.2,12.5"
        fill="#ffffff"
      />
    </svg>
  )
}

/**
 * 智能高校 Logo 解析器：传入任意大学名称，自动匹配并返回高精官方矢量图路径
 */
export function getUniversityLogoUrl(name?: string): string | null {
  if (!name) return null
  const n = name.toLowerCase()
  if (n.includes("harvard")) return "/logos/harvard.svg"
  if (n.includes("massachusetts institute") || n.includes("mit")) return "/logos/mit.svg"
  if (n.includes("stanford")) return "/logos/stanford.svg"
  if (n.includes("berkeley")) return "/logos/berkeley.svg"
  if (n.includes("los angeles") || n.includes("ucla")) return "/logos/ucla.svg"
  if (n.includes("chicago")) return "/logos/uchicago.svg"
  if (n.includes("texas a&m") || n.includes("texas a & m")) return "/logos/texas_am.svg"
  if (n.includes("new york university") || n.includes("nyu")) return "/logos/nyu.svg"
  if (n.includes("temple")) return "/logos/temple.svg"
  if (n.includes("rochester institute") || n.includes("rit")) return "/logos/rit.svg"
  if (n.includes("fullerton") || n.includes("csuf")) return "/logos/csuf.svg"
  if (n.includes("victoria")) return "/logos/victoria.svg"
  return null
}
