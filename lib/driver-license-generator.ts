import type { PersonData } from "./types"

export interface DriverLicenseData {
  state: string
  stateFullName: string
  motto: string
  licenseNumber: string
  personName: string
  lastName: string
  firstName: string
  addressLine: string
  cityStateZip: string
  dob: string
  issDate: string
  expDate: string
  sex: "M" | "F"
  height: string
  weight: string
  eyes: string
  hair: string
  licenseClass: string
  endorsements: string
  restrictions: string
  donor: boolean
  realIdType: "gold_star" | "black_star" | "standard"
  bannerColor: string
}

const parseBirthYear = (bday: string): number => {
  if (!bday) return 1998
  const parts = bday.split(/[-/.]/)
  for (const p of parts) {
    const val = parseInt(p, 10)
    if (val >= 1940 && val <= 2024) return val
  }
  return 1998
}

export function generateDriverLicense(person: PersonData, targetState?: string): DriverLicenseData {
  const st = (targetState || person.state || "NY").toUpperCase()
  const birthYear = parseBirthYear(person.birthday)

  // Ensure issue date is in past (<= 2024)
  const issYear = Math.min(Math.max(birthYear + 18, 2019), 2023)
  const issMonth = (person.birthday.includes("/") ? person.birthday.split("/")[0] : "05").padStart(2, "0")
  const issDay = (person.birthday.includes("/") ? person.birthday.split("/")[1] : "12").padStart(2, "0")

  const issDate = `${issMonth}/${issDay}/${issYear}`
  const expYear = issYear + 5
  const expDate = `${issMonth}/${issDay}/${expYear}`

  // State-specific mottos & DL format
  const stateConfigs: Record<string, { motto: string; bannerColor: string; name: string }> = {
    NY: { motto: "EXCELSIOR · EMPIRE STATE", bannerColor: "from-blue-900 to-blue-800", name: "NEW YORK" },
    WI: { motto: "FORWARD · AMERICA'S DAIRYLAND", bannerColor: "from-red-900 to-rose-800", name: "WISCONSIN" },
    CA: { motto: "EUREKA · GOLDEN STATE", bannerColor: "from-amber-800 to-amber-700", name: "CALIFORNIA" },
    TX: { motto: "FRIENDSHIP · LONE STAR STATE", bannerColor: "from-blue-950 to-indigo-900", name: "TEXAS" },
    FL: { motto: "SUNSHINE STATE", bannerColor: "from-emerald-900 to-teal-800", name: "FLORIDA" },
  }

  const config = stateConfigs[st] || {
    motto: "UNITED STATES · REAL ID",
    bannerColor: "from-slate-900 to-slate-800",
    name: person.stateFullName?.toUpperCase() || st,
  }

  // DL number format
  const hash = Math.abs(parseInt(person.ssn.replace(/\D/g, "") || "987654321", 10))
  let dlNum = `${(hash % 899999999 + 100000000)}`
  if (st === "WI" || st === "CA") {
    dlNum = `${person.lastName.charAt(0).toUpperCase()}${(hash % 8999999 + 1000000)}`
  }

  const eyeColors = ["BRO", "BLU", "HAZ", "GRN", "GRY"]
  const eyes = eyeColors[hash % eyeColors.length]

  const hairColors = ["BRO", "BLK", "BLN", "RED"]
  const hair = hairColors[(hash >> 2) % hairColors.length]

  return {
    state: st,
    stateFullName: config.name,
    motto: config.motto,
    licenseNumber: dlNum,
    personName: person.fullName.toUpperCase(),
    lastName: person.lastName.toUpperCase(),
    firstName: person.firstName.toUpperCase(),
    addressLine: person.street.toUpperCase(),
    cityStateZip: `${person.city.toUpperCase()}, ${st} ${person.zipCode}`,
    dob: person.birthday,
    issDate,
    expDate,
    sex: person.gender === "Female" ? "F" : "M",
    height: person.height || "5'-10\"",
    weight: person.weight || "165 lb",
    eyes,
    hair,
    licenseClass: "D - OPERATOR",
    endorsements: "NONE",
    restrictions: "NONE",
    donor: (hash % 3) === 0,
    realIdType: "gold_star",
    bannerColor: config.bannerColor,
  }
}
