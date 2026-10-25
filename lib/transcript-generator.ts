import type { PersonData, SchoolData } from "./types"
import type { StudentTranscript, AcademicYearRecord, CourseRecord } from "./transcript-types"
import { US_STATES } from "./constants"

// 简单可复现的伪随机数发生器
function seededRandom(seed: number): () => number {
  let s = Math.abs(seed) || 123456
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// 评分对照表与分值计算
const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
}

// 州默认知名公立高中备选库（当未连接外部接口或离线时备选）
const DEFAULT_STATE_HIGH_SCHOOLS: Record<
  string,
  { name: string; address: string; city: string; zip: string; phone: string; ceeb: string }
> = {
  CA: {
    name: "Beverly Hills High School",
    address: "241 Moreno Dr",
    city: "Beverly Hills",
    zip: "90212",
    phone: "(310) 551-5100",
    ceeb: "050290",
  },
  NY: {
    name: "Stuyvesant High School",
    address: "345 Chambers St",
    city: "New York",
    zip: "10282",
    phone: "(212) 312-4800",
    ceeb: "334615",
  },
  TX: {
    name: "Westlake High School",
    address: "4100 Westbank Dr",
    city: "Austin",
    zip: "78746",
    phone: "(512) 732-9280",
    ceeb: "440343",
  },
  WA: {
    name: "Bellevue High School",
    address: "10416 SE Wolverine Way",
    city: "Bellevue",
    zip: "98004",
    phone: "(425) 456-7000",
    ceeb: "480055",
  },
  OR: {
    name: "Lincoln High School",
    address: "1750 SW Salmon St",
    city: "Portland",
    zip: "97205",
    phone: "(503) 916-5200",
    ceeb: "380885",
  },
  DE: {
    name: "Charter School of Wilmington",
    address: "100 N Dupont Rd",
    city: "Wilmington",
    zip: "19807",
    phone: "(302) 651-2727",
    ceeb: "080164",
  },
}

