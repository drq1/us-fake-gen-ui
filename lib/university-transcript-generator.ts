import type { PersonData, UniversityData } from "./types"
import type {
  CollegeCourse,
  CollegeSemester,
  UniversityTranscriptData,
} from "./university-transcript-types"

interface DegreeCatalog {
  degreeName: string
  major: string
  minor?: string
  coursesByYear: {
    freshmanFall: Array<{ code: string; title: string; credits: number }>
    freshmanSpring: Array<{ code: string; title: string; credits: number }>
    sophomoreFall: Array<{ code: string; title: string; credits: number }>
    sophomoreSpring: Array<{ code: string; title: string; credits: number }>
    juniorFall: Array<{ code: string; title: string; credits: number }>
    juniorSpring: Array<{ code: string; title: string; credits: number }>
    seniorFall: Array<{ code: string; title: string; credits: number }>
    seniorSpring: Array<{ code: string; title: string; credits: number }>
  }
}

const COMPUTER_SCIENCE_CATALOG: DegreeCatalog = {
  degreeName: "Bachelor of Science",
  major: "Computer Science",
  minor: "Mathematics",
  coursesByYear: {
    freshmanFall: [
      { code: "CS 110", title: "Intro to Computer Science & Python", credits: 4 },
      { code: "MATH 141", title: "Calculus I: Differential Calculus", credits: 4 },
      { code: "ENGL 101", title: "Academic Writing & Research", credits: 3 },
      { code: "HIST 120", title: "Western Civilization & Modernity", credits: 3 },
    ],
    freshmanSpring: [
      { code: "CS 180", title: "Object-Oriented Programming (Java/C++)", credits: 4 },
      { code: "MATH 142", title: "Calculus II: Integral Calculus", credits: 4 },
      { code: "PHYS 151", title: "General Physics I: Mechanics", credits: 4 },
      { code: "PSYC 101", title: "General Psychology & Human Behavior", credits: 3 },
    ],
    sophomoreFall: [
      { code: "CS 210", title: "Data Structures & Algorithm Design", credits: 4 },
      { code: "CS 220", title: "Computer Architecture & Assembly", credits: 3 },
      { code: "MATH 240", title: "Linear Algebra & Applications", credits: 3 },
      { code: "PHYS 152", title: "General Physics II: Electromagnetism", credits: 4 },
      { code: "COMM 102", title: "Public Speaking & Technical Discourse", credits: 3 },
    ],
    sophomoreSpring: [
      { code: "CS 240", title: "Discrete Structures & Logic for CS", credits: 3 },
      { code: "CS 310", title: "Operating Systems & Concurrency", credits: 4 },
      { code: "STAT 250", title: "Probability & Statistics for Engineers", credits: 3 },
      { code: "ECON 101", title: "Principles of Microeconomics", credits: 3 },
      { code: "PHIL 205", title: "Technology Ethics & Society", credits: 3 },
    ],
    juniorFall: [
      { code: "CS 330", title: "Database Systems & Data Modeling", credits: 3 },
      { code: "CS 350", title: "Computer Networks & Internet Protocols", credits: 3 },
      { code: "CS 370", title: "Software Engineering & Team Design", credits: 4 },
      { code: "MATH 310", title: "Numerical Analysis & Computation", credits: 3 },
      { code: "MUSC 110", title: "Music Appreciation & Global Cultures", credits: 3 },
    ],
    juniorSpring: [
      { code: "CS 380", title: "Theory of Computation & Automata", credits: 3 },
      { code: "CS 420", title: "Artificial Intelligence & Heuristics", credits: 3 },
      { code: "CS 440", title: "Cloud Computing & Distributed Systems", credits: 3 },
      { code: "ENGL 305", title: "Advanced Technical Writing for STEM", credits: 3 },
      { code: "POLS 101", title: "American National Government", credits: 3 },
    ],
    seniorFall: [
      { code: "CS 450", title: "Machine Learning & Pattern Recognition", credits: 3 },
      { code: "CS 470", title: "Information Security & Cryptography", credits: 3 },
      { code: "CS 491", title: "Senior Capstone Design Project I", credits: 3 },
      { code: "ASTR 101", title: "Observational Astronomy", credits: 3 },
      { code: "MGMT 310", title: "Principles of Management & Leadership", credits: 3 },
    ],
    seniorSpring: [
      { code: "CS 485", title: "Big Data Processing & Stream Pipelines", credits: 3 },
      { code: "CS 492", title: "Senior Capstone Design Project II", credits: 3 },
      { code: "CS 498", title: "Undergraduate Research Colloquium", credits: 3 },
      { code: "ANTH 102", title: "Cultural Anthropology & Diversity", credits: 3 },
      { code: "PE 105", title: "Physical Wellness & Lifetime Fitness", credits: 1 },
    ],
  },
}

