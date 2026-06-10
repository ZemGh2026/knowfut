// Maps team names → ISO 3166-1 alpha-2 codes for use with flag-icons CSS library
export const countryFlagCodes: Record<string, string> = {
  // Group A
  Mexico: "mx",
  "South Africa": "za",
  "South Korea": "kr",

  // Group B
  Canada: "ca",
  Qatar: "qa",
  Switzerland: "ch",

  // Group C
  Brazil: "br",
  Morocco: "ma",
  Haiti: "ht",
  Scotland: "gb-sct",

  // Group D
  USA: "us",
  Paraguay: "py",
  Australia: "au",

  // Group E
  Spain: "es",
  Japan: "jp",
  "New Zealand": "nz",

  // Group F
  Portugal: "pt",
  Argentina: "ar",
  Indonesia: "id",

  // Group G
  England: "gb-eng",
  Iran: "ir",
  Senegal: "sn",

  // Group H
  Germany: "de",
  Belgium: "be",
  "Saudi Arabia": "sa",

  // Group I
  Netherlands: "nl",
  France: "fr",
  Chile: "cl",

  // Group J
  Uruguay: "uy",
  Colombia: "co",
  Slovenia: "si",

  // Group K
  Ecuador: "ec",
  "Costa Rica": "cr",
  Nigeria: "ng",

  // Group L
  Turkey: "tr",
  "Côte d'Ivoire": "ci",
  "Ivory Coast": "ci",

  // Additional teams
  Serbia: "rs",
  Poland: "pl",
  Denmark: "dk",
  Croatia: "hr",
  Austria: "at",
  Czech: "cz",
  Czechia: "cz",
  "Czech Republic": "cz",
  Ukraine: "ua",
  Romania: "ro",
  Hungary: "hu",
  Slovakia: "sk",
  Greece: "gr",
  "Bosnia and Herzegovina": "ba",
  Bosnia: "ba",
  Wales: "gb-wls",
  Sweden: "se",
  Norway: "no",
  Finland: "fi",
  Iceland: "is",
  Russia: "ru",
  Egypt: "eg",
  Cameroon: "cm",
  Ghana: "gh",
  Tunisia: "tn",
  Algeria: "dz",
  Mali: "ml",
  Zambia: "zm",
  Kenya: "ke",
  Tanzania: "tz",
  Ethiopia: "et",
  China: "cn",
  India: "in",
  Thailand: "th",
  Vietnam: "vn",
  Philippines: "ph",
  Malaysia: "my",
  Singapore: "sg",
  Fiji: "fj",
  "Papua New Guinea": "pg",
  Jamaica: "jm",
  "Trinidad and Tobago": "tt",
  Trinidad: "tt",
  Honduras: "hn",
  Guatemala: "gt",
  Panama: "pa",
  Cuba: "cu",
  Venezuela: "ve",
  Peru: "pe",
  Bolivia: "bo",
  Bahrain: "bh",
  "United Arab Emirates": "ae",
  UAE: "ae",
  Kuwait: "kw",
  Iraq: "iq",
  Oman: "om",
  Jordan: "jo",
  Palestine: "ps",
  Lebanon: "lb",
  Syria: "sy",
  Israel: "il",
  "North Korea": "kp",
  Uzbekistan: "uz",
  Kazakhstan: "kz",
  Tonga: "to",
  Samoa: "ws",
  Vanuatu: "vu",

  // Missing teams added
  Curacao: "cw",
  "Curaçao": "cw",
  "Cape Verde": "cv",
  "DR Congo": "cd",
  "Congo DR": "cd",
  "Democratic Republic of Congo": "cd",
  Congo: "cg",
  Libya: "ly",
  Zimbabwe: "zw",
  Uganda: "ug",
  Angola: "ao",
  Mozambique: "mz",
  Madagascar: "mg",
  Rwanda: "rw",
  Burundi: "bi",
  Benin: "bj",
  Togo: "tg",
  Gabon: "ga",
  "Guinea-Bissau": "gw",
  Guinea: "gn",
  "Equatorial Guinea": "gq",
  Sudan: "sd",
  Somalia: "so",
  Eritrea: "er",
  Djibouti: "dj",
  Kosovo: "xk",
  "North Macedonia": "mk",
  Albania: "al",
  Montenegro: "me",
  Moldova: "md",
  Belarus: "by",
  Lithuania: "lt",
  Latvia: "lv",
  Estonia: "ee",
  Luxembourg: "lu",
  Malta: "mt",
  Cyprus: "cy",
  Georgia: "ge",
  Armenia: "am",
  Azerbaijan: "az",
  "El Salvador": "sv",
  Nicaragua: "ni",
  "Dominican Republic": "do",
  Suriname: "sr",
  Guyana: "gy",
  Belize: "bz",
  Barbados: "bb",
  Bahamas: "bs",
  "Puerto Rico": "pr",
  Myanmar: "mm",
  Cambodia: "kh",
  Laos: "la",
  "Sri Lanka": "lk",
  Nepal: "np",
  Pakistan: "pk",
  Bangladesh: "bd",
  Afghanistan: "af",
  Mongolia: "mn",
  "New Caledonia": "nc",
  "Solomon Islands": "sb",
};

export function getFlagCode(teamName: string): string | null {
  if (!teamName) return null;
  if (countryFlagCodes[teamName]) return countryFlagCodes[teamName];
  // Fuzzy match
  const key = Object.keys(countryFlagCodes).find((k) =>
    teamName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? countryFlagCodes[key] : null;
}