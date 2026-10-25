import type { PersonData, UniversityData } from "./types"

export interface CourseScheduleItem {
  courseCode: string
  title: string
  section: string
  credits: number
  schedule: string
  room: string
  instructor: string
  status: "Registered" | "Enrolled"
}

export interface TuitionItem {
  date: string
  description: string
  charges: number
  payments: number
  balance: number
}

export interface StudentScheduleData {
  universityName: string
  term: string
  studentName: string
  studentId: string
  academicLevel: string
  major: string
  campus: string
  totalCredits: number
  courses: CourseScheduleItem[]
  tuitionItems: TuitionItem[]
  totalCharges: number
  totalPayments: number
  currentBalance: number
  statementDate: string
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

export function generateStudentSchedule(
  person: PersonData,
  university: UniversityData | null,
  seed: number
): StudentScheduleData {
  const birthYear = parseBirthYear(person.birthday)
  const currentAcademicYear = Math.min(Math.max(birthYear + 22, 2020), 2024)
  const term = `Fall ${currentAcademicYear}`
  const statementDate = `09/15/${currentAcademicYear}`

  const uniName = university?.name || "Massachusetts Institute of Technology"
  const studentId = `MIT-${(seed * 19 % 899999 + 100000)}`
  const major = "Computer Science & Artificial Intelligence"

  const courses: CourseScheduleItem[] = [
    {
      courseCode: "6.006",
      title: "Introduction to Algorithms & Data Structures",
      section: "LEC 01",
      credits: 4,
      schedule: "MWF 11:00 AM - 12:00 PM",
      room: "Bldg 34-101",
      instructor: "Prof. Erik Demaine",
      status: "Enrolled",
    },
    {
      courseCode: "6.036",
      title: "Introduction to Machine Learning & Neural Nets",
      section: "LEC 02",
      credits: 4,
      schedule: "TR 1:00 PM - 2:30 PM",
      room: "Stata Center 32-123",
      instructor: "Prof. Leslie Kaelbling",
      status: "Enrolled",
    },
    {
      courseCode: "18.06",
      title: "Linear Algebra & Computational Matrix Analysis",
      section: "LEC 01",
      credits: 4,
      schedule: "MWF 9:00 AM - 10:00 AM",
      room: "Bldg 2-190",
      instructor: "Prof. Gilbert Strang",
      status: "Enrolled",
    },
    {
      courseCode: "21W.789",
      title: "Engineering Communications & Ethics in AI",
      section: "SEM 01",
      credits: 3,
      schedule: "TR 3:30 PM - 5:00 PM",
      room: "Bldg 14N-112",
      instructor: "Dr. Andrea Walsh",
      status: "Enrolled",
    },
  ]

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  // Tuition statement line items
  const tuitionItems: TuitionItem[] = [
    {
      date: `08/10/${currentAcademicYear}`,
      description: `Tuition Charge - Full Time Undergraduate (${term})`,
      charges: 29875.0,
      payments: 0.0,
      balance: 29875.0,
    },
    {
      date: `08/10/${currentAcademicYear}`,
      description: "Student Life & Campus Facilities Comprehensive Fee",
      charges: 410.0,
      payments: 0.0,
      balance: 30285.0,
    },
    {
      date: `08/10/${currentAcademicYear}`,
      description: "MIT Extended Student Health Insurance Plan (SHIP)",
      charges: 1820.0,
      payments: 0.0,
      balance: 32105.0,
    },
    {
      date: `08/25/${currentAcademicYear}`,
      description: "Provost Merit Academic Scholarship Credit",
      charges: 0.0,
      payments: 16000.0,
      balance: 16105.0,
    },
    {
      date: `09/01/${currentAcademicYear}`,
      description: "Electronic ACH Wire Payment - Thank You",
      charges: 0.0,
      payments: 16105.0,
      balance: 0.0,
    },
  ]

  const totalCharges = tuitionItems.reduce((acc, i) => acc + i.charges, 0)
  const totalPayments = tuitionItems.reduce((acc, i) => acc + i.payments, 0)

  return {
    universityName: uniName,
    term,
    studentName: person.fullName,
    studentId,
    academicLevel: "Undergraduate / Degree Candidate",
    major,
    campus: "Main Campus (Cambridge, MA)",
    totalCredits,
    courses,
    tuitionItems,
    totalCharges,
    totalPayments,
    currentBalance: 0.0,
    statementDate,
  }
}
