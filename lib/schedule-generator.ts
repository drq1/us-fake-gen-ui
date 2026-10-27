import type { PersonData, UniversityData } from "./types"

export interface CourseScheduleItem {
  courseCode: string
  title: string
  section: string
  credits: number
  schedule: string
  days: string
  time: string
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
  const majorPool = [
    "Computer Science & Artificial Intelligence",
    "Finance & Business Analytics",
    "Electrical Engineering & Computer Science",
    "Applied Mathematics & Data Science",
  ]
  const major = majorPool[seed % majorPool.length]

  const courseSets: CourseScheduleItem[][] = [
    // 0. CS & AI
    [
      {
        courseCode: "6.006",
        title: "Introduction to Algorithms & Data Structures",
        section: "LEC 01",
        credits: 4,
        schedule: "MWF 11:00 AM - 12:00 PM",
        days: "Mon, Wed, Fri",
        time: "11:00 AM",
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
        days: "Tue, Thu",
        time: "1:00 PM",
        room: "Stata 32-123",
        instructor: "Prof. Leslie Kaelbling",
        status: "Enrolled",
      },
      {
        courseCode: "18.06",
        title: "Linear Algebra & Computational Matrix Analysis",
        section: "LEC 01",
        credits: 4,
        schedule: "MWF 9:00 AM - 10:00 AM",
        days: "Mon, Wed, Fri",
        time: "9:00 AM",
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
        days: "Tue, Thu",
        time: "3:30 PM",
        room: "Bldg 14N-112",
        instructor: "Dr. Andrea Walsh",
        status: "Enrolled",
      },
    ],
    // 1. Finance & Analytics
    [
      {
        courseCode: "15.010",
        title: "Economic Analysis for Business Decisions",
        section: "LEC 01",
        credits: 4,
        schedule: "MW 10:00 AM - 11:30 AM",
        days: "Mon, Wed",
        time: "10:00 AM",
        room: "Sloan E51-315",
        instructor: "Prof. Roberto Rigobon",
        status: "Enrolled",
      },
      {
        courseCode: "15.060",
        title: "Data, Models, and Decisions in Management",
        section: "LEC 02",
        credits: 4,
        schedule: "TR 10:05 AM - 11:35 AM",
        days: "Tue, Thu",
        time: "10:05 AM",
        room: "Sloan E62-221",
        instructor: "Prof. Dimitris Bertsimas",
        status: "Enrolled",
      },
      {
        courseCode: "15.401",
        title: "Managerial Finance & Capital Markets",
        section: "LEC 01",
        credits: 4,
        schedule: "MW 1:30 PM - 3:00 PM",
        days: "Mon, Wed",
        time: "1:30 PM",
        room: "Sloan E52-164",
        instructor: "Prof. Andrew Lo",
        status: "Enrolled",
      },
      {
        courseCode: "15.279",
        title: "Management Communication for Leaders",
        section: "SEM 03",
        credits: 3,
        schedule: "TR 2:00 PM - 3:30 PM",
        days: "Tue, Thu",
        time: "2:00 PM",
        room: "Sloan E51-149",
        instructor: "Dr. Lori Breslow",
        status: "Enrolled",
      },
    ],
    // 2. EE & Computer Engineering
    [
      {
        courseCode: "6.002",
        title: "Circuits and Electronics",
        section: "LEC 01",
        credits: 4,
        schedule: "MWF 11:00 AM - 12:00 PM",
        days: "Mon, Wed, Fri",
        time: "11:00 AM",
        room: "Bldg 36-155",
        instructor: "Prof. Anantha Chandrakasan",
        status: "Enrolled",
      },
      {
        courseCode: "6.004",
        title: "Computation Structures & CPU Architecture",
        section: "LEC 01",
        credits: 4,
        schedule: "TR 2:30 PM - 4:00 PM",
        days: "Tue, Thu",
        time: "2:30 PM",
        room: "Stata 32-141",
        instructor: "Prof. Chris Terman",
        status: "Enrolled",
      },
      {
        courseCode: "6.011",
        title: "Signals, Systems and Inference",
        section: "LEC 02",
        credits: 4,
        schedule: "MWF 1:00 PM - 2:00 PM",
        days: "Mon, Wed, Fri",
        time: "1:00 PM",
        room: "Bldg 4-237",
        instructor: "Prof. Alan Oppenheim",
        status: "Enrolled",
      },
      {
        courseCode: "21M.011",
        title: "Introduction to Western Music Culture",
        section: "LEC 01",
        credits: 3,
        schedule: "TR 11:00 AM - 12:30 PM",
        days: "Tue, Thu",
        time: "11:00 AM",
        room: "Kresge 105",
        instructor: "Prof. Michael Cuthbert",
        status: "Enrolled",
      },
    ],
  ]

  const courses = courseSets[seed % courseSets.length]

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
