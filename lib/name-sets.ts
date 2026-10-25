export type NameSetType = "american" | "chinese" | "japanese" | "korean" | "hispanic"

export interface NameSetOption {
  id: NameSetType
  label: string
  flag: string
  example: string
}

export const NAME_SET_OPTIONS: NameSetOption[] = [
  { id: "american", label: "欧美经典 (American)", flag: "🇺🇸", example: "James Smith" },
  { id: "chinese", label: "华裔/华人 (Chinese)", flag: "🇨🇳", example: "Wei Chen / Kevin Zhang" },
  { id: "japanese", label: "日裔/日本 (Japanese)", flag: "🇯🇵", example: "Kenji Sato / Sakura Tanaka" },
  { id: "korean", label: "韩裔/韩国 (Korean)", flag: "🇰🇷", example: "Min-Jun Kim / Ji-Woo Park" },
  { id: "hispanic", label: "拉美/西裔 (Hispanic)", flag: "🇪🇸", example: "Carlos Rodriguez / Sofia Garcia" },
]

// 华裔/华人常用拼音与美籍英文名库
export const CHINESE_NAMES = {
  surnames: [
    "Wang", "Li", "Zhang", "Liu", "Chen", "Yang", "Huang", "Zhao", "Wu", "Zhou",
    "Xu", "Sun", "Ma", "Zhu", "Hu", "Guo", "He", "Gao", "Lin", "Luo",
    "Zheng", "Liang", "Xie", "Song", "Tang", "Xu", "Han", "Feng", "Deng", "Cao",
    "Peng", "Zeng", "Xiao", "Tian", "Dong", "Yuan", "Pan", "Yu", "Jiang", "Cai",
  ],
  malePinyin: [
    "Wei", "Jian", "Ming", "Hao", "Jun", "Bo", "Tao", "Lei", "Feng", "Chao",
    "Peng", "Qiang", "Yu", "Bin", "Shuai", "Xin", "Kai", "Yong", "Zhi", "Cheng",
  ],
  femalePinyin: [
    "Mei", "Lin", "Xiao", "Ying", "Jie", "Yan", "Fang", "Li", "Na", "Juan",
    "Ting", "Dan", "Qian", "Rui", "Hui", "Jing", "Min", "Xue", "Yue", "Ping",
  ],
  maleWestern: [
    "Kevin", "David", "Michael", "Jason", "Eric", "Andrew", "Daniel", "Alex",
    "Justin", "Brian", "Steven", "Ryan", "Tony", "Raymond", "Vincent", "Jeffrey",
  ],
  femaleWestern: [
    "Emily", "Jessica", "Tiffany", "Grace", "Chloe", "Amy", "Jennifer", "Michelle",
    "Kelly", "Stephanie", "Vivian", "Joyce", "Cynthia", "Rachel", "Angela", "Fiona",
  ],
}

// 日裔/日本姓名库 (Romaji)
export const JAPANESE_NAMES = {
  surnames: [
    "Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura",
    "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Saito", "Matsumoto",
    "Inoue", "Kimura", "Hayashi", "Shimizu", "Yamazaki", "Mori", "Abe", "Ikeda",
  ],
  maleFirst: [
    "Kenji", "Hiroshi", "Daiki", "Sota", "Ren", "Yuto", "Haruto", "Kaito", "Kazuki",
    "Ryota", "Tsubasa", "Shota", "Takumi", "Naoki", "Daisuke", "Ken", "George",
  ],
  femaleFirst: [
    "Yui", "Aoi", "Hina", "Sakura", "Rin", "Mei", "Mio", "Nanami", "Akari",
    "Emi", "Yoko", "Ayumi", "Keiko", "Mayumi", "Asuka", "Misaki", "Kana",
  ],
}

