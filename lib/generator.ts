import { fakerEN_US as faker } from "@faker-js/faker"
import type { PersonData } from "./types"
import { type RealAddress, getRealAddressOffline } from "./real-addresses"

export interface GenerateOptions {
  state?: string
  city?: string
  gender?: string
  minAge?: number
  maxAge?: number
  seed?: number
  realAddress?: RealAddress
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const HAIR_COLORS = ["Black", "Brown", "Blonde", "Auburn", "Red", "Gray"]
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
const EMPLOYMENT_STATUS = ["Full-time", "Part-time", "Self-employed", "Contract", "Retired"]
const EDUCATION_LEVELS = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
]
const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your high school mascot?",
  "What city were you born in?",
  "What was your first car model?",
]

export function generatePersonData(options: GenerateOptions = {}): PersonData {
  if (options.seed !== undefined && options.seed !== null && options.seed !== 0) {
    faker.seed(options.seed)
  }

  // Gender
  const normalizedGender = options.gender?.toLowerCase()
  const isFemale = normalizedGender === "female"
  const isMale = normalizedGender === "male"
  const genderType = isFemale ? "female" : isMale ? "male" : faker.datatype.boolean() ? "male" : "female"
  const gender = genderType === "male" ? "Male" : "Female"

  // Names
  const firstName = faker.person.firstName(genderType)
  const lastName = faker.person.lastName()
  const title = genderType === "male" 
    ? faker.helpers.arrayElement(["Mr.", "Dr."]) 
    : faker.helpers.arrayElement(["Ms.", "Mrs.", "Miss", "Dr."])
  const fullName = `${firstName} ${lastName}`

  // 100% 真实美国物理地址（门牌、街道、城市、州、邮编五位一体完全匹配）
  const address = options.realAddress || getRealAddressOffline(options.state, options.city, options.seed)
  const street = address.street
  const city = address.city
  const stateCode = address.state
  const stateFullName = address.stateFullName
  const zipCode = address.zipCode
  const fullAddress = `${street}, ${city}, ${stateCode} ${zipCode}`

  // Age & Birthday
  const currentYear = new Date().getFullYear()
  const minAge = options.minAge && options.minAge > 0 ? options.minAge : 18
  const maxAge = options.maxAge && options.maxAge > 0 ? options.maxAge : 75
  const birthYear = faker.number.int({ min: currentYear - maxAge, max: currentYear - minAge })
  const birthMonth = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0")
  const birthDay = String(faker.number.int({ min: 1, max: 28 })).padStart(2, "0")
  const birthday = `${birthMonth}/${birthDay}/${birthYear}`

  // Physical
  const heightInches = faker.number.int({ min: 60, max: 76 })
  const heightFeet = Math.floor(heightInches / 12)
  const heightRemInches = heightInches % 12
  const heightCm = Math.round(heightInches * 2.54)
  const height = `${heightFeet} ft ${heightRemInches} in (${heightCm} cm)`

  const weightLbs = faker.number.int({ min: 110, max: 240 })
  const weightKg = Math.round(weightLbs * 0.453592)
  const weight = `${weightLbs} lbs (${weightKg} kg)`

  // Financial
  const ssn = faker.helpers.replaceSymbols("###-##-####")
  const cardType = faker.helpers.arrayElement(["Visa", "MasterCard", "American Express", "Discover"])
  const cardNumber = faker.finance.creditCardNumber()
  const cvv = Number.parseInt(faker.finance.creditCardCVV(), 10)
  const expMonth = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0")
  const expYear = String((currentYear % 100) + faker.number.int({ min: 1, max: 6 })).padStart(2, "0")
  const expiry = `${expMonth}/${expYear}`

  // Work
  const occupation = faker.person.jobTitle()
  const company = faker.company.name()
  const companySize = faker.helpers.arrayElement(COMPANY_SIZES)
  const industry = faker.person.jobArea()
  const status = faker.helpers.arrayElement(EMPLOYMENT_STATUS)
  const salaryNum = faker.number.int({ min: 45, max: 180 }) * 1000
  const salary = `$${salaryNum.toLocaleString("en-US")}`

  // Account
  const username = faker.internet.username({ firstName, lastName }).toLowerCase()
  const password = faker.internet.password({ length: 12, memorable: true })
  const email = faker.internet.email({ firstName, lastName }).toLowerCase()
  const phone = faker.phone.number({ style: "national" })
  const securityQuestion = faker.helpers.arrayElement(SECURITY_QUESTIONS)
  const securityAnswer = faker.word.words({ count: 1 })

  // Tech
  const os = faker.helpers.arrayElement([
    "Windows 11",
    "Windows 10",
    "macOS Sonoma",
    "macOS Sequoia",
    "Ubuntu Linux 24.04",
    "iOS 18",
    "Android 15",
  ])
  const guid = faker.string.uuid()
  const userAgent = faker.internet.userAgent()

  return {
    fullName,
    firstName,
    lastName,
    gender,
    birthday,
    title,
    hairColor: faker.helpers.arrayElement(HAIR_COLORS),
    country: "United States",
    street,
    city,
    state: stateCode,
    stateFullName,
    zipCode,
    phone,
    email,
    fullAddress,
    occupation,
    company,
    companySize,
    industry,
    status,
    salary,
    ssn,
    cardType,
    cardNumber,
    cvv,
    expiry,
    username,
    password,
    height,
    weight,
    bloodType: faker.helpers.arrayElement(BLOOD_TYPES),
    os,
    guid,
    userAgent,
    education: faker.helpers.arrayElement(EDUCATION_LEVELS),
    website: faker.internet.url(),
    securityQuestion,
    securityAnswer,
  }
}
