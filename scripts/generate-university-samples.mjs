import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
import fs from "fs"
import path from "path"

async function buildUniversityTranscriptPdf(options) {
  const doc = await PDFDocument.create()
  const page = doc.addPage([612, 792]) // US Letter
  const { width, height } = page.getSize()

  const fontSerifBold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const fontSerif = await doc.embedFont(StandardFonts.TimesRoman)
  const fontSerifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic)
  const fontSans = await doc.embedFont(StandardFonts.Helvetica)
  const fontSansBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const cDark = rgb(0.1, 0.12, 0.15)
  const cNavy = rgb(0.05, 0.12, 0.28)
  const cGold = rgb(0.7, 0.5, 0.1)
  const cLine = rgb(0.3, 0.35, 0.4)
  const cBgLight = rgb(0.95, 0.96, 0.98)

  // 1. 水印
  page.drawText(options.watermark || "OFFICIAL TRANSCRIPT", {
    x: 100,
    y: 300,
    size: 40,
    font: fontSerifBold,
    color: rgb(0.92, 0.93, 0.95),
    rotate: degrees(35),
  })

  // 2. 双重防伪边框
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: cDark,
    borderWidth: 1.5,
  })
  page.drawRectangle({
    x: 23,
    y: 23,
    width: width - 46,
    height: height - 46,
    borderColor: cLine,
    borderWidth: 0.5,
  })

  let curY = height - 50

  // 3. 大学抬头
  const uName = (options.universityName || "UNIVERSITY OF CALIFORNIA, BERKELEY").toUpperCase()
  const uWidth = fontSerifBold.widthOfTextAtSize(uName, 16)
  page.drawText(uName, {
    x: (width - uWidth) / 2,
    y: curY,
    size: 16,
    font: fontSerifBold,
    color: cNavy,
  })
  curY -= 14

  const subTitle = "OFFICE OF THE UNIVERSITY REGISTRAR · OFFICIAL ACADEMIC RECORD"
  const subWidth = fontSansBold.widthOfTextAtSize(subTitle, 8.5)
  page.drawText(subTitle, {
    x: (width - subWidth) / 2,
    y: curY,
    size: 8.5,
    font: fontSansBold,
    color: cDark,
  })
  curY -= 12

  const addrStr = `${options.address || "110 Sproul Hall, Berkeley, CA 94720"}  ·  IPEDS ID: ${options.ipedsId || "110635"}`
  const aWidth = fontSans.widthOfTextAtSize(addrStr, 7.5)
  page.drawText(addrStr, {
    x: (width - aWidth) / 2,
    y: curY,
    size: 7.5,
    font: fontSans,
    color: rgb(0.3, 0.35, 0.4),
  })
  curY -= 14

  // 分隔线
  page.drawLine({
    start: { x: 30, y: curY },
    end: { x: width - 30, y: curY },
    thickness: 1.5,
    color: cDark,
  })
  curY -= 14

  // 4. 学生与学位基本信息 (双栏)
  const leftX = 35
  const midX = 320
  const colYStart = curY

  page.drawText("STUDENT IDENTIFICATION", { x: leftX, y: curY, size: 8, font: fontSansBold, color: cNavy })
  page.drawText("DEGREE CONFERRED", { x: midX, y: curY, size: 8, font: fontSansBold, color: cNavy })
  curY -= 12

  const drawKV = (x, y, k, v) => {
    page.drawText(k, { x, y, size: 7.5, font: fontSans, color: rgb(0.35, 0.4, 0.45) })
    page.drawText(v, { x: x + 95, y, size: 7.5, font: fontSansBold, color: cDark })
  }

  drawKV(leftX, curY, "Legal Name:", options.studentName || "Johnathan Q. Public")
  drawKV(midX, curY, "Degree:", options.degree || "Bachelor of Science")
  curY -= 11

  drawKV(leftX, curY, "Student ID (UID):", options.studentId || "904829104")
  drawKV(midX, curY, "Major Program:", options.major || "Computer Science")
  curY -= 11

  drawKV(leftX, curY, "Birth Date / SSN:", `${options.dob || "2000-05-14"} / ***-**-8821`)
  drawKV(midX, curY, "Conferral Date:", options.conferralDate || "May 18, 2024")
  curY -= 11

  drawKV(leftX, curY, "Date Issued:", options.dateIssued || "October 24, 2026")
  drawKV(midX, curY, "Graduation Honors:", options.honors || "Magna Cum Laude")
  curY -= 14

  page.drawLine({
    start: { x: 30, y: curY },
    end: { x: width - 30, y: curY },
    thickness: 0.8,
    color: cLine,
  })
  curY -= 14

  // 5. 学期课程表格 (2列呈现，每列4个学期)
  const semList = options.semesters || []
  const colWidth = (width - 75) / 2
  const leftColX = 32
  const rightColX = 32 + colWidth + 11

  // 绘制单个学期块
  const renderSemesterBox = (sem, startX, startY) => {
    let y = startY
    // 学期标题
    page.drawRectangle({
      x: startX,
      y: y - 12,
      width: colWidth,
      height: 14,
      color: cNavy,
    })
    page.drawText(`${sem.term.toUpperCase()} - ${sem.standing.toUpperCase()}`, {
      x: startX + 4,
      y: y - 9,
      size: 7.5,
      font: fontSansBold,
      color: rgb(1, 1, 1),
    })
    if (sem.honors) {
      page.drawText(sem.honors, {
        x: startX + colWidth - 75,
        y: y - 9,
        size: 6.5,
        font: fontSansBold,
        color: rgb(1, 0.85, 0.4),
      })
    }
    y -= 14

    // 表头
    page.drawRectangle({
      x: startX,
      y: y - 10,
      width: colWidth,
      height: 11,
      color: cBgLight,
    })
    page.drawText("COURSE", { x: startX + 3, y: y - 8, size: 6.5, font: fontSansBold, color: cDark })
    page.drawText("TITLE", { x: startX + 44, y: y - 8, size: 6.5, font: fontSansBold, color: cDark })
    page.drawText("ATT", { x: startX + colWidth - 62, y: y - 8, size: 6.5, font: fontSansBold, color: cDark })
    page.drawText("ERN", { x: startX + colWidth - 44, y: y - 8, size: 6.5, font: fontSansBold, color: cDark })
    page.drawText("GRD", { x: startX + colWidth - 26, y: y - 8, size: 6.5, font: fontSansBold, color: cDark })
    page.drawText("PTS", { x: startX + colWidth - 11, y: y - 8, size: 6.5, font: fontSansBold, color: cDark })
    y -= 11

    // 课程各行
    for (const c of sem.courses) {
      page.drawText(c.code, { x: startX + 3, y: y - 7, size: 6.5, font: fontSansBold, color: cDark })
      const titleStr = c.title.length > 25 ? c.title.slice(0, 24) + ".." : c.title
      page.drawText(titleStr, { x: startX + 44, y: y - 7, size: 6.5, font: fontSans, color: cDark })
      page.drawText(c.credits.toFixed(1), { x: startX + colWidth - 61, y: y - 7, size: 6.5, font: fontSans, color: cDark })
      page.drawText(c.credits.toFixed(1), { x: startX + colWidth - 43, y: y - 7, size: 6.5, font: fontSans, color: cDark })
      page.drawText(c.grade, { x: startX + colWidth - 25, y: y - 7, size: 6.5, font: fontSansBold, color: cNavy })
      page.drawText(c.points.toFixed(1), { x: startX + colWidth - 12, y: y - 7, size: 6.5, font: fontSans, color: cDark })
      y -= 9.5
    }

    // 学期汇总
    page.drawText(`TERM GPA: ${sem.termGpa.toFixed(2)}  |  CUM GPA: ${sem.cumGpa.toFixed(2)}  |  TOTAL EARNED: ${sem.cumEarned.toFixed(1)}`, {
      x: startX + 4,
      y: y - 7,
      size: 6,
      font: fontSansBold,
      color: rgb(0.2, 0.25, 0.3),
    })
    y -= 13
    return y
  }

  let leftY = curY
  let rightY = curY

  for (let i = 0; i < semList.length; i++) {
    if (i < 4) {
      leftY = renderSemesterBox(semList[i], leftColX, leftY)
    } else {
      rightY = renderSemesterBox(semList[i], rightColX, rightY)
    }
  }

  curY = Math.min(leftY, rightY) - 5

  // 6. 终极大汇总
  page.drawRectangle({
    x: 30,
    y: curY - 22,
    width: width - 60,
    height: 24,
    color: cBgLight,
    borderColor: cNavy,
    borderWidth: 1,
  })

  const sumText = `TOTAL INSTITUTION CREDITS ATTEMPTED: 126.00    EARNED: 126.00    QUALITY POINTS: ${options.totalPoints || "481.50"}    CUMULATIVE GPA: ${options.cumGpa || "3.82"} / 4.00`
  const sumWidth = fontSansBold.widthOfTextAtSize(sumText, 7.5)
  page.drawText(sumText, {
    x: (width - sumWidth) / 2,
    y: curY - 14,
    size: 7.5,
    font: fontSansBold,
    color: cNavy,
  })
  curY -= 32

  // 7. 认证与官方教务长签名
  page.drawText("ACCREDITATION: Accredited by the Higher Learning Commission. Official under FERPA guidelines.", {
    x: 32,
    y: curY,
    size: 6.5,
    font: fontSans,
    color: rgb(0.4, 0.45, 0.5),
  })
  curY -= 20

  // 签名
  page.drawText(options.registrarName || "Dr. Gregory M. Vance, Ph.D.", {
    x: width - 210,
    y: curY + 12,
    size: 13,
    font: fontSerifItalic,
    color: cNavy,
  })
  page.drawLine({
    start: { x: width - 210, y: curY + 8 },
    end: { x: width - 35, y: curY + 8 },
    thickness: 1,
    color: cDark,
  })
  page.drawText("University Registrar & Vice Provost", {
    x: width - 210,
    y: curY - 1,
    size: 7.5,
    font: fontSansBold,
    color: cDark,
  })

  // 官方印章
  page.drawCircle({
    x: width - 240,
    y: curY + 10,
    size: 16,
    borderColor: cNavy,
    borderWidth: 1.5,
    color: rgb(0.95, 0.96, 0.98),
  })
  page.drawText("SEAL", {
    x: width - 248,
    y: curY + 8,
    size: 6.5,
    font: fontSansBold,
    color: cNavy,
  })

  return await doc.save()
}