// 韩裔/韩国姓名库 (Revised Romanization)
export const KOREAN_NAMES = {
  surnames: [
    "Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim",
    "Han", "Oh", "Seo", "Shin", "Kwon", "Hwang", "Ahn", "Song", "Ryu", "Hong",
  ],
  maleFirst: [
    "Min-Jun", "Seo-Jun", "Do-Yun", "Ye-Jun", "Si-Woo", "Ha-Joon", "Ji-Ho", "Ju-Won",
    "Daniel", "Justin", "Brian", "Eugene", "Alex", "David", "Kevin", "Sung-Min",
  ],
  femaleFirst: [
    "Seo-Yeon", "Seo-Yun", "Ji-Woo", "Seo-Hyun", "Ha-Eun", "Min-Seo", "Ji-A", "Chae-Won",
    "Grace", "Chloe", "Hannah", "Sarah", "Joy", "Esther", "Eun-Ji", "Soo-Jin",
  ],
}

// 西班牙裔 / 拉美裔姓名库
export const HISPANIC_NAMES = {
  surnames: [
    "Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez",
    "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Cruz",
    "Morales", "Reyes", "Gutierrez", "Ortiz", "Ramos", "Chavez", "Mendoza", "Castillo",
  ],
  maleFirst: [
    "Carlos", "Mateo", "Santiago", "Alejandro", "Diego", "Sebastian", "Gabriel",
    "Emiliano", "Daniel", "Lucas", "Miguel", "Antonio", "Javier", "Jose", "Manuel",
  ],
  femaleFirst: [
    "Sofia", "Valentina", "Camila", "Isabella", "Lucia", "Maria", "Elena",
    "Victoria", "Gabriela", "Carmen", "Daniela", "Mariana", "Paula", "Natalia",
  ],
}

/**
 * 根据族裔/风格生成逼真的全套姓名
 */
export function generateCulturalName(
  nameSet: NameSetType = "american",
  gender: "male" | "female" = "male",
  rand: () => number,
): { firstName: string; lastName: string; fullName: string } {
  if (nameSet === "chinese") {
    const lastName = CHINESE_NAMES.surnames[Math.floor(rand() * CHINESE_NAMES.surnames.length)]
    // 50% 概率生成美籍华人常用英文名 (如 Kevin Zhang)，50% 生成拼音名 (如 Wei Zhang)
    const isWesternStyle = rand() > 0.45
    let firstName: string
    if (isWesternStyle) {
      const westernList = gender === "male" ? CHINESE_NAMES.maleWestern : CHINESE_NAMES.femaleWestern
      firstName = westernList[Math.floor(rand() * westernList.length)]
    } else {
      const pinyinList = gender === "male" ? CHINESE_NAMES.malePinyin : CHINESE_NAMES.femalePinyin
      firstName = pinyinList[Math.floor(rand() * pinyinList.length)]
    }
    return { firstName, lastName, fullName: `${firstName} ${lastName}` }
  }

  if (nameSet === "japanese") {
    const lastName = JAPANESE_NAMES.surnames[Math.floor(rand() * JAPANESE_NAMES.surnames.length)]
    const list = gender === "male" ? JAPANESE_NAMES.maleFirst : JAPANESE_NAMES.femaleFirst
    const firstName = list[Math.floor(rand() * list.length)]
    return { firstName, lastName, fullName: `${firstName} ${lastName}` }
  }

  if (nameSet === "korean") {
    const lastName = KOREAN_NAMES.surnames[Math.floor(rand() * KOREAN_NAMES.surnames.length)]
    const list = gender === "male" ? KOREAN_NAMES.maleFirst : KOREAN_NAMES.femaleFirst
    const firstName = list[Math.floor(rand() * list.length)]
    return { firstName, lastName, fullName: `${firstName} ${lastName}` }
  }

  if (nameSet === "hispanic") {
    const lastName = HISPANIC_NAMES.surnames[Math.floor(rand() * HISPANIC_NAMES.surnames.length)]
    const list = gender === "male" ? HISPANIC_NAMES.maleFirst : HISPANIC_NAMES.femaleFirst
    const firstName = list[Math.floor(rand() * list.length)]
    return { firstName, lastName, fullName: `${firstName} ${lastName}` }
  }

  // 默认欧美经典由外部调用 faker
  return { firstName: "", lastName: "", fullName: "" }
}
