import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
import fs from "fs"
import path from "path"

async function buildTranscriptPdf(options) {
  const doc = await PDFDocument.create()
  // US Letter size: 612 x 792 points
  const page = doc.addPage([612, 792])
  const { width, height } = page.getSize()

  const fontSerifBold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const fontSerif = await doc.embedFont(StandardFonts.TimesRoman)
  const fontSerifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic)
  const fontSans = await doc.embedFont(StandardFonts.Helvetica)
  const fontSansBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const cSlate = rgb(0.1, 0.15, 0.2)
  const cLightSlate = rgb(0.94, 0.96, 0.98)
  const cBorder = rgb(0.2, 0.25, 0.3)
  const cNavy = rgb(0.08, 0.15, 0.3)
  const cRed = rgb(0.7, 0.1, 0.1)

  // 1. 背景水印
  page.drawText(options.watermark || "OFFICIAL TRANSCRIPT", {
    x: 90,
    y: 280,
    size: 42,
    font: fontSerifBold,
    color: rgb(0.9, 0.92, 0.95),
    rotate: degrees(35),
  })

  // 2. 页面外围细线边框
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: cBorder,
    borderWidth: 1.5,
  })

  let curY = height - 45

  // 3. 学校抬头
  const schoolName = (options.schoolName || "LINCOLN HIGH SCHOOL").toUpperCase()
  const sWidth = fontSerifBold.widthOfTextAtSize(schoolName, 17)
  page.drawText(schoolName, {
    x: (width - sWidth) / 2,
    y: curY,
    size: 17,
    font: fontSerifBold,
    color: cNavy,
  })
  curY -= 14

  const district = options.districtName || "Unified School District"
  const dWidth = fontSans.widthOfTextAtSize(district, 9)
  page.drawText(district, {
    x: (width - dWidth) / 2,
    y: curY,
    size: 9,
    font: fontSans,
    color: rgb(0.3, 0.35, 0.4),
  })
  curY -= 12

  const schoolAddr = `${options.address || "1234 Education Blvd"}, ${options.city || "City"}, ${options.state || "ST"} ${options.zip || "12345"} · Phone: ${options.phone || "(555) 019-2834"}`
  const aWidth = fontSans.widthOfTextAtSize(schoolAddr, 8)
  page.drawText(schoolAddr, {
    x: (width - aWidth) / 2,
    y: curY,
    size: 8,
    font: fontSans,
    color: rgb(0.3, 0.35, 0.4),
  })
  curY -= 14

  // CEEB & NCES
  const codeInfo = `CEEB Code: ${options.ceeb || "052410"}  |  NCES ID: ${options.nces || "062271002943"}`
  const cWidth = fontSansBold.widthOfTextAtSize(codeInfo, 8.5)
  page.drawText(codeInfo, {
    x: (width - cWidth) / 2,
    y: curY,
    size: 8.5,
    font: fontSansBold,
    color: cBorder,
  })
  curY -= 16

  // 标语横幅
  const bannerText = "OFFICIAL ACADEMIC TRANSCRIPT"
  const bWidth = fontSansBold.widthOfTextAtSize(bannerText, 10)
  page.drawRectangle({
    x: 35,
    y: curY - 2,
    width: width - 70,
    height: 18,
    color: cNavy,
  })
  page.drawText(bannerText, {
    x: (width - bWidth) / 2,
    y: curY + 3,
    size: 10,
    font: fontSansBold,
    color: rgb(1, 1, 1),
  })
  curY -= 28

  // 4. 学生档案 & 学术统计双栏网格
  const boxW = (width - 70 - 14) / 2
  const boxH = 68

  // 学生档案框
  page.drawRectangle({
    x: 35,
    y: curY - boxH,
    width: boxW,
    height: boxH,
    borderColor: cBorder,
    borderWidth: 1,
    color: cLightSlate,
  })
  page.drawText("STUDENT DEMOGRAPHICS", { x: 42, y: curY - 12, size: 8, font: fontSansBold, color: cNavy })
  page.drawLine({ start: { x: 35, y: curY - 16 }, end: { x: 35 + boxW, y: curY - 16 }, color: cBorder, thickness: 0.5 })
  page.drawText(`Student Name: ${options.studentName || "DOE, JOHN MICHAEL"}`, { x: 42, y: curY - 28, size: 8.5, font: fontSerifBold, color: cSlate })
  page.drawText(`Date of Birth: ${options.dob || "05/14/2006"}   Gender: ${options.gender || "Male"}`, { x: 42, y: curY - 40, size: 8, font: fontSans, color: cSlate })
  page.drawText(`Student ID: ${options.studentId || "STU-88294102"}   Counselor: S. Jenkins`, { x: 42, y: curY - 52, size: 8, font: fontSans, color: cSlate })
  page.drawText(`Diploma: College Preparatory Diploma`, { x: 42, y: curY - 64, size: 8, font: fontSansBold, color: cSlate })

  // 学术统计框
  page.drawRectangle({
    x: 35 + boxW + 14,
    y: curY - boxH,
    width: boxW,
    height: boxH,
    borderColor: cBorder,
    borderWidth: 1,
    color: cLightSlate,
  })
  page.drawText("CUMULATIVE ACADEMIC SUMMARY", { x: 42 + boxW + 14, y: curY - 12, size: 8, font: fontSansBold, color: cNavy })
  page.drawLine({ start: { x: 35 + boxW + 14, y: curY - 16 }, end: { x: width - 35, y: curY - 16 }, color: cBorder, thickness: 0.5 })
  page.drawText(`Unweighted GPA (4.0 Scale):  ${options.gpaUnweighted || "3.85"}`, { x: 42 + boxW + 14, y: curY - 28, size: 8.5, font: fontSansBold, color: cNavy })
  page.drawText(`Weighted GPA (5.0 Scale):    ${options.gpaWeighted || "4.18"}`, { x: 42 + boxW + 14, y: curY - 40, size: 8.5, font: fontSansBold, color: cNavy })
  page.drawText(`Class Rank: ${options.classRank || "22 of 340 (Top 10%)"}`, { x: 42 + boxW + 14, y: curY - 52, size: 8, font: fontSans, color: cSlate })
  page.drawText(`Graduation Date: ${options.gradDate || "June 07, 2024"} · Credits: ${options.credits || "25.50"}`, { x: 42 + boxW + 14, y: curY - 64, size: 8, font: fontSans, color: cSlate })

  curY -= (boxH + 18)

  // 5. 四年课程明细表 (2x2 网格)
  const drawYearBox = (bx, by, gradeTitle, yearStr, courses, termCredits, termGpa) => {
    const yH = 168
    page.drawRectangle({
      x: bx,
      y: by - yH,
      width: boxW,
      height: yH,
      borderColor: cBorder,
      borderWidth: 1,
    })

    // 年级标头
    page.drawRectangle({ x: bx, y: by - 16, width: boxW, height: 16, color: cNavy })
    page.drawText(gradeTitle, { x: bx + 6, y: by - 12, size: 8.5, font: fontSansBold, color: rgb(1, 1, 1) })
    page.drawText(yearStr, { x: bx + boxW - 55, y: by - 12, size: 8, font: fontSans, color: rgb(0.85, 0.9, 0.95) })

    // 表格头
    let rowY = by - 27
    page.drawText("Code", { x: bx + 5, y: rowY, size: 7.5, font: fontSansBold, color: cBorder })
    page.drawText("Course Description", { x: bx + 42, y: rowY, size: 7.5, font: fontSansBold, color: cBorder })
    page.drawText("S1", { x: bx + boxW - 65, y: rowY, size: 7.5, font: fontSansBold, color: cBorder })
    page.drawText("S2", { x: bx + boxW - 48, y: rowY, size: 7.5, font: fontSansBold, color: cBorder })
    page.drawText("Fin", { x: bx + boxW - 32, y: rowY, size: 7.5, font: fontSansBold, color: cNavy })
    page.drawText("Crd", { x: bx + boxW - 16, y: rowY, size: 7.5, font: fontSansBold, color: cBorder })

    page.drawLine({ start: { x: bx, y: rowY - 3 }, end: { x: bx + boxW, y: rowY - 3 }, color: cBorder, thickness: 0.5 })

    courses.forEach((c) => {
      rowY -= 17
      page.drawText(c.code, { x: bx + 5, y: rowY, size: 7, font: fontSans, color: rgb(0.4, 0.45, 0.5) })
      page.drawText(c.title.substring(0, 26), { x: bx + 42, y: rowY, size: 7.5, font: fontSans, color: cSlate })
      page.drawText(c.s1, { x: bx + boxW - 64, y: rowY, size: 7.5, font: fontSansBold, color: cSlate })
      page.drawText(c.s2, { x: bx + boxW - 47, y: rowY, size: 7.5, font: fontSansBold, color: cSlate })
      page.drawText(c.final, { x: bx + boxW - 31, y: rowY, size: 7.5, font: fontSansBold, color: cNavy })
      page.drawText(c.crd, { x: bx + boxW - 16, y: rowY, size: 7, font: fontSans, color: cSlate })
      page.drawLine({ start: { x: bx + 2, y: rowY - 3 }, end: { x: bx + boxW - 2, y: rowY - 3 }, color: rgb(0.9, 0.92, 0.94), thickness: 0.5 })
    })

    // 年级底部统计
    page.drawRectangle({ x: bx, y: by - yH, width: boxW, height: 14, color: cLightSlate })
    page.drawText(`Credits: ${termCredits}`, { x: bx + 6, y: by - yH + 4, size: 7.5, font: fontSansBold, color: cBorder })
    page.drawText(`Term GPA: ${termGpa}`, { x: bx + boxW - 65, y: by - yH + 4, size: 7.5, font: fontSansBold, color: cNavy })
  }

  // 绘制 9 年级 & 10 年级 (上行)
  const g9Courses = [
    { code: "ENG101", title: "English 9: Literature (H)", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "MTH101", title: "Algebra I (Honors)", s1: "A", s2: "A-", final: "A", crd: "1.0" },
    { code: "SCI101", title: "Biology with Lab", s1: "A-", s2: "A", final: "A", crd: "1.0" },
    { code: "SOC101", title: "World History & Geography", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "FL101", title: "Spanish I", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "PE101", title: "Physical Education 9", s1: "A", s2: "A", final: "A", crd: "0.5" },
    { code: "ART101", title: "Studio Art I", s1: "A", s2: "A", final: "A", crd: "0.5" },
  ]
  drawYearBox(35, curY, "GRADE 9 (Freshman)", "2020-2021", g9Courses, "6.00", "3.85")

  const g10Courses = [
    { code: "ENG201", title: "English 10: World Lit (H)", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "MTH201", title: "Geometry (Honors)", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "SCI201", title: "Chemistry with Lab", s1: "A-", s2: "A", final: "A", crd: "1.0" },
    { code: "SOC201", title: "AP European History", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "FL102", title: "Spanish II", s1: "B+", s2: "A-", final: "A-", crd: "1.0" },
    { code: "PE102", title: "Physical Education 10", s1: "A", s2: "A", final: "A", crd: "0.5" },
    { code: "CS101", title: "AP Computer Science Princ.", s1: "A", s2: "A", final: "A", crd: "1.0" },
  ]
  drawYearBox(35 + boxW + 14, curY, "GRADE 10 (Sophomore)", "2021-2022", g10Courses, "6.50", "3.92")

  curY -= 178

  // 绘制 11 年级 & 12 年级 (下行)
  const g11Courses = [
    { code: "ENG301", title: "AP English Language", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "MTH301", title: "Algebra II / Trig (H)", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "SCI301", title: "Physics with Lab", s1: "A-", s2: "A", final: "A", crd: "1.0" },
    { code: "SOC301", title: "AP United States History", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "FL103", title: "Spanish III (Honors)", s1: "A-", s2: "A-", final: "A-", crd: "1.0" },
    { code: "PSY101", title: "AP Psychology", s1: "A", s2: "A", final: "A", crd: "1.0" },
  ]
  drawYearBox(35, curY, "GRADE 11 (Junior)", "2022-2023", g11Courses, "6.00", "4.15")

  const g12Courses = [
    { code: "ENG401", title: "AP English Literature", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "MTH401", title: "AP Calculus AB", s1: "A", s2: "A-", final: "A", crd: "1.0" },
    { code: "SCI401", title: "AP Environmental Science", s1: "A", s2: "A", final: "A", crd: "1.0" },
    { code: "SOC401", title: "US Government & Politics", s1: "A", s2: "A", final: "A", crd: "0.5" },
    { code: "ECON401", title: "Principles of Macroeconomics", s1: "A", s2: "A", final: "A", crd: "0.5" },
    { code: "COMM101", title: "Public Speaking & Debate", s1: "A", s2: "A", final: "A", crd: "0.5" },
    { code: "SEN101", title: "Senior Leadership Seminar", s1: "A", s2: "A", final: "A", crd: "0.5" },
  ]
  drawYearBox(35 + boxW + 14, curY, "GRADE 12 (Senior)", "2023-2024", g12Courses, "5.50", "4.20")

  curY -= 184

  // 6. 标化考试与评分机制
  const subBoxW = (width - 70 - 16) / 3
  const subH = 50

  // SAT
  page.drawRectangle({ x: 35, y: curY - subH, width: subBoxW, height: subH, borderColor: cBorder, borderWidth: 0.5 })
  page.drawText("COLLEGE BOARD TESTING", { x: 40, y: curY - 10, size: 7, font: fontSansBold, color: cNavy })
  page.drawText("SAT Reasoning Test: Total 1410", { x: 40, y: curY - 22, size: 7.5, font: fontSansBold, color: cSlate })
  page.drawText("EBRW: 700   Math: 710", { x: 40, y: curY - 33, size: 7, font: fontSans, color: rgb(0.3, 0.35, 0.4) })
  page.drawText("ACT Composite: 32", { x: 40, y: curY - 44, size: 7, font: fontSans, color: rgb(0.3, 0.35, 0.4) })

  // Honors
  page.drawRectangle({ x: 35 + subBoxW + 8, y: curY - subH, width: subBoxW, height: subH, borderColor: cBorder, borderWidth: 0.5 })
  page.drawText("HONORS & DISTINCTIONS", { x: 43 + subBoxW + 8, y: curY - 10, size: 7, font: fontSansBold, color: cNavy })
  page.drawText("• National Honor Society (NHS)", { x: 43 + subBoxW + 8, y: curY - 22, size: 7, font: fontSans, color: cSlate })
  page.drawText("• AP Scholar with Distinction", { x: 43 + subBoxW + 8, y: curY - 33, size: 7, font: fontSans, color: cSlate })
  page.drawText("• Presidential Academic Award", { x: 43 + subBoxW + 8, y: curY - 44, size: 7, font: fontSans, color: cSlate })

  // Grading Scale
  page.drawRectangle({ x: 35 + (subBoxW * 2) + 16, y: curY - subH, width: subBoxW, height: subH, borderColor: cBorder, borderWidth: 0.5 })
  page.drawText("GRADING SCALE LEGEND", { x: 43 + (subBoxW * 2) + 16, y: curY - 10, size: 7, font: fontSansBold, color: cNavy })
  page.drawText("A+ (97-100) 4.0 | A (93-96) 4.0", { x: 43 + (subBoxW * 2) + 16, y: curY - 22, size: 6.5, font: fontSans, color: cSlate })
  page.drawText("A- (90-92)  3.7 | B+ (87-89) 3.3", { x: 43 + (subBoxW * 2) + 16, y: curY - 32, size: 6.5, font: fontSans, color: cSlate })
  page.drawText("B  (83-86)  3.0 | AP Weight: +1.0", { x: 43 + (subBoxW * 2) + 16, y: curY - 42, size: 6.5, font: fontSans, color: cSlate })

  curY -= (subH + 16)

  // 7. 签署与印章区
  page.drawText(
    "I hereby certify that this is a true, authentic, and complete official academic record of the student named above.",
    { x: 35, y: curY, size: 7.5, font: fontSerifItalic, color: rgb(0.3, 0.35, 0.4) }
  )
  curY -= 28

  // 校长签名
  page.drawText("Dr. Robert Vance, Principal", { x: 55, y: curY + 6, size: 10, font: fontSerifItalic, color: cNavy })
  page.drawLine({ start: { x: 35, y: curY + 2 }, end: { x: 210, y: curY + 2 }, color: cBorder, thickness: 1 })
  page.drawText("PRINCIPAL SIGNATURE & TITLE", { x: 50, y: curY - 8, size: 7, font: fontSansBold, color: cBorder })

  // 官方公章 (模拟红色圆印章)
  const sealX = width / 2
  const sealY = curY - 2
  page.drawCircle({ x: sealX, y: sealY, size: 26, borderColor: cRed, borderWidth: 1.5 })
  page.drawCircle({ x: sealX, y: sealY, size: 22, borderColor: cRed, borderWidth: 0.75 })
  page.drawText("OFFICIAL SEAL", { x: sealX - 20, y: sealY + 2, size: 5.5, font: fontSansBold, color: cRed })
  page.drawText("STATE BOARD", { x: sealX - 18, y: sealY - 6, size: 5, font: fontSansBold, color: cRed })

  // 教务注册主任签名
  page.drawText("Karen L. Montgomery", { x: width - 195, y: curY + 6, size: 10, font: fontSerifItalic, color: cNavy })
  page.drawLine({ start: { x: width - 210, y: curY + 2 }, end: { x: width - 35, y: curY + 2 }, color: cBorder, thickness: 1 })
  page.drawText(`REGISTRAR  ·  ${options.issueDate || "June 12, 2024"}`, { x: width - 190, y: curY - 8, size: 7, font: fontSansBold, color: cBorder })

  return await doc.save()
}

