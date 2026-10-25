export interface CollegeCourse {
  code: string          // e.g. "CS 101", "MATH 241"
  title: string         // e.g. "Introduction to Computer Science"
  creditsAttempted: number // e.g. 3.0 or 4.0
  creditsEarned: number    // e.g. 3.0 or 4.0
  grade: string         // e.g. "A", "A-", "B+"
  gradePoints: number   // creditsEarned * pointValue
}

export interface CollegeSemester {
  term: string          // e.g. "Fall 2020", "Spring 2021"
  academicYear: string  // e.g. "2020-2021"
  standing: string      // "Freshman", "Sophomore", "Junior", "Senior"
  honors?: string       // "Dean's Honor List", "President's List"
  courses: CollegeCourse[]
  termAttempted: number
  termEarned: number
  termPoints: number
  termGpa: number
  cumAttempted: number
  cumEarned: number
  cumPoints: number
  cumGpa: number
}

export interface UniversityTranscriptData {
  // 院校权威信息
  universityName: string
  ipedsId: string
  address: string
  city: string
  state: string
  zip: string
  telephone: string
  accreditation: string // e.g. "WASC Senior College and University Commission (WSCUC)"
  registrarName: string // e.g. "Dr. Marcus Vance, Ph.D."
  registrarTitle: string // "University Registrar & Vice Provost"
  
  // 学生个人信息
  studentName: string
  studentId: string     // 9-digit Campus UID (e.g. "904821940")
  dob: string
  ssnMasked: string     // "***-**-1234"
  dateIssued: string    // e.g. "October 24, 2026"
  
  // 学位授予信息
  degreeConferred: string // e.g. "Bachelor of Science" / "Bachelor of Arts"
  major: string           // e.g. "Computer Science"
  minor?: string          // e.g. "Mathematics"
  conferralDate: string   // e.g. "May 18, 2024"
  academicStanding: string // "Good Standing - Graduated"
  degreeHonors?: string    // "Magna Cum Laude" / "Cum Laude"
  
  // 学期成绩明细
  semesters: CollegeSemester[]
  
  // 全程总计
  totalCreditsAttempted: number
  totalCreditsEarned: number
  totalGradePoints: number
  cumulativeGpa: number
}
