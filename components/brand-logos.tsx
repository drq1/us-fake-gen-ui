"use client"

import React from "react"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number
}

// 1. College Board 官方橡果标与字标
export function CollegeBoardLogo({ className = "h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* 官方橡果蓝黄几何标识 */}
      <circle cx="24" cy="24" r="20" fill="#0077c8" />
      <path
        d="M24 10C16.268 10 10 16.268 10 24C10 29.5 13.2 34.2 17.8 36.4C16.6 33 16 29.2 16 25C16 19.5 19 14.5 24 12C29 14.5 32 19.5 32 25C32 29.2 31.4 33 30.2 36.4C34.8 34.2 38 29.5 38 24C38 16.268 31.732 10 24 10Z"
        fill="#ffb81c"
      />
      <circle cx="24" cy="24" r="5" fill="#ffffff" />
      {/* CollegeBoard 品牌文字 */}
      <text x="52" y="30" fill="#0077c8" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5">
        CollegeBoard
      </text>
    </svg>
  )
}

// 2. ACT 官方标准斜体方块标识
export function ActLogo({ className = "h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect width="120" height="44" rx="4" fill="#002f6c" />
      <text
        x="60"
        y="31"
        fill="#ffffff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="28"
        fontStyle="italic"
        textAnchor="middle"
        letterSpacing="1"
      >
        ACT
      </text>
    </svg>
  )
}

// 3. Parchment 官方电子交付绿色螺旋与字标
export function ParchmentLogo({ className = "h-6", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Parchment 经典绿色螺旋徽标 */}
      <circle cx="18" cy="18" r="14" fill="#003865" />
      <path
        d="M12 18C12 14.686 14.686 12 18 12C21.314 12 24 14.686 24 18C24 21.314 21.314 24 18 24C16.343 24 15 22.657 15 21C15 19.343 16.343 18 18 18"
        stroke="#48bb78"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* parchment 文字 */}
      <text x="40" y="24" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="18" letterSpacing="0.5">
        parchment
      </text>
    </svg>
  )
}

// 4. Bank of America 官方红蓝双色旗帜标与字标
export function BankOfAmericaLogo({ className = "h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* 经典几何条纹旗标 */}
      <g transform="translate(0, 4)">
        {/* 红条纹 (上中下) */}
        <rect x="0" y="0" width="16" height="8" fill="#e31837" />
        <rect x="0" y="12" width="22" height="8" fill="#e31837" />
        <rect x="0" y="24" width="14" height="8" fill="#e31837" />
        {/* 蓝条纹 (右侧交错) */}
        <rect x="20" y="0" width="12" height="8" fill="#002d72" />
        <rect x="26" y="12" width="8" height="8" fill="#002d72" />
        <rect x="18" y="24" width="16" height="8" fill="#002d72" />
      </g>
      {/* 品牌名称 */}
      <text x="44" y="26" fill="#002d72" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.3">
        Bank of America
      </text>
    </svg>
  )
}

// 5. U.S. Bank 官方盾标与小写 usbank 标志
export function UsBankLogo({ className = "h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 170 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* 深蓝盾牌徽标 */}
      <rect x="0" y="3" width="32" height="32" rx="4" fill="#0c2340" />
      {/* 红色点睛旗角 */}
      <path d="M8 11H24L21 21H5L8 11Z" fill="#d9272e" />
      {/* usbank 标志文字 */}
      <text x="40" y="27" fill="#0c2340" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.5">
        us
      </text>
      <text x="64" y="27" fill="#d9272e" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.5">
        bank
      </text>
    </svg>
  )
}

// 6. 哈佛大学 Veritas 绯红神圣盾徽
export function HarvardVeritasShield({ className = "h-12", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* 绯红底盾 */}
      <path
        d="M5 5H85V55C85 75 45 95 45 95C45 95 5 75 5 55V5Z"
        fill="#a51c30"
        stroke="#ffffff"
        strokeWidth="3"
      />
      {/* 3本金色展开的圣书: VE - RI - TAS */}
      {/* 书1: VE */}
      <rect x="18" y="16" width="24" height="18" rx="2" fill="#ffffff" stroke="#e2d9c2" strokeWidth="1" />
      <text x="30" y="29" fill="#1a1a1a" fontFamily="Georgia, serif" fontWeight="bold" fontSize="10" textAnchor="middle">
        VE
      </text>
      {/* 书2: RI */}
      <rect x="48" y="16" width="24" height="18" rx="2" fill="#ffffff" stroke="#e2d9c2" strokeWidth="1" />
      <text x="60" y="29" fill="#1a1a1a" fontFamily="Georgia, serif" fontWeight="bold" fontSize="10" textAnchor="middle">
        RI
      </text>
      {/* 书3: TAS */}
      <rect x="33" y="44" width="24" height="18" rx="2" fill="#ffffff" stroke="#e2d9c2" strokeWidth="1" />
      <text x="45" y="57" fill="#1a1a1a" fontFamily="Georgia, serif" fontWeight="bold" fontSize="8.5" textAnchor="middle">
        TAS
      </text>
    </svg>
  )
}

