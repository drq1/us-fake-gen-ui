import type { PersonData } from "./types"

export interface BirthCertificateData {
  state: string
  county: string
  certificateNumber: string
  childFullName: string
  sex: "Male" | "Female"
  dateOfBirth: string
  timeOfBirth: string
  facilityName: string
  cityOfBirth: string
  fatherName: string
  fatherBirthState: string
  motherMaidenName: string
  motherBirthState: string
  stateRegistrar: string
  fileDate: string
}

export interface GedCertificateData {
  state: string
  stateBoardName: string
  recipientName: string
  documentNumber: string
  issueDate: string
  standardScores: { subject: string; score: number }[]
  averageScore: number
  superintendentName: string
}

export interface MarriageCertificateData {
  state: string
  county: string
  marriageId: string
  groomName: string
  brideName: string
  ceremonyDate: string
  officiantName: string
  countyClerkName: string
}

export interface SkillCertificateData {
  certTitle: string
  organization: string
  recipientName: string
  issueDate: string
  expDate: string
  certificationId: string
  instructorName: string
}

export interface VitalRecordsData {
  birth: BirthCertificateData
  ged: GedCertificateData
  marriage: MarriageCertificateData
  skill: SkillCertificateData
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

export function generateVitalRecords(person: PersonData, seed: number): VitalRecordsData {
  const birthYear = parseBirthYear(person.birthday)
  const st = person.state || "TX"
  const county = `${person.city || "Travis"} County`
  const hash = Math.abs(parseInt(person.ssn.replace(/\D/g, "") || "123456789", 10))

  // 1. 出生证明
  const birth: BirthCertificateData = {
    state: person.stateFullName || "Texas",
    county,
    certificateNumber: `VS-${birthYear}-${(hash % 899999 + 100000)}`,
    childFullName: person.fullName,
    sex: person.gender === "Female" ? "Female" : "Male",
    dateOfBirth: person.birthday,
    timeOfBirth: `${(hash % 12) + 1}:${(hash % 50 + 10).toString().padStart(2, "0")} ${hash % 2 === 0 ? "AM" : "PM"}`,
    facilityName: `${person.city || "Central"} Memorial Regional Medical Center`,
    cityOfBirth: person.city || "Austin",
    fatherName: `Robert ${person.lastName}`,
    fatherBirthState: st,
    motherMaidenName: `Mary ${["Smith", "Johnson", "Williams", "Brown"][hash % 4]}`,
    motherBirthState: st,
    stateRegistrar: "Dr. Eleanor Vance, M.D. - State Registrar of Vital Statistics",
    fileDate: person.birthday,
  }

  // 2. GED 文凭证书
  const gedYear = Math.min(birthYear + 18, 2023)
  const ged: GedCertificateData = {
    state: person.stateFullName || "Texas",
    stateBoardName: `State Board of Education & Department of Workforce Development`,
    recipientName: person.fullName,
    documentNumber: `GED-${gedYear}-${(hash * 7 % 899999 + 100000)}`,
    issueDate: `06/20/${gedYear}`,
    standardScores: [
      { subject: "Mathematical Reasoning", score: 168 },
      { subject: "Reasoning Through Language Arts", score: 172 },
      { subject: "Social Studies & Civics", score: 165 },
      { subject: "Science & Engineering Practices", score: 170 },
    ],
    averageScore: 168.75,
    superintendentName: "Commissioner of Public Education",
  }

  // 3. 结婚证明
  const marriageYear = Math.min(Math.max(birthYear + 24, 2018), 2023)
  const spouseLastNames = ["Davis", "Miller", "Wilson", "Anderson", "Taylor"]
  const spouseFirst = person.gender === "Female" ? "David" : "Sarah"
  const spouseName = `${spouseFirst} ${spouseLastNames[hash % spouseLastNames.length]}`
  const marriage: MarriageCertificateData = {
    state: person.stateFullName || "Texas",
    county,
    marriageId: `MC-${marriageYear}-${(hash * 13 % 899999 + 100000)}`,
    groomName: person.gender === "Female" ? spouseName : person.fullName,
    brideName: person.gender === "Female" ? person.fullName : spouseName,
    ceremonyDate: `10/14/${marriageYear}`,
    officiantName: "Judge Michael R. Sterling, Presiding Magistrate",
    countyClerkName: "County Clerk & Recorder of Deeds",
  }

  // 4. 技能认证
  const skillYear = Math.min(2023, 2024)
  const skill: SkillCertificateData = {
    certTitle: "Basic Life Support (BLS) & Heartsaver CPR / AED",
    organization: "American Health & Safety Institute (ASHI / AHA Standards)",
    recipientName: person.fullName,
    issueDate: `03/10/${skillYear}`,
    expDate: `03/10/${skillYear + 2}`,
    certificationId: `ASHI-CPR-${(hash * 23 % 8999999 + 1000000)}`,
    instructorName: "Sarah Jenkins, RN - Certified Instructor #94821",
  }

  return { birth, ged, marriage, skill }
}