async function main() {
  const dir = path.resolve("./public/samples")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // 1. 加州比弗利山庄公立高中成绩单
  const caPdf = await buildTranscriptPdf({
    schoolName: "Beverly Hills High School",
    districtName: "Beverly Hills Unified School District",
    address: "241 Moreno Dr",
    city: "Beverly Hills",
    state: "CA",
    zip: "90212",
    phone: "(310) 551-5100",
    ceeb: "050290",
    nces: "060522000452",
    studentName: "CHEN, KEVIN WEI",
    dob: "04/18/2006",
    gender: "Male",
    studentId: "STU-99201482",
    gpaUnweighted: "3.88",
    gpaWeighted: "4.25",
    classRank: "18 of 360 (Top 5%)",
    gradDate: "June 07, 2024",
    credits: "26.00",
    watermark: "OFFICIAL TRANSCRIPT",
    issueDate: "June 10, 2024",
  })
  fs.writeFileSync(path.join(dir, "Sample_1_Public_High_School_CA.pdf"), caPdf)
  console.log("Generated: Sample_1_Public_High_School_CA.pdf", caPdf.length, "bytes")

  // 2. 德州奥斯汀公立高中成绩单 (AAR Style)
  const txPdf = await buildTranscriptPdf({
    schoolName: "Westlake High School",
    districtName: "Eanes Independent School District",
    address: "4100 Westbank Dr",
    city: "Austin",
    state: "TX",
    zip: "78746",
    phone: "(512) 732-9280",
    ceeb: "440343",
    nces: "481749001552",
    studentName: "RODRIGUEZ, CARLOS MATEO",
    dob: "11/05/2005",
    gender: "Male",
    studentId: "TX-AAR-4890218",
    gpaUnweighted: "3.82",
    gpaWeighted: "4.16",
    classRank: "32 of 410 (Top 8%)",
    gradDate: "May 29, 2024",
    credits: "27.00",
    watermark: "TEXAS AAR OFFICIAL",
    issueDate: "June 02, 2024",
  })
  fs.writeFileSync(path.join(dir, "Sample_2_Texas_AAR_Style_TX.pdf"), txPdf)
  console.log("Generated: Sample_2_Texas_AAR_Style_TX.pdf", txPdf.length, "bytes")

  // 3. 纽约史岱文森公立名校成绩单
  const nyPdf = await buildTranscriptPdf({
    schoolName: "Stuyvesant High School",
    districtName: "New York City Geographic District #2",
    address: "345 Chambers St",
    city: "New York",
    state: "NY",
    zip: "10282",
    phone: "(212) 312-4800",
    ceeb: "334615",
    nces: "360007702877",
    studentName: "WANG, EMILY MEI-LING",
    dob: "08/22/2006",
    gender: "Female",
    studentId: "NYC-STU-339012",
    gpaUnweighted: "3.94",
    gpaWeighted: "4.38",
    classRank: "12 of 820 (Top 2%)",
    gradDate: "June 25, 2024",
    credits: "28.50",
    watermark: "OFFICIAL RECORD",
    issueDate: "June 28, 2024",
  })
  fs.writeFileSync(path.join(dir, "Sample_3_New_York_Stuyvesant_NY.pdf"), nyPdf)
  console.log("Generated: Sample_3_New_York_Stuyvesant_NY.pdf", nyPdf.length, "bytes")

  // 4. 免税州俄勒冈林肯高中大学招生样板
  const orPdf = await buildTranscriptPdf({
    schoolName: "Lincoln High School",
    districtName: "Portland Public Schools",
    address: "1750 SW Salmon St",
    city: "Portland",
    state: "OR",
    zip: "97205",
    phone: "(503) 916-5200",
    ceeb: "380885",
    nces: "410001800843",
    studentName: "SMITH, ALEXANDER JAMES",
    dob: "02/14/2006",
    gender: "Male",
    studentId: "OR-PPS-7740192",
    gpaUnweighted: "3.78",
    gpaWeighted: "4.10",
    classRank: "28 of 320 (Top 10%)",
    gradDate: "June 05, 2024",
    credits: "25.00",
    watermark: "ADMISSIONS SAMPLE",
    issueDate: "June 08, 2024",
  })
  fs.writeFileSync(path.join(dir, "Sample_4_Oregon_Lincoln_OR.pdf"), orPdf)
  console.log("Generated: Sample_4_Oregon_Lincoln_OR.pdf", orPdf.length, "bytes")
}

main().catch(console.error)