// 7. MIT Sloan 斯隆管理学院标志性五道杠标
export function MitStripesLogo({ className = "h-7", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="0" y="0" width="5" height="32" fill="#a31f34" />
      <rect x="9" y="12" width="5" height="20" fill="#a31f34" />
      <rect x="18" y="0" width="5" height="32" fill="#a31f34" />
      <rect x="27" y="10" width="5" height="22" fill="#a31f34" />
      <rect x="36" y="0" width="5" height="32" fill="#a31f34" />
    </svg>
  )
}

// 8. 芝加哥大学 Phoenix 浴火凤凰徽标
export function UChicagoPhoenixBadge({ className = "h-11", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="40" cy="40" r="38" fill="#800000" stroke="#ffffff" strokeWidth="2" />
      <circle cx="40" cy="40" r="32" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* 展翅凤凰轮廓 */}
      <path
        d="M40 18L44 28C50 24 58 24 64 30C58 34 54 40 54 48C54 56 46 64 40 64C34 64 26 56 26 48C26 40 22 34 16 30C22 24 30 24 36 28L40 18Z"
        fill="#d4af37"
      />
      <circle cx="40" cy="22" r="3" fill="#ffffff" />
      <text x="40" y="73" fill="#ffffff" fontFamily="Georgia, serif" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        1890
      </text>
    </svg>
  )
}

// 9. 罗切斯特理工学院 (RIT) 官方橙黑虎爪标
export function RitTigerEmblem({ className = "h-9", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect width="90" height="36" rx="3" fill="#f76902" />
      <text x="45" y="26" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="24" textAnchor="middle" letterSpacing="-1">
        RIT
      </text>
    </svg>
  )
}

// 10. 天普大学 (Temple University) 官方钻石 "T" 字标
export function TempleDiamondT({ className = "h-9", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect width="40" height="40" rx="3" fill="#9d2235" />
      {/* 经典的粗横杠与斜立柱 T */}
      <path
        d="M8 10H32V16H23V30H17V16H8V10Z"
        fill="#ffffff"
      />
    </svg>
  )
}

// 11. 德州农工大学 (Texas A&M) 官方酒红钢印大徽章
export function TexasAmOfficialSeal({ className = "h-16", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="50" cy="50" r="47" stroke="#500000" strokeWidth="3" fill="#fdf2f4" />
      <circle cx="50" cy="50" r="41" stroke="#500000" strokeWidth="1" strokeDasharray="3 2" />
      {/* 德州孤星 Lone Star */}
      <polygon
        points="50,22 55,37 71,37 58,47 63,62 50,52 37,62 42,47 29,37 45,37"
        fill="#500000"
      />
      <text x="50" y="78" fill="#500000" fontFamily="Georgia, serif" fontWeight="900" fontSize="7.5" textAnchor="middle" letterSpacing="0.5">
        TEXAS A&M 1876
      </text>
      <text x="50" y="87" fill="#500000" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="5.5" textAnchor="middle" letterSpacing="1">
        OFFICE OF REGISTRAR
      </text>
    </svg>
  )
}

// 12. 纽大 (NYU) 斯特恩紫罗兰火炬火把徽章
export function NyuTorchBadge({ className = "h-12", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* 斯特恩深紫盾 */}
      <path d="M5 5H55V42C55 58 30 67 30 67C30 67 5 58 5 42V5Z" fill="#57068c" />
      {/* 知识火把 Torch */}
      <path d="M30 15L34 26H26L30 15Z" fill="#ffcc00" />
      <path d="M28 26H32V42H28V26Z" fill="#ffffff" />
      <circle cx="30" cy="18" r="4" fill="#ff6600" opacity="0.8" />
      <text x="30" y="55" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="bold" fontSize="7" textAnchor="middle">
        NYU
      </text>
    </svg>
  )
}

// 13. 国土安全部 REAL ID 黄金星标
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