export function generateTranscriptData(
  person: PersonData,
  school?: SchoolData | null,
  seed: number = 2026,
): StudentTranscript {
  const rand = seededRandom(seed)

  // 1. 推算毕业年份与学年 (严格确保所有学业、毕业与发证时间均为已发生的过去时间，绝不生成未来时间)
  let birthYear = 2004
  if (person.birthday) {
    const parts = person.birthday.split(/[-/]/)
    if (parts.length >= 3) {
      const parsed = parseInt(parts[0], 10) > 1900 ? parseInt(parts[0], 10) : parseInt(parts[2], 10)
      if (!isNaN(parsed) && parsed > 1940 && parsed < 2020) {
        birthYear = parsed
      }
    }
  }

  // 美国高中正常在 18 周岁毕业；已完成成绩单上限锚定为 2024 年，严禁生成未来学年
  const MAX_COMPLETED_YEAR = 2024
  let gradYear = birthYear + 18
  if (gradYear > MAX_COMPLETED_YEAR) {
    gradYear = MAX_COMPLETED_YEAR
  }
  if (gradYear < 1980) {
    gradYear = 2018
  }

  // 2. 学校信息确定
  const stateCode = (person.state || "CA").toUpperCase()
  const defaultSchool = DEFAULT_STATE_HIGH_SCHOOLS[stateCode] || {
    name: `${person.city || "Central"} High School`,
    address: `${100 + Math.floor(rand() * 800)} Education Way`,
    city: person.city || "Springfield",
    zip: person.zipCode || "90001",
    phone: "(555) 019-2834",
    ceeb: `${100000 + Math.floor(rand() * 899999)}`,
  }

  const schoolName = school?.name?.trim() ? school.name : defaultSchool.name
  const schoolAddress = school?.address?.trim() ? school.address : defaultSchool.address
  const schoolCity = school?.city?.trim() ? school.city : (person.city || defaultSchool.city)
  const schoolState = school?.state?.trim() ? school.state : stateCode
  const schoolZip = school?.zip?.trim() ? school.zip : defaultSchool.zip
  const schoolPhone = school?.telephone?.trim() ? school.telephone : defaultSchool.phone
  const ncesId = school?.ncesid?.trim() ? school.ncesid : `${Math.floor(100000000000 + rand() * 900000000000)}`
  const ceebCode = defaultSchool.ceeb

  // 3. 课程模板与成绩分配函数
  const pickGrade = (isAP: boolean = false): { sem1: string; sem2: string; finalGrade: string } => {
    const roll = rand()
    if (roll > 0.45) return { sem1: "A", sem2: "A", finalGrade: "A" }
    if (roll > 0.25) return { sem1: "A-", sem2: "A", finalGrade: "A" }
    if (roll > 0.12) return { sem1: "B+", sem2: "A-", finalGrade: "A-" }
    if (roll > 0.05) return { sem1: "B+", sem2: "B+", finalGrade: "B+" }
    return isAP ? { sem1: "B", sem2: "B+", finalGrade: "B+" } : { sem1: "A-", sem2: "A-", finalGrade: "A-" }
  }

  // 4. 四个学年的课程结构构建
  const createCourses = (gradeNum: number): CourseRecord[] => {
    switch (gradeNum) {
      case 9:
        return [
          { code: "ENG101", title: "English 9: Literature & Composition (H)", ...pickGrade(), credits: 1.0, isWeighted: true },
          { code: "MTH101", title: "Algebra I (Honors)", ...pickGrade(), credits: 1.0, isWeighted: true },
          { code: "SCI101", title: "Biology with Laboratory", ...pickGrade(), credits: 1.0 },
          { code: "SOC101", title: "World History & Geography", ...pickGrade(), credits: 1.0 },
          { code: "FL101", title: "Spanish I", ...pickGrade(), credits: 1.0 },
          { code: "PE101", title: "Health and Physical Education 9", ...pickGrade(), credits: 0.5 },
          { code: "ART101", title: "Introduction to Studio Art", ...pickGrade(), credits: 0.5 },
        ]
      case 10:
        return [
          { code: "ENG201", title: "English 10: World Literature (H)", ...pickGrade(), credits: 1.0, isWeighted: true },
          { code: "MTH201", title: "Geometry (Honors)", ...pickGrade(), credits: 1.0, isWeighted: true },
          { code: "SCI201", title: "Chemistry with Laboratory", ...pickGrade(), credits: 1.0 },
          { code: "SOC201", title: "AP European History", ...pickGrade(true), credits: 1.0, isWeighted: true },
          { code: "FL102", title: "Spanish II", ...pickGrade(), credits: 1.0 },
          { code: "PE102", title: "Health and Physical Education 10", ...pickGrade(), credits: 0.5 },
          { code: "CS101", title: "AP Computer Science Principles", ...pickGrade(true), credits: 1.0, isWeighted: true },
        ]
      case 11:
        return [
          { code: "ENG301", title: "AP English Language & Composition", ...pickGrade(true), credits: 1.0, isWeighted: true },
          { code: "MTH301", title: "Algebra II & Trigonometry (H)", ...pickGrade(), credits: 1.0, isWeighted: true },
          { code: "SCI301", title: "Physics with Laboratory", ...pickGrade(), credits: 1.0 },
          { code: "SOC301", title: "AP United States History", ...pickGrade(true), credits: 1.0, isWeighted: true },
          { code: "FL103", title: "Spanish III (Honors)", ...pickGrade(), credits: 1.0, isWeighted: true },
          { code: "PSY101", title: "AP Psychology", ...pickGrade(true), credits: 1.0, isWeighted: true },
        ]
      case 12:
      default:
        return [
          { code: "ENG401", title: "AP English Literature & Composition", ...pickGrade(true), credits: 1.0, isWeighted: true },
          { code: "MTH401", title: "AP Calculus AB", ...pickGrade(true), credits: 1.0, isWeighted: true },
          { code: "SCI401", title: "AP Environmental Science", ...pickGrade(true), credits: 1.0, isWeighted: true },
          { code: "SOC401", title: "United States Government & Politics", ...pickGrade(), credits: 0.5 },
          { code: "ECON401", title: "Principles of Macroeconomics", ...pickGrade(), credits: 0.5 },
          { code: "COMM101", title: "Public Speaking & Debate", ...pickGrade(), credits: 0.5 },
          { code: "SEN101", title: "Senior Leadership Seminar", ...pickGrade(), credits: 0.5 },
        ]
    }
  }

  const gradeNames: Record<number, string> = {
    9: "Grade 9 (Freshman)",
    10: "Grade 10 (Sophomore)",
    11: "Grade 11 (Junior)",
    12: "Grade 12 (Senior)",
  }

  // 5. 组装 4 年学年记录并计算 GPA
  const academicYears: AcademicYearRecord[] = [9, 10, 11, 12].map((g, idx) => {
    const startYear = gradYear - (4 - idx)
    const endYear = startYear + 1
    const courses = createCourses(g)

    let totalPoints = 0
    let totalCredits = 0
    courses.forEach((c) => {
      const basePoint = GRADE_POINTS[c.finalGrade] ?? 4.0
      totalPoints += basePoint * c.credits
      totalCredits += c.credits
    })

    const termGpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 4.0

    return {
      gradeLevel: gradeNames[g],
      gradeNumber: g,
      schoolYear: `${startYear} - ${endYear}`,
      termGpa,
      termCredits: totalCredits,
      courses,
    }
  })

  // 6. 全局累积 GPA 核算（未加权 4.0，加权 5.0）
  let cumUnweightedPoints = 0
  let cumWeightedPoints = 0
  let cumCredits = 0

  academicYears.forEach((yr) => {
    yr.courses.forEach((c) => {
      const basePoint = GRADE_POINTS[c.finalGrade] ?? 4.0
      cumUnweightedPoints += basePoint * c.credits
      const weightBonus = c.isWeighted ? 0.5 : 0 // AP/Honors 加权
      cumWeightedPoints += (basePoint + weightBonus) * c.credits
      cumCredits += c.credits
    })
  })

  const unweightedGpa = parseFloat((cumUnweightedPoints / cumCredits).toFixed(2))
  const weightedGpa = parseFloat((cumWeightedPoints / cumCredits).toFixed(2))

  // 班级排位 (模拟 300~450 名学生中前 10%~15%)
  const classTotal = 320 + Math.floor(rand() * 120)
  const rank = 15 + Math.floor(rand() * 25)
  const classRank = `${rank} of ${classTotal} (Top ${Math.round((rank / classTotal) * 100)}%)`

  // 标化考试 (SAT)
  const mathScore = 670 + Math.floor(rand() * 10) * 10
  const erwScore = 660 + Math.floor(rand() * 10) * 10

  const studentId = `STU-${10000000 + Math.floor(rand() * 89999999)}`
  const stateObj = US_STATES.find((s) => s.code === schoolState)

  return {
    schoolName,
    districtName: `${schoolCity} Unified School District`,
    schoolAddress,
    schoolCity,
    schoolState: stateObj ? stateObj.name : schoolState,
    schoolZip,
    schoolPhone,
    ceebCode,
    ncesId,

    studentName: person.fullName?.toUpperCase() || "JOHN DOE",
    studentId,
    dob: person.birthday || "2006-05-14",
    gender: person.gender || "Male",
    graduationDate: `June 07, ${gradYear}`,
    counselorName: "Sarah M. Jenkins, M.Ed.",
    diplomaType: "Standard College Preparatory Diploma",

    unweightedGpa,
    weightedGpa,
    classRank,
    totalCreditsEarned: cumCredits,
    totalCreditsAttempted: cumCredits,

    academicYears,

    satScore: {
      total: mathScore + erwScore,
      math: mathScore,
      erw: erwScore,
      testDate: `March ${gradYear - 1}`,
    },
    actScore: 31 + Math.floor(rand() * 4),
    honors: [
      "National Honor Society (NHS) Inductee",
      "AP Scholar with Honor (College Board)",
      "Presidential Academic Excellence Award",
    ],

    principalName: "Dr. Arthur Pendelton, Ed.D.",
    registrarName: "Karen L. Montgomery",
    issueDate: `June 12, ${gradYear}`,
    isOfficial: true,
  }
}