const BUSINESS_CATALOG: DegreeCatalog = {
  degreeName: "Bachelor of Business Administration",
  major: "Finance & Accounting",
  minor: "Economics",
  coursesByYear: {
    freshmanFall: [
      { code: "BUS 101", title: "Introduction to Business & Enterprise", credits: 3 },
      { code: "MATH 130", title: "Business Calculus & Finite Math", credits: 3 },
      { code: "ENGL 101", title: "College Composition & Rhetoric", credits: 3 },
      { code: "HIST 110", title: "Modern US Economic History", credits: 3 },
      { code: "PSYC 101", title: "General Psychology & Human Behavior", credits: 3 },
    ],
    freshmanSpring: [
      { code: "ACCT 201", title: "Principles of Financial Accounting", credits: 3 },
      { code: "ECON 101", title: "Microeconomic Theory & Practice", credits: 3 },
      { code: "STAT 201", title: "Business Statistics & Analytics", credits: 3 },
      { code: "COMM 101", title: "Effective Business Communications", credits: 3 },
      { code: "BIOL 101", title: "Environmental Ecology & Sustainability", credits: 3 },
    ],
    sophomoreFall: [
      { code: "ACCT 202", title: "Principles of Managerial Accounting", credits: 3 },
      { code: "ECON 102", title: "Macroeconomics & Global Markets", credits: 3 },
      { code: "MKTG 301", title: "Principles of Marketing & Consumer Value", credits: 3 },
      { code: "MIS 210", title: "Business Information Systems & Excel", credits: 3 },
      { code: "PHIL 201", title: "Business Ethics & Corporate Responsibility", credits: 3 },
    ],
    sophomoreSpring: [
      { code: "FIN 301", title: "Corporate Finance & Capital Budgeting", credits: 3 },
      { code: "MGMT 301", title: "Organizational Behavior & Leadership", credits: 3 },
      { code: "BLAW 310", title: "Legal Environment of Business & Contracts", credits: 3 },
      { code: "SCM 320", title: "Supply Chain & Operations Management", credits: 3 },
      { code: "ASTR 101", title: "Introduction to Astronomy", credits: 3 },
    ],
    juniorFall: [
      { code: "FIN 340", title: "Investment Analysis & Securities", credits: 3 },
      { code: "ACCT 311", title: "Intermediate Accounting I", credits: 3 },
      { code: "FIN 360", title: "Financial Markets & Institutions", credits: 3 },
      { code: "ECON 320", title: "Money, Banking & Monetary Policy", credits: 3 },
      { code: "COMM 315", title: "Executive Presentations & Negotiation", credits: 3 },
    ],
    juniorSpring: [
      { code: "FIN 410", title: "Portfolio Management & Wealth Planning", credits: 3 },
      { code: "ACCT 312", title: "Intermediate Accounting II", credits: 3 },
      { code: "FIN 430", title: "Corporate Valuation & M&A Analysis", credits: 3 },
      { code: "MIS 350", title: "Business Intelligence & SQL Analytics", credits: 3 },
      { code: "POLS 102", title: "International Political Economy", credits: 3 },
    ],
    seniorFall: [
      { code: "FIN 460", title: "Derivatives, Options & Financial Risk", credits: 3 },
      { code: "ACCT 420", title: "Federal Income Taxation for Business", credits: 3 },
      { code: "BUS 480", title: "International Business & Global Strategy", credits: 3 },
      { code: "FIN 491", title: "Applied Financial Modeling Workshop", credits: 3 },
      { code: "SOC 210", title: "Social Stratification & Labor Markets", credits: 3 },
    ],
    seniorSpring: [
      { code: "BUS 490", title: "Strategic Management Senior Capstone", credits: 3 },
      { code: "FIN 495", title: "Senior Portfolio Case Competition", credits: 3 },
      { code: "FIN 498", title: "Financial Ethics & Compliance Seminar", credits: 3 },
      { code: "ART 101", title: "Visual Arts & Aesthetic Culture", credits: 3 },
      { code: "PE 101", title: "Personal Health & Wellness", credits: 1 },
    ],
  },
}

