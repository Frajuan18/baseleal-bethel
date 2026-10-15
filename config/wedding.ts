/**
 * Wedding Configuration for Baseleal & Bethel
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
    first: "Baseleal",
    second: "Bethel",
    monogram: "B & B",
    title: "Baseleal & Bethel",
    hashtag: "#BaselealAndBethel",
  },

  // Editable Date & Time placeholders:
  // To activate the countdown & calendar for a specific date, set:
  // date: "2027-08-14",
  // time: "14:30",
  date: null,
  time: null,
  timeDisplay: "Time to be announced",

  // Venue & Location placeholders:
  venue: "Ceremony Venue to be Announced",
  city: "Addis Ababa, Ethiopia",
  address: "Venue details and formal guest passes will be shared with invited guests.",
  directionsUrl: null, // e.g. "https://maps.google.com/..."

  // RSVP deadline:
  rsvpDeadline: null, // e.g. "July 15, 2027"

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
  // Easily replaceable with actual portraits of Baseleal and Bethel later:
  images: {
    // Primary couple portrait
    heroMain: "/couple.JPG",
    // Secondary intimate portrait
    heroSecondary: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    // Fine floral styling & ceremony detail
    heroDetail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    // Fine-art stationery & rings
    invitationCard: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    // Romantic walk in golden light
    calendarAccent: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
    // Editorial gallery moments
    galleryFirst: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85",
    gallerySecond: "https://images.unsplash.com/photo-1545232979-fbf71fe97799?auto=format&fit=crop&w=1000&q=85",
    galleryThird: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=85",
    // Evening candlelight atmosphere
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
  // Deterministic weekday calculation (Zeller's or Date in fixed UTC)
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const weekday = WEEKDAY_NAMES[dt.getUTCDay()] ?? "";
  return `${weekday}, ${month} ${d}, ${y}`;
}
