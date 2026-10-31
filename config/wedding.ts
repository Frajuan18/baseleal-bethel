/**
 * Wedding Configuration for Basseleal & Bethel
 * 
 * Central source of truth for all wedding celebration details, dates, venues,
 * contact information, and editorial imagery.
 * 
 * To update the wedding date or venue once finalized:
 * 1. Set `date` to an ISO date string, e.g. "2027-08-14"
 * 2. Set `time` to a 24-hr time string, e.g. "14:30"
 * 3. Set `venue`, `address`, and `directionsUrl`
 * 4. Set `rsvpDeadline`, e.g. "July 1, 2027"
 */

export interface VenueLocation {
  label: string;
  labelAm: string;
  address: string;
  addressAm: string;
  mapsQuery: string;
  directionsUrl?: string | null;
  note?: string;
  noteAm?: string;
}

export interface WeddingConfig {
  couple: {
    first: string;
    second: string;
    monogram: string;
    title: string;
    hashtag: string;
  };
  // ISO date string (YYYY-MM-DD) or null if not yet announced. e.g. "2027-08-14"
  date: string | null;
  // 24-hour local time (HH:mm) or null if not yet announced. e.g. "14:30"
  time: string | null;
  timeDisplay: string;
  venue: string;
  city: string;
  address: string;
  directionsUrl: string | null;
  rsvpDeadline: string | null; // e.g. "July 1, 2027" or null
  locations: {
    church: VenueLocation;
    basselealHome: VenueLocation;
    bethelHome: VenueLocation;
    home: VenueLocation;
  };
  schedule: {
    church: { start: string; end: string };
    home: { start: string; end: string };
  };
  scripture: {
    verse: string;
    reference: string;
  };
  invitationNote: {
    headline: string;
    subheadline: string;
    message: string;
  };
  images: {
    heroMain: string;
    heroSecondary: string;
    heroDetail: string;
    invitationCard: string;
    calendarAccent: string;
    galleryFirst: string;
    gallerySecond: string;
    galleryThird: string;
    rsvpBackdrop: string;
  };
}

