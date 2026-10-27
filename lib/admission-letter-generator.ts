import type { PersonData, UniversityData } from "./types"

export interface AdmissionLetterData {
  universityName: string
  schoolCollege: string
  addressLine: string
  cityStateZip: string
  phone: string
  website: string
  sealType: "berkeley" | "mit" | "harvard" | "uchicago" | "csuf" | "temple" | "general"
  issueDate: string
  recipientName: string
  recipientAddress: string
  recipientCityStateZip: string
  applicationId: string
  studentId: string
  degreeProgram: string
  admitTerm: string
  responseDeadline: string
  scholarshipTitle: string
  scholarshipAmount: string
  signatoryName: string
  signatoryTitle: string
  signatoryName2?: string
  signatoryTitle2?: string
  letterBody: string[]
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

interface PresetInstitution {
  id: string
  name: string
  schoolCollege: string
  addressLine: string
  cityStateZip: string
  phone: string
  website: string
  sealType: "berkeley" | "mit" | "harvard" | "uchicago" | "csuf" | "temple" | "general"
  signatoryName: string
  signatoryTitle: string
  signatoryName2?: string
  signatoryTitle2?: string
}

export const PRESET_INSTITUTIONS: PresetInstitution[] = [
  {
    id: "berkeley",
    name: "University of California, Berkeley",
    schoolCollege: "Graduate Division & College of Engineering",
    addressLine: "424 Sproul Hall, MC 5900",
    cityStateZip: "Berkeley, CA 94720",
    phone: "(510) 642-7405",
    website: "grad.berkeley.edu",
    sealType: "berkeley",
    signatoryName: "Lisa García Bedolla, Ph.D.",
    signatoryTitle: "Vice Provost for Graduate Studies and Dean of the Graduate Division",
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    schoolCollege: "MIT Sloan School of Management",
    addressLine: "77 Massachusetts Avenue, Room E52-359",
    cityStateZip: "Cambridge, MA 02139",
    phone: "(617) 253-1000",
    website: "mitsloan.mit.edu",
    sealType: "mit",
    signatoryName: "Dawna S. Levenson",
    signatoryTitle: "Assistant Dean of Admissions, MIT Sloan School of Management",
    signatoryName2: "Adam P. Willard",
    signatoryTitle2: "Graduate Officer, Academic Affairs",
  },
  {
    id: "harvard",
    name: "Harvard Medical School",
    schoolCollege: "Graduate Education & Division of Medical Sciences",
    addressLine: "Gordon Hall, 25 Shattuck Street",
    cityStateZip: "Boston, MA 02115",
    phone: "(617) 432-1000",
    website: "hms.harvard.edu",
    sealType: "harvard",
    signatoryName: "Neal Baer, MD",
    signatoryTitle: "Faculty Co-Director, Media, Medicine, and Health",
    signatoryName2: "Jason Silverstein, PhD",
    signatoryTitle2: "Faculty Co-Director, Master of Science Program",
  },
  {
    id: "uchicago",
    name: "The University of Chicago",
    schoolCollege: "Harris School of Public Policy",
    addressLine: "1307 East 60th Street",
    cityStateZip: "Chicago, IL 60637",
    phone: "(773) 702-8400",
    website: "harris.uchicago.edu",
    sealType: "uchicago",
    signatoryName: "Ranjan Daniels",
    signatoryTitle: "Senior Associate Dean of Student and Academic Affairs",
  },
  {
    id: "csuf",
    name: "California State University, Fullerton",
    schoolCollege: "Office of Admissions and Records",
    addressLine: "P.O. Box 6900",
    cityStateZip: "Fullerton, CA 92834",
    phone: "(657) 278-2370",
    website: "fullerton.edu",
    sealType: "csuf",
    signatoryName: "Jessica M. Wagoner",
    signatoryTitle: "Senior Director of Admissions",
  },
  {
    id: "temple",
    name: "Temple University",
    schoolCollege: "Office of Undergraduate Admissions",
    addressLine: "Conwell Hall, 1801 N. Broad St",
    cityStateZip: "Philadelphia, PA 19122",
    phone: "(215) 204-7200",
    website: "temple.edu",
    sealType: "temple",
    signatoryName: "Shawn L. Abbott, Ed.D.",
    signatoryTitle: "Vice Provost for Admissions, Financial Aid & Enrollment",
  },
]

export function generateAdmissionLetter(
  person: PersonData,
  university: UniversityData | null,
  seed: number,
  institutionId?: string
): AdmissionLetterData {
  const birthYear = parseBirthYear(person.birthday)
  // Ensure admission year is <= 2024 and logically aligned with birth year
  const rawAdmitYear = Math.max(birthYear + 22, 2020)
  const admitYear = Math.min(rawAdmitYear, 2024)

  // Select institution preset or custom university
  let inst = PRESET_INSTITUTIONS[seed % PRESET_INSTITUTIONS.length]
  if (institutionId) {
    const found = PRESET_INSTITUTIONS.find((p) => p.id === institutionId)
    if (found) inst = found
  } else if (university && university.name) {
    // If user's university matches or default to user's university
    inst = {
      id: "custom",
      name: university.name,
      schoolCollege: "Graduate Admissions & Academic Affairs",
      addressLine: university.address || "100 University Boulevard",
      cityStateZip: `${university.city || person.city}, ${university.state || person.state} ${university.zip || person.zipCode}`,
      phone: university.telephone || "(800) 555-0199",
      website: university.website || "www.admissions.edu",
      sealType: "general" as const,
      signatoryName: "Dr. Arthur Vance, Ph.D.",
      signatoryTitle: "Dean of Academic Admissions and Enrollment",
    }
  }

  let degreeProgram = "Master of Science in Computer Science & Artificial Intelligence"
  if (inst.id === "mit") {
    degreeProgram = (seed % 2 === 0) ? "Master of Finance (MFin)" : "Master of Business Administration (MBA)"
  } else if (inst.id === "harvard") {
    degreeProgram = "Master of Science in Media, Medicine, and Health"
  } else if (inst.id === "uchicago") {
    degreeProgram = "Master of Public Policy (MPP)"
  } else if (inst.id === "csuf") {
    degreeProgram = "Bachelor of Arts in Business Administration"
  } else if (inst.id === "temple") {
    degreeProgram = "Bachelor of Arts in Film and Media Arts"
  } else {
    const programs = [
      "Master of Science in Computer Science & Artificial Intelligence",
      "Master of Business Administration (MBA)",
      "Master of Science in Financial Engineering",
      "Master of Science in Data Science & Machine Learning",
      "Master of Science in Electrical Engineering",
      "Master of Public Policy (MPP)",
    ]
    degreeProgram = programs[seed % programs.length]
  }

  const months = ["January", "February", "March", "April"]
  const issueDate = `${months[seed % months.length]} ${(seed % 20) + 5}, ${admitYear}`
  const admitTerm = `Fall ${admitYear}`
  const responseDeadline = `May 1, ${admitYear}`

  const scholarships = [
    { title: "Dean's Merit Fellowship", amount: "$30,000" },
    { title: "Graduate Achievement Scholarship", amount: "$24,000" },
    { title: "Provost Academic Excellence Award", amount: "$40,000" },
    { title: "Faculty Honors Tuition Grant", amount: "$18,000" },
  ]
  const award = scholarships[seed % scholarships.length]

  const appId = `APP-${admitYear}-${(seed % 89999 + 10000)}`
  const studentId = `SID-${(seed * 31 % 899999 + 100000)}`

  const letterBody = [
    `Dear ${person.fullName},`,
    `On behalf of the Faculty and the Admissions Committee, it is my distinct honor and pleasure to inform you of your admission to ${inst.name} for the ${admitTerm} academic term.`,
    `Your application for the ${degreeProgram} program was evaluated within an extraordinarily competitive and talented applicant pool. The Admissions Committee was deeply impressed by your academic record, your leadership capabilities, and your demonstrated commitment to intellectual discovery.`,
    `In recognition of your outstanding credentials, we are pleased to award you the ${award.title} in the amount of ${award.amount}, which will be distributed across your enrolled academic semesters.`,
    `Please review the enclosed Admission Verification and Enrollment Checklist for complete instructions regarding campus housing, health immunizations, and official credential submissions. To accept this offer and reserve your seat, please submit your formal reply and enrollment deposit via the Admissions Portal by no later than ${responseDeadline}.`,
    `Congratulations on your outstanding achievements. We look forward to welcoming you as an esteemed member of our collegiate academic community.`,
  ]

  return {
    universityName: inst.name,
    schoolCollege: inst.schoolCollege,
    addressLine: inst.addressLine,
    cityStateZip: inst.cityStateZip,
    phone: inst.phone,
    website: inst.website,
    sealType: inst.sealType,
    issueDate,
    recipientName: person.fullName,
    recipientAddress: person.street,
    recipientCityStateZip: `${person.city}, ${person.state} ${person.zipCode}`,
    applicationId: appId,
    studentId,
    degreeProgram,
    admitTerm,
    responseDeadline,
    scholarshipTitle: award.title,
    scholarshipAmount: award.amount,
    signatoryName: inst.signatoryName,
    signatoryTitle: inst.signatoryTitle,
    signatoryName2: inst.signatoryName2,
    signatoryTitle2: inst.signatoryTitle2,
    letterBody,
  }
}
