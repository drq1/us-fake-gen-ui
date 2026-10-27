import type { PersonData, SchoolData } from "./types"
import type { SatActReportData, SatScoreData, ActScoreData } from "./sat-act-types"

const parseBirthYear = (bday: string): number => {
  if (!bday) return 1998
  const parts = bday.split(/[-/.]/)
  for (const p of parts) {
    const val = parseInt(p, 10)
    if (val >= 1940 && val <= 2024) return val
  }
  return 1998
}

export function generateSatActReport(
  person: PersonData,
  school: SchoolData | null,
  seed = 2026
): SatActReportData {
  const birthYear = parseBirthYear(person.birthday)
  const testYear = Math.min(birthYear + 17, 2023)
  const hsName = school?.name || `${person.city || "Lincoln"} High School`
  const hsCode = school?.ncesid ? school.ncesid.slice(-6) : `${(seed % 89999 + 10000)}`

  // SAT Scores (High competitive scores between 1440 and 1580)
  const mathScore = 720 + ((seed * 7) % 8) * 10 // 720 - 790
  const erwScore = 700 + ((seed * 13) % 9) * 10 // 700 - 780
  const totalScore = mathScore + erwScore

  const sat: SatScoreData = {
    testType: "SAT",
    testDate: `October 14, ${testYear}`,
    registrationNumber: `00${(seed * 37 % 89999999 + 10000000)}`,
    sex: person.gender === "Female" ? "Female" : "Male",
    dob: person.birthday,
    highSchoolName: hsName,
    highSchoolCode: hsCode,
    totalScore,
    erwScore,
    mathScore,
    readingScore: Math.floor(erwScore / 20),
    writingScore: Math.round(erwScore / 20),
    mathCrossScore: Math.floor(mathScore / 20),
    nationalPercentile: totalScore >= 1530 ? 99 : totalScore >= 1480 ? 98 : 96,
    userPercentile: totalScore >= 1530 ? 99 : 97,
  }

  // ACT Scores (Competitive scores between 32 and 36)
  const compositeScore = 32 + (seed % 5) // 32 - 36
  const actMath = Math.min(36, compositeScore + ((seed % 3) - 1))
  const actScience = Math.min(36, compositeScore + (((seed * 2) % 3) - 1))
  const actEnglish = Math.min(36, compositeScore + (((seed * 3) % 3) - 1))
  const actReading = Math.min(36, compositeScore + (((seed * 5) % 3) - 1))
  const actStem = Math.round((actMath + actScience) / 2)
  const actEla = Math.round((actEnglish + actReading) / 2)

  const act: ActScoreData = {
    testType: "ACT",
    testDate: `April 08, ${testYear}`,
    actId: `-8${(seed * 43 % 8999999 + 1000000)}`,
    highSchoolName: hsName,
    highSchoolCode: hsCode,
    compositeScore,
    mathScore: actMath,
    scienceScore: actScience,
    stemScore: actStem,
    englishScore: actEnglish,
    readingScore: actReading,
    writingScore: 10 + (seed % 3), // 10 - 12
    elaScore: actEla,
    usRankPercentile: compositeScore >= 35 ? 99 : compositeScore >= 34 ? 99 : 98,
    stateRankPercentile: compositeScore >= 34 ? 99 : 98,
  }

  return {
    studentName: person.fullName,
    address: person.street,
    cityStateZip: `${person.city}, ${person.state} ${person.zipCode}`,
    sat,
    act,
  }
}
