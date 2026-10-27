import type { PersonData } from "./types"

export interface BankTransaction {
  date: string
  description: string
  amount: number
  type: "deposit" | "withdrawal"
  balance: number
}

export interface BankStatementData {
  bankId: "bofa" | "usbank"
  bankName: string
  bankLogoText: string
  bankAddress: string
  customerServicePhone: string
  website: string
  statementPeriod: string
  customerName: string
  customerAddress: string
  accountNumberMasked: string
  routingNumber: string
  startingBalance: number
  totalDeposits: number
  totalWithdrawals: number
  endingBalance: number
  transactions: BankTransaction[]
}

export function generateBankStatement(
  person: PersonData,
  seed = 2026,
  bankType: "bofa" | "usbank" = "bofa"
): BankStatementData {
  const s = seed || 881290
  const randomAt = (offset: number) => {
    const x = Math.sin(s + offset) * 10000
    return x - Math.floor(x)
  }

  // 计算最近一个完整自然月份的对账周期 (严格锚定在已过去的真实时间，绝不生成未来时间)
  const now = new Date()
  const realCurrentYear = now.getFullYear()
  const year = realCurrentYear > 2024 ? 2024 : realCurrentYear
  const month = realCurrentYear > 2024 ? 9 : (now.getMonth() || 1)
  const statementStart = new Date(year, month - 1, 1)
  const statementEnd = new Date(year, month, 0)

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  const formatShortDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })

  const periodStr = `${formatDate(statementStart)} through ${formatDate(statementEnd)}`

  // 基础财务数据与工资匹配
  const annualSalaryStr = person.salary ? person.salary.replace(/[^0-9]/g, "") : "75000"
  const annualSalary = parseInt(annualSalaryStr, 10) || 75000
  const biweeklyPay = Number((annualSalary / 26 * 0.78).toFixed(2)) // 税后双周发薪

  let balance = Number((3800 + randomAt(1) * 4500).toFixed(2))
  const startBalance = balance

  const txList: BankTransaction[] = []

  // 1. 月初发薪 (Direct Deposit)
  const d1 = new Date(year, month - 1, 2)
  balance = Number((balance + biweeklyPay).toFixed(2))
  txList.push({
    date: formatShortDate(d1),
    description: `DIR DEP ${person.company || "CORPORATE PAYROLL"} PAYROLL`,
    amount: biweeklyPay,
    type: "deposit",
    balance,
  })

  // 2. 房租/房贷 (Rent / Mortgage)
  const d2 = new Date(year, month - 1, 3)
  const rent = Number((1200 + randomAt(2) * 600).toFixed(2))
  balance = Number((balance - rent).toFixed(2))
  txList.push({
    date: formatShortDate(d2),
    description: "ONLINE PAYMENT RESIDENTIAL LEASE ACH",
    amount: rent,
    type: "withdrawal",
    balance,
  })

  // 3. 超市购物 (Grocery)
  const d3 = new Date(year, month - 1, 6)
  const g1 = Number((112 + randomAt(3) * 60).toFixed(2))
  balance = Number((balance - g1).toFixed(2))
  txList.push({
    date: formatShortDate(d3),
    description: "DEBIT CARD PURCHASE WHOLE FOODS #1042",
    amount: g1,
    type: "withdrawal",
    balance,
  })

  // 4. 水电燃气公用事业费 (Utility Bill)
  const d4 = new Date(year, month - 1, 10)
  const util = Number((85 + randomAt(4) * 40).toFixed(2))
  balance = Number((balance - util).toFixed(2))
  txList.push({
    date: formatShortDate(d4),
    description: "UTILITY BILL ELEC & GAS ONLINE PMT",
    amount: util,
    type: "withdrawal",
    balance,
  })

  // 5. 亚马逊购物 (Amazon)
  const d5 = new Date(year, month - 1, 14)
  const amz = Number((45 + randomAt(5) * 80).toFixed(2))
  balance = Number((balance - amz).toFixed(2))
  txList.push({
    date: formatShortDate(d5),
    description: "AMAZON.COM*2M40L1 DIGITAL RETAIL WA",
    amount: amz,
    type: "withdrawal",
    balance,
  })

  // 6. 月中二次发薪 (Second Paycheck)
  const d6 = new Date(year, month - 1, 16)
  balance = Number((balance + biweeklyPay).toFixed(2))
  txList.push({
    date: formatShortDate(d6),
    description: `DIR DEP ${person.company || "CORPORATE PAYROLL"} PAYROLL`,
    amount: biweeklyPay,
    type: "deposit",
    balance,
  })

  // 7. 加油站消费 (Gas)
  const d7 = new Date(year, month - 1, 20)
  const gas = Number((48 + randomAt(7) * 20).toFixed(2))
  balance = Number((balance - gas).toFixed(2))
  txList.push({
    date: formatShortDate(d7),
    description: "SHELL OIL 57442104 QPS FUEL",
    amount: gas,
    type: "withdrawal",
    balance,
  })

  // 8. 餐饮生活 (Dining & Coffee)
  const d8 = new Date(year, month - 1, 24)
  const coffee = Number((18.5 + randomAt(8) * 15).toFixed(2))
  balance = Number((balance - coffee).toFixed(2))
  txList.push({
    date: formatShortDate(d8),
    description: "STARBUCKS STORE 08412 MOBILE ORDER",
    amount: coffee,
    type: "withdrawal",
    balance,
  })

  // 9. 手机通讯费 (Cellular Service)
  const d9 = new Date(year, month - 1, 27)
  const phone = Number((65 + randomAt(9) * 20).toFixed(2))
  balance = Number((balance - phone).toFixed(2))
  txList.push({
    date: formatShortDate(d9),
    description: "T-MOBILE AUTOPAY CELLULAR SVC",
    amount: phone,
    type: "withdrawal",
    balance,
  })

  let totalDep = 0
  let totalWd = 0
  txList.forEach((t) => {
    if (t.type === "deposit") totalDep += t.amount
    else totalWd += t.amount
  })

  const routing = (100000000 + Math.floor(randomAt(11) * 899999999)).toString()
  const acctLast4 = person.cardNumber ? person.cardNumber.slice(-4) : "4892"

  const isUsBank = bankType === "usbank"

  return {
    bankId: bankType,
    bankName: isUsBank ? "U.S. Bank National Association" : "Bank of America, N.A.",
    bankLogoText: isUsBank ? "us bank" : "BANK OF AMERICA",
    bankAddress: isUsBank ? "800 Nicollet Mall, Minneapolis, MN 55402" : "P.O. Box 15284, Wilmington, DE 19850",
    customerServicePhone: isUsBank ? "1-800-USBANKS (1-800-872-2657)" : "1-800-432-1000",
    website: isUsBank ? "usbank.com" : "bankofamerica.com",
    statementPeriod: periodStr,
    customerName: person.fullName,
    customerAddress: person.fullAddress,
    accountNumberMasked: `**** **** **** ${acctLast4}`,
    routingNumber: isUsBank ? "091000022" : routing,
    startingBalance: startBalance,
    totalDeposits: Number(totalDep.toFixed(2)),
    totalWithdrawals: Number(totalWd.toFixed(2)),
    endingBalance: Number(balance.toFixed(2)),
    transactions: txList,
  }
}
