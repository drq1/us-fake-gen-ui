// 全美 50 州 + 华盛顿特区主要城市数据字典（离线内置，100% 可靠，彻底替代失效的外部接口）
export const US_STATE_CITIES: Record<string, string[]> = {
  AL: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Auburn", "Hoover", "Dothan"],
  AK: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla", "Kenai", "Kodiak"],
  AZ: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Chandler", "Tempe", "Glendale", "Gilbert", "Peoria"],
  AR: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "Bentonville", "Rogers", "Conway"],
  CA: [
    "Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento",
    "Fresno", "Long Beach", "Oakland", "Irvine", "Anaheim", "Santa Ana",
    "Pasadena", "Glendale", "Fremont", "Sunnyvale", "Santa Clara"
  ],
  CO: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Boulder", "Thornton", "Arvada"],
  CT: ["Hartford", "New Haven", "Stamford", "Bridgeport", "Waterbury", "Norwalk", "Danbury", "Greenwich"],
  DE: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna", "Milford", "Seaford", "Georgetown"],
  FL: [
    "Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee",
    "Fort Lauderdale", "St. Petersburg", "Gainesville", "Hialeah", "Boca Raton", "Pensacola"
  ],
  GA: ["Atlanta", "Savannah", "Augusta", "Columbus", "Athens", "Macon", "Sandy Springs", "Roswell"],
  HI: ["Honolulu", "Hilo", "Kailua", "Pearl City", "Kahului", "Kaneohe", "Kapolei", "Waipahu"],
  ID: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Coeur d'Alene", "Twin Falls"],
  IL: [
    "Chicago", "Aurora", "Naperville", "Rockford", "Joliet",
    "Springfield", "Peoria", "Elgin", "Champaign", "Evanston"
  ],
  IN: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Bloomington", "Fishers", "Lafayette"],
  IA: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Ames", "Waterloo", "Council Bluffs"],
  KS: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence", "Shawnee", "Manhattan"],
  KY: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Frankfort", "Richmond", "Hopkinsville"],
  LA: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Metairie", "Kenner", "Bossier City"],
  ME: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn", "Augusta", "Biddeford", "Saco"],
  MD: ["Baltimore", "Annapolis", "Frederick", "Rockville", "Gaithersburg", "Silver Spring", "Bethesda", "Columbia"],
  MA: ["Boston", "Cambridge", "Worcester", "Springfield", "Lowell", "New Bedford", "Quincy", "Newton", "Lynn"],
  MI: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint", "Dearborn", "Warren", "Sterling Heights"],
  MN: ["Minneapolis", "St. Paul", "Rochester", "Bloomington", "Duluth", "Brooklyn Park", "Plymouth", "Woodbury"],
  MS: ["Jackson", "Gulfport", "Southaven", "Biloxi", "Hattiesburg", "Tupelo", "Olive Branch", "Meridian"],
  MO: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence", "Lee's Summit", "O'Fallon", "St. Charles"],
  MT: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre"],
  NE: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "Norfolk"],
  NV: ["Las Vegas", "Reno", "Henderson", "North Las Vegas", "Sparks", "Carson City", "Elko", "Mesquite"],
  NH: ["Manchester", "Nashua", "Concord", "Dover", "Rochester", "Portsmouth", "Keene", "Laconia"],
  NJ: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton", "Princeton", "Clifton", "Camden", "Hoboken"],
  NM: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs"],
  NY: [
    "New York", "Buffalo", "Rochester", "Syracuse", "Albany",
    "Yonkers", "White Plains", "New Rochelle", "Schenectady", "Utica"
  ],
  NC: [
    "Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem",
    "Fayetteville", "Cary", "Wilmington", "Chapel Hill", "Asheville"
  ],
  ND: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Dickinson", "Williston", "Mandan"],
  OH: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown"],
  OK: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton", "Moore", "Midwest City"],
  OR: ["Portland", "Eugene", "Salem", "Gresham", "Hillsboro", "Beaverton", "Bend", "Medford", "Corvallis"],
  PA: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Harrisburg", "Scranton", "Bethlehem"],
  RI: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence", "Woonsocket", "Newport"],
  SC: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Greenville", "Rock Hill", "Summerville"],
  SD: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Pierre", "Yankton"],
  TN: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Jackson"],
  TX: [
    "Houston", "San Antonio", "Dallas", "Austin", "Fort Worth",
    "El Paso", "Arlington", "Plano", "Lubbock", "Irving", "Garland", "Frisco"
  ],
  UT: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George"],
  VT: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier", "Winooski", "St. Albans"],
  VA: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Arlington", "Hampton"],
  WA: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Spokane Valley", "Olympia"],
  WV: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Fairmont", "Weirton", "Martinsburg"],
  WI: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Oshkosh"],
  WY: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston"],
  DC: ["Washington"],
}

/**
 * 根据两字母州代码获取该州的所有真实知名城市列表
 * 纯本地毫秒级响应，零外部网络依赖，绝不触发 404
 */
export function getCitiesForState(stateCode?: string): string[] {
  if (!stateCode || stateCode === "random") {
    return []
  }
  const code = stateCode.toUpperCase().trim()
  return US_STATE_CITIES[code] || []
}
