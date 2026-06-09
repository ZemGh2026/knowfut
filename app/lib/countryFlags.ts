// Maps team names from openfootball API → flag emoji
export const countryFlags: Record<string, string> = {
    // Group A
    Mexico: "🇲🇽",
    "South Africa": "🇿🇦",
    "South Korea": "🇰🇷",
  
    // Group B
    Canada: "🇨🇦",
    Qatar: "🇶🇦",
    Switzerland: "🇨🇭",
  
    // Group C
    Brazil: "🇧🇷",
    Morocco: "🇲🇦",
    Haiti: "🇭🇹",
    Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  
    // Group D
    USA: "🇺🇸",
    Paraguay: "🇵🇾",
    Australia: "🇦🇺",
  
    // Group E
    Spain: "🇪🇸",
    Japan: "🇯🇵",
    "New Zealand": "🇳🇿",
  
    // Group F
    Portugal: "🇵🇹",
    Argentina: "🇦🇷",
    Indonesia: "🇮🇩",
  
    // Group G
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    Iran: "🇮🇷",
    Senegal: "🇸🇳",
  
    // Group H
    Germany: "🇩🇪",
    Belgium: "🇧🇪",
    "Saudi Arabia": "🇸🇦",
  
    // Group I
    Netherlands: "🇳🇱",
    France: "🇫🇷",
    Chile: "🇨🇱",
  
    // Group J
    Uruguay: "🇺🇾",
    Colombia: "🇨🇴",
    Slovenia: "🇸🇮",
  
    // Group K
    Ecuador: "🇪🇨",
    "Costa Rica": "🇨🇷",
    Nigeria: "🇳🇬",
  
    // Group L
    Turkey: "🇹🇷",
    "Côte d'Ivoire": "🇨🇮",
    "Ivory Coast": "🇨🇮",
  
    // Other confirmed/likely teams
    Serbia: "🇷🇸",
    Poland: "🇵🇱",
    Denmark: "🇩🇰",
    Croatia: "🇭🇷",
    Austria: "🇦🇹",
    Czech: "🇨🇿",
    Czechia: "🇨🇿",
    Ukraine: "🇺🇦",
    Romania: "🇷🇴",
    Hungary: "🇭🇺",
    Slovakia: "🇸🇰",
    Greece: "🇬🇷",
    "Bosnia and Herzegovina": "🇧🇦",
    Bosnia: "🇧🇦",
    Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    Sweden: "🇸🇪",
    Norway: "🇳🇴",
    Finland: "🇫🇮",
    Iceland: "🇮🇸",
    Russia: "🇷🇺",
    Egypt: "🇪🇬",
    Cameroon: "🇨🇲",
    Ghana: "🇬🇭",
    Tunisia: "🇹🇳",
    Algeria: "🇩🇿",
    Mali: "🇲🇱",
    Zambia: "🇿🇲",
    Kenya: "🇰🇪",
    Mozambique: "🇲🇿",
    Tanzania: "🇹🇿",
    Ethiopia: "🇪🇹",
    China: "🇨🇳",
    India: "🇮🇳",
    Thailand: "🇹🇭",
    Vietnam: "🇻🇳",
    Philippines: "🇵🇭",
    Malaysia: "🇲🇾",
    Singapore: "🇸🇬",
    "New Caledonia": "🇳🇨",
    Fiji: "🇫🇯",
    "Papua New Guinea": "🇵🇬",
    Jamaica: "🇯🇲",
    Trinidad: "🇹🇹",
    "Trinidad and Tobago": "🇹🇹",
    Honduras: "🇭🇳",
    Guatemala: "🇬🇹",
    Panama: "🇵🇦",
    Cuba: "🇨🇺",
    Venezuela: "🇻🇪",
    Peru: "🇵🇪",
    Bolivia: "🇧🇴",
    Bahrain: "🇧🇭",
    "United Arab Emirates": "🇦🇪",
    UAE: "🇦🇪",
    Kuwait: "🇰🇼",
    Iraq: "🇮🇶",
    Oman: "🇴🇲",
    Jordan: "🇯🇴",
    Palestine: "🇵🇸",
    Lebanon: "🇱🇧",
    Syria: "🇸🇾",
    Israel: "🇮🇱",
    "North Korea": "🇰🇵",
    Uzbekistan: "🇺🇿",
    Kazakhstan: "🇰🇿",
    Tonga: "🇹🇴",
    Samoa: "🇼🇸",
    Vanuatu: "🇻🇺",
  };
  
  export function getFlag(teamName: string): string {
    if (!teamName) return "🏳️";
    // Direct match
    if (countryFlags[teamName]) return countryFlags[teamName];
    // Partial match (e.g. "UEFA Path D winner" → no flag)
    const key = Object.keys(countryFlags).find((k) =>
      teamName.toLowerCase().includes(k.toLowerCase())
    );
    return key ? countryFlags[key] : "🏳️";
  }