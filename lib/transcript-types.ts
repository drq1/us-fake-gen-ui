export interface CourseRecord {
  code: string
  title: string
  sem1: string
  sem2: string
  finalGrade: string
  credits: number
  isWeighted?: boolean
}

export interface AcademicYearRecord {
  gradeLevel: string
  gradeNumber: number // 9, 10, 11, 12
  schoolYear: string
  termGpa: number
  termCredits: number
  courses: CourseRecord[]
}

export interface StudentTranscript {
  // 学校信息
  schoolName: string
  districtName: string
  schoolAddress: string
  schoolCity: string
  schoolState: string
  schoolZip: string
  schoolPhone: string
  ceebCode: string
  ncesId: string

  // 学生个人信息
  studentName: string
  studentId: string
  dob: string
  gender: string
  graduationDate: string
  counselorName: string
  diplomaType: string

  // 学术统计
  unweightedGpa: number
  weightedGpa: number
  classRank: string
  totalCreditsEarned: number
  totalCreditsAttempted: number

  // 四年学业明细
  academicYears: AcademicYearRecord[]

  // 标化考试与荣誉
  satScore?: {
    total: number
    erw: number
    math: number
    testDate: string
  }
  actScore?: number
  honors: string[]

  // 签名与认证
  principalName: string
  registrarName: string
  issueDate: string
  isOfficial: boolean
}