function selectCatalog(occupation: string): DegreeCatalog {
  const occ = (occupation || "").toLowerCase()
  if (
    occ.includes("finance") ||
    occ.includes("bank") ||
    occ.includes("account") ||
    occ.includes("consult") ||
    occ.includes("manager") ||
    occ.includes("business") ||
    occ.includes("analyst")
  ) {
    return BUSINESS_CATALOG
  }
  return COMPUTER_SCIENCE_CATALOG
}

const GRADE_POINTS: Record<string, number> = {
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
}

const REGISTRAR_OFFICERS = [
  { name: "Dr. Gregory M. Vance, Ph.D.", title: "University Registrar & Vice Provost" },
  { name: "Dr. Stephanie R. Hollingsworth, Ed.D.", title: "Dean of Academic Records & Registrar" },
  { name: "Prof. Arthur C. Sterling, Ph.D.", title: "Registrar & Director of Enrollment Services" },
  { name: "Dr. Evelyn K. Thorne, Ph.D.", title: "University Registrar & Associate Provost" },
]

export function generateUniversityTranscript(
  person: PersonData,
  university: UniversityData | null,
  seed: number,
): UniversityTranscriptData {
  const s = seed || 882910
  const randomAt = (offset: number) => {
    const x = Math.sin(s + offset) * 10000
    return x - Math.floor(x)
  }

  const catalog = selectCatalog(person.occupation)
  const regOfficer = REGISTRAR_OFFICERS[Math.floor(randomAt(1) * REGISTRAR_OFFICERS.length)]

  // 计算入学与毕业年份 (以 22 岁毕业为基准)
  const currentYear = 2026
  let gradYear = currentYear - 2
  if (person.birthday) {
    const birthYear = parseInt(person.birthday.slice(0, 4), 10)
    if (!isNaN(birthYear)) {
      gradYear = birthYear + 22
    }
  }
  const entryYear = gradYear - 4

  const semesterConfigs = [
    { term: `Fall ${entryYear}`, standing: "Freshman", courses: catalog.coursesByYear.freshmanFall },
    { term: `Spring ${entryYear + 1}`, standing: "Freshman", courses: catalog.coursesByYear.freshmanSpring },
    { term: `Fall ${entryYear + 1}`, standing: "Sophomore", courses: catalog.coursesByYear.sophomoreFall },
    { term: `Spring ${entryYear + 2}`, standing: "Sophomore", courses: catalog.coursesByYear.sophomoreSpring },
    { term: `Fall ${entryYear + 2}`, standing: "Junior", courses: catalog.coursesByYear.juniorFall },
    { term: `Spring ${entryYear + 3}`, standing: "Junior", courses: catalog.coursesByYear.juniorSpring },
    { term: `Fall ${entryYear + 3}`, standing: "Senior", courses: catalog.coursesByYear.seniorFall },
    { term: `Spring ${gradYear}`, standing: "Senior", courses: catalog.coursesByYear.seniorSpring },
  ]

  let runningAttempted = 0
  let runningEarned = 0
  let runningPoints = 0

  const semesters: CollegeSemester[] = []

  semesterConfigs.forEach((sc, semIdx) => {
    let termAttempted = 0
    let termEarned = 0
    let termPoints = 0

    const processedCourses: CollegeCourse[] = sc.courses.map((c, cIdx) => {
      const r = randomAt(semIdx * 10 + cIdx + 20)
      let grade = "A"
      if (r < 0.45) grade = "A"
      else if (r < 0.72) grade = "A-"
      else if (r < 0.88) grade = "B+"
      else if (r < 0.96) grade = "B"
      else grade = "B-"

      const pts = Number((c.credits * (GRADE_POINTS[grade] || 4.0)).toFixed(2))

      termAttempted += c.credits
      termEarned += c.credits
      termPoints += pts

      return {
        code: c.code,
        title: c.title,
        creditsAttempted: c.credits,
        creditsEarned: c.credits,
        grade,
        gradePoints: pts,
      }
    })

    runningAttempted += termAttempted
    runningEarned += termEarned
    runningPoints += termPoints

    const termGpa = Number((termPoints / termAttempted).toFixed(2))
    const cumGpa = Number((runningPoints / runningAttempted).toFixed(2))

    let honors: string | undefined = undefined
    if (termGpa >= 3.85) {
      honors = "Dean's Honor List"
    } else if (termGpa >= 3.70) {
      honors = "Honor Roll"
    }

    const yearSpan = `${entryYear + Math.floor(semIdx / 2)}-${entryYear + Math.floor(semIdx / 2) + 1}`

    semesters.push({
      term: sc.term,
      academicYear: yearSpan,
      standing: sc.standing,
      honors,
      courses: processedCourses,
      termAttempted,
      termEarned,
      termPoints: Number(termPoints.toFixed(2)),
      termGpa,
      cumAttempted: runningAttempted,
      cumEarned: runningEarned,
      cumPoints: Number(runningPoints.toFixed(2)),
      cumGpa,
    })
  })

  const finalCumGpa = semesters[semesters.length - 1].cumGpa
  let degreeHonors: string | undefined = undefined
  if (finalCumGpa >= 3.88) degreeHonors = "Summa Cum Laude"
  else if (finalCumGpa >= 3.75) degreeHonors = "Magna Cum Laude"
  else if (finalCumGpa >= 3.55) degreeHonors = "Cum Laude"

  // 权威大学名称
  const uName = university?.name || "University of California, Berkeley"
  const uCity = university?.city || "Berkeley"
  const uState = university?.state || "CA"
  const uZip = university?.zip || "94720"
  const uAddress = university?.address || "110 Sproul Hall"
  const uPhone = university?.telephone || "(510) 642-6000"
  const uIpeds = university?.ipedsid || "110635"

  // 9位学生UID
  const studentUid = (900000000 + Math.floor(randomAt(99) * 99999999)).toString()
  const ssnLast4 = person.ssn ? person.ssn.slice(-4) : "8821"

  return {
    universityName: uName,
    ipedsId: uIpeds,
    address: uAddress,
    city: uCity,
    state: uState,
    zip: uZip,
    telephone: uPhone,
    accreditation: "WASC Senior College and University Commission (WSCUC)",
    registrarName: regOfficer.name,
    registrarTitle: regOfficer.title,
    studentName: person.fullName,
    studentId: studentUid,
    dob: person.birthday || "2000-05-14",
    ssnMasked: `***-**-${ssnLast4}`,
    dateIssued: "October 24, 2026",
    degreeConferred: catalog.degreeName,
    major: catalog.major,
    minor: catalog.minor,
    conferralDate: `May 18, ${gradYear}`,
    academicStanding: "Good Standing - Degree Conferred",
    degreeHonors,
    semesters,
    totalCreditsAttempted: runningAttempted,
    totalCreditsEarned: runningEarned,
    totalGradePoints: Number(runningPoints.toFixed(2)),
    cumulativeGpa: finalCumGpa,
  }
}