async function main() {
  const sampleDir = path.resolve(process.cwd(), "public", "samples")
  if (!fs.existsSync(sampleDir)) {
    fs.mkdirSync(sampleDir, { recursive: true })
  }

  const dummySemesters = [
    {
      term: "Fall 2020",
      standing: "Freshman",
      honors: "Dean's Honor List",
      termGpa: 3.85,
      cumGpa: 3.85,
      cumEarned: 15.0,
      courses: [
        { code: "CS 110", title: "Intro to Computer Science", credits: 4.0, grade: "A", points: 16.0 },
        { code: "MATH 141", title: "Calculus I: Differential", credits: 4.0, grade: "A", points: 16.0 },
        { code: "ENGL 101", title: "Academic Writing & Research", credits: 3.0, grade: "A-", points: 11.1 },
        { code: "HIST 120", title: "Western Civ & Modernity", credits: 3.0, grade: "A", points: 12.0 },
      ],
    },
    {
      term: "Spring 2021",
      standing: "Freshman",
      honors: "Honor Roll",
      termGpa: 3.75,
      cumGpa: 3.80,
      cumEarned: 30.0,
      courses: [
        { code: "CS 180", title: "Data Structures & Java", credits: 4.0, grade: "A", points: 16.0 },
        { code: "MATH 142", title: "Calculus II: Integral", credits: 4.0, grade: "B+", points: 13.2 },
        { code: "PHYS 151", title: "General Physics I: Mechanics", credits: 4.0, grade: "A-", points: 14.8 },
        { code: "PSYC 101", title: "General Psychology", credits: 3.0, grade: "A", points: 12.0 },
      ],
    },
    {
      term: "Fall 2021",
      standing: "Sophomore",
      honors: "Dean's Honor List",
      termGpa: 3.88,
      cumGpa: 3.83,
      cumEarned: 46.0,
      courses: [
        { code: "CS 210", title: "Algorithm Design & Analysis", credits: 4.0, grade: "A", points: 16.0 },
        { code: "CS 220", title: "Computer Architecture", credits: 3.0, grade: "A", points: 12.0 },
        { code: "MATH 240", title: "Linear Algebra & Apps", credits: 3.0, grade: "A-", points: 11.1 },
        { code: "PHYS 152", title: "Physics II: Electromagnetism", credits: 4.0, grade: "A", points: 16.0 },
        { code: "COMM 102", title: "Public Speaking & Discourse", credits: 2.0, grade: "A", points: 8.0 },
      ],
    },
    {
      term: "Spring 2022",
      standing: "Sophomore",
      honors: "Dean's Honor List",
      termGpa: 3.82,
      cumGpa: 3.83,
      cumEarned: 62.0,
      courses: [
        { code: "CS 240", title: "Discrete Structures & Logic", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 310", title: "Operating Systems & Concurrency", credits: 4.0, grade: "A-", points: 14.8 },
        { code: "STAT 250", title: "Probability & Statistics for CS", credits: 3.0, grade: "A", points: 12.0 },
        { code: "ECON 101", title: "Principles of Microeconomics", credits: 3.0, grade: "B+", points: 9.9 },
        { code: "PHIL 205", title: "Technology Ethics & Society", credits: 3.0, grade: "A", points: 12.0 },
      ],
    },
    {
      term: "Fall 2022",
      standing: "Junior",
      honors: "Dean's Honor List",
      termGpa: 3.86,
      cumGpa: 3.83,
      cumEarned: 78.0,
      courses: [
        { code: "CS 330", title: "Database Systems & Modeling", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 350", title: "Computer Networks & Protocols", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 370", title: "Software Engineering & Team", credits: 4.0, grade: "A-", points: 14.8 },
        { code: "MATH 310", title: "Numerical Analysis", credits: 3.0, grade: "A", points: 12.0 },
        { code: "MUSC 110", title: "Music Appreciation", credits: 3.0, grade: "A", points: 12.0 },
      ],
    },
    {
      term: "Spring 2023",
      standing: "Junior",
      honors: "Dean's Honor List",
      termGpa: 3.89,
      cumGpa: 3.84,
      cumEarned: 93.0,
      courses: [
        { code: "CS 380", title: "Theory of Computation", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 420", title: "Artificial Intelligence", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 440", title: "Cloud Systems & DevOps", credits: 3.0, grade: "A-", points: 11.1 },
        { code: "ENGL 305", title: "Advanced Technical Writing", credits: 3.0, grade: "A", points: 12.0 },
        { code: "POLS 101", title: "American National Govt", credits: 3.0, grade: "A", points: 12.0 },
      ],
    },
    {
      term: "Fall 2023",
      standing: "Senior",
      honors: "Dean's Honor List",
      termGpa: 3.87,
      cumGpa: 3.85,
      cumEarned: 108.0,
      courses: [
        { code: "CS 450", title: "Machine Learning & Pattern Rec", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 470", title: "Information Security & Crypt", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 491", title: "Senior Capstone Project I", credits: 3.0, grade: "A", points: 12.0 },
        { code: "ASTR 101", title: "Observational Astronomy", credits: 3.0, grade: "A-", points: 11.1 },
        { code: "MGMT 310", title: "Principles of Management", credits: 3.0, grade: "A", points: 12.0 },
      ],
    },
    {
      term: "Spring 2024",
      standing: "Senior",
      honors: "Dean's Honor List",
      termGpa: 3.90,
      cumGpa: 3.85,
      cumEarned: 126.0,
      courses: [
        { code: "CS 485", title: "Big Data Stream Processing", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 492", title: "Senior Capstone Project II", credits: 3.0, grade: "A", points: 12.0 },
        { code: "CS 498", title: "Undergraduate Research", credits: 3.0, grade: "A", points: 12.0 },
        { code: "ANTH 102", title: "Cultural Anthropology", credits: 3.0, grade: "A-", points: 11.1 },
        { code: "PE 105", title: "Physical Wellness Fitness", credits: 1.0, grade: "A", points: 4.0 },
      ],
    },
  ]

  const configs = [
    {
      filename: "Sample_University_1_UC_Berkeley_CA.pdf",
      universityName: "University of California, Berkeley",
      address: "110 Sproul Hall, Berkeley, CA 94720",
      ipedsId: "110635",
      studentName: "Alexander J. Mercer",
      studentId: "904812049",
      degree: "Bachelor of Science",
      major: "Computer Science",
      honors: "Magna Cum Laude",
      cumGpa: "3.85",
      totalPoints: "485.10",
      semesters: dummySemesters,
    },
    {
      filename: "Sample_University_2_Texas_AM_TX.pdf",
      universityName: "Texas A&M University - College Station",
      address: "General Services Complex, College Station, TX 77843",
      ipedsId: "228723",
      studentName: "Robert T. Henderson",
      studentId: "902194810",
      degree: "Bachelor of Business Administration",
      major: "Finance & Accounting",
      honors: "Cum Laude",
      cumGpa: "3.78",
      totalPoints: "476.28",
      semesters: dummySemesters,
    },
    {
      filename: "Sample_University_3_NYU_Stern_NY.pdf",
      universityName: "New York University - Stern School of Business",
      address: "44 West 4th Street, New York, NY 10012",
      ipedsId: "193900",
      studentName: "Emily S. Chen",
      studentId: "908129440",
      degree: "Bachelor of Science in Business",
      major: "Economics & Global Finance",
      honors: "Summa Cum Laude",
      cumGpa: "3.92",
      totalPoints: "493.92",
      semesters: dummySemesters,
    },
    {
      filename: "Sample_University_4_UW_Seattle_WA.pdf",
      universityName: "University of Washington - Seattle",
      address: "Schmitz Hall 225, Seattle, WA 98195",
      ipedsId: "236948",
      studentName: "Marcus D. Vance",
      studentId: "901928412",
      degree: "Bachelor of Science",
      major: "Electrical & Computer Engineering",
      honors: "Magna Cum Laude",
      cumGpa: "3.84",
      totalPoints: "483.84",
      semesters: dummySemesters,
    },
  ]

  for (const c of configs) {
    const bytes = await buildUniversityTranscriptPdf(c)
    const outPath = path.join(sampleDir, c.filename)
    fs.writeFileSync(outPath, bytes)
    console.log(`Generated authentic university PDF: ${c.filename} (${bytes.length} bytes)`)
  }
}

main().catch(console.error)