export const wedding: WeddingConfig = {
  couple: {
    first: "Basseleal",
    second: "Bethel",
    monogram: "B & B",
    title: "Basseleal & Bethel",
    hashtag: "#BasselealAndBethel",
  },

  // Editable Date & Time:
  date: "2026-12-26",
  time: "10:00",
  timeDisplay: "10:00 AM",

  // Venue & Location placeholders:
  venue: "Halwot Emmanuel Church",
  city: "Addis Ababa, Ethiopia",
  address: "Halwot Emmanuel Church, Addis Ababa, Ethiopia",
  directionsUrl: null, // e.g. "https://maps.google.com/..."

  // RSVP deadline:
  rsvpDeadline: null, // e.g. "July 15, 2027"

  // Addresses shown on the personalized invitation.
  locations: {
    church: {
      label: "Halwot Emmanuel Church",
      labelAm: "ህልዎት አማኑኤል ቤተክርስቲያን",
      address: "Halwot Emmanuel Church, Addis Ababa, Ethiopia",
      addressAm: "ህልዎት አማኑኤል ቤተክርስቲያን፣ አዲስ አበባ፣ ኢትዮጵያ",
      mapsQuery: "Halwot Emmanuel Church, Addis Ababa, Ethiopia",
      directionsUrl: null,
      note: "Morning service begins at 9:00 AM (3:00 LT). Parking is available on church premises.",
      noteAm: "የጧቱ ስነ-ስርዓት ከጠዋቱ 3:00 (9:00 LT) ይጀምራል። በቤተክርስቲያኑ ግቢ ውስጥ ሰፊ የመኪና ማቆሚያ ተዘጋጅቷል።",
    },
    basselealHome: {
      label: "Basseleal's house",
      labelAm: "ባስልኤል ቤት",
      address: "Basseleal's house, Addis Ababa, Ethiopia",
      addressAm: "ባስልኤል ቤት፣ አዲስ አበባ፣ ኢትዮጵያ",
      mapsQuery: "Basseleal's house, Addis Ababa, Ethiopia",
      directionsUrl: null,
      note: "Afternoon reception begins at 4:30 PM (10:30 LT). Follow the wedding celebration signs upon arrival.",
      noteAm: "የከሰዓቱ የቤት ዝግጅት ከቀኑ 10:30 (4:30 LT) ጀምሮ ይካሄዳል። አካባቢው ሲደርሱ የሰርግ መመሪያ ምልክቶችን ይከተሉ።",
    },
    bethelHome: {
      label: "Bethel's house",
      labelAm: "ቤቴል ቤት",
      address: "Bethel's house, Addis Ababa, Ethiopia",
      addressAm: "ቤቴል ቤት፣ አዲስ አበባ፣ ኢትዮጵያ",
      mapsQuery: "Bethel's house, Addis Ababa, Ethiopia",
      directionsUrl: null,
      note: "Afternoon reception begins at 4:30 PM (10:30 LT). Follow the wedding celebration signs upon arrival.",
      noteAm: "የከሰዓቱ የቤት ዝግጅት ከቀኑ 10:30 (4:30 LT) ጀምሮ ይካሄዳል። አካባቢው ሲደርሱ የሰርግ መመሪያ ምልክቶችን ይከተሉ።",
    },
    get home() {
      return this.basselealHome;
    },
  },

  // Day schedule used by the calendar buttons (24-hr local time).
  schedule: {
    church: { start: "10:00", end: "12:30" },
    home: { start: "14:00", end: "17:00" },
  },

  // Scripture blessing:
  scripture: {
    verse: "“Love is patient, love is kind. It does not envy, it does not boast, it is not proud... It always protects, always trusts, always hopes, always perseveres. Love never fails.”",
    reference: "1 Corinthians 13:4, 7-8",
  },

  invitationNote: {
    headline: "A Sacred Covenant",
    subheadline: "Together with our families",
    message: "With grateful hearts and joy in Christ, we invite you to stand with us, pray over us, and celebrate the sacred covenant of our holy matrimony.",
  },

  // Curated high-resolution Unsplash editorial wedding photography
  images: {
    heroMain: "/couple.JPG",
    heroSecondary: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    heroDetail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    invitationCard: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    calendarAccent: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
    galleryFirst: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85",
    gallerySecond: "https://images.unsplash.com/photo-1545232979-fbf71fe97799?auto=format&fit=crop&w=1000&q=85",
    galleryThird: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=85",
    rsvpBackdrop: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=85",
  },
};

export const coupleName = `${wedding.couple.first} & ${wedding.couple.second}`;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export function formatWeddingDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const month = MONTH_NAMES[m - 1] ?? "";
  return `${month} ${d}, ${y}`;
}

export function formatFullWeddingDate(dateStr: string | null): string {
  if (!dateStr) return "Date to be announced";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const month = MONTH_NAMES[m - 1] ?? "";
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const weekday = WEEKDAY_NAMES[dt.getUTCDay()] ?? "";
  return `${weekday}, ${month} ${d}, ${y}`;
}

/** Weekday index for an ISO date, 0 = Sunday (computed in fixed UTC). */
export function weekdayIndex(dateStr: string): number {
  const parts = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
  return dt.getUTCDay();
}

// Ethiopian (Ge'ez) calendar month names — index 3 uses the common "ታህሳስ" spelling.
const ETHIOPIAN_MONTH_NAMES = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታህሳስ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን",
];

const ETHIOPIAN_EPOCH_JDN = 1723856;

function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToEthiopian(jdn: number) {
  const r = (jdn - ETHIOPIAN_EPOCH_JDN) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - ETHIOPIAN_EPOCH_JDN) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  daysInMonth: number;
}

/** Convert an ISO Gregorian date (YYYY-MM-DD) to the Ethiopian calendar. */
export function toEthiopian(dateStr: string | null): EthiopianDate | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some((value) => !Number.isFinite(value))) return null;
  const [year, month, day] = parts;
  const eth = jdnToEthiopian(gregorianToJdn(year, month, day));
  const daysInMonth = eth.month === 13 ? (eth.year % 4 === 3 ? 6 : 5) : 30;
  return { ...eth, monthName: ETHIOPIAN_MONTH_NAMES[eth.month - 1] ?? "", daysInMonth };
}
