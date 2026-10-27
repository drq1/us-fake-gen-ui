export interface SatScoreData {
  testType: "SAT"
  testDate: string
  registrationNumber: string
  sex: string
  dob: string
  highSchoolName: string
  highSchoolCode: string
  totalScore: number // 400 - 1600
  erwScore: number // 200 - 800 (Evidence-Based Reading and Writing)
  mathScore: number // 200 - 800
  readingScore: number // 10 - 40
  writingScore: number // 10 - 40
  mathCrossScore: number // 10 - 40
  nationalPercentile: number
  userPercentile: number
}

export interface ActScoreData {
  testType: "ACT"
  testDate: string
  actId: string
  highSchoolName: string
  highSchoolCode: string
  compositeScore: number // 1 - 36
  mathScore: number // 1 - 36
  scienceScore: number // 1 - 36
  stemScore: number // 1 - 36
  englishScore: number // 1 - 36
  readingScore: number // 1 - 36
  writingScore: number // 2 - 12
  elaScore: number // 1 - 36
  usRankPercentile: number
  stateRankPercentile: number
}

export interface SatActReportData {
  studentName: string
  address: string
  cityStateZip: string
  sat: SatScoreData
  act: ActScoreData
}
