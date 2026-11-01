export type VenueSelection = {
  church: boolean;
  basseleal: boolean;
  bethel: boolean;
};

export const VALID_INVITATION_TYPES = [
  "CHURCH_ONLY",
  "CHURCH_AND_HOME",
  "CHURCH_AND_BASSELEAL",
  "CHURCH_AND_BETHEL",
  "CHURCH_AND_BOTH",
  "BASSELEAL_ONLY",
  "BETHEL_ONLY",
  "BASSELEAL_AND_BETHEL",
] as const;

export function parseInvitationVenues(type?: string): VenueSelection {
  if (!type) {
    return { church: true, basseleal: true, bethel: true };
  }
  switch (type) {
    case "CHURCH_ONLY":
      return { church: true, basseleal: false, bethel: false };
    case "BASSELEAL_ONLY":
      return { church: false, basseleal: true, bethel: false };
    case "BETHEL_ONLY":
      return { church: false, basseleal: false, bethel: true };
    case "CHURCH_AND_BASSELEAL":
      return { church: true, basseleal: true, bethel: false };
    case "CHURCH_AND_BETHEL":
      return { church: true, basseleal: false, bethel: true };
    case "BASSELEAL_AND_BETHEL":
      return { church: false, basseleal: true, bethel: true };
    case "CHURCH_AND_BOTH":
    case "CHURCH_AND_HOME":
      return { church: true, basseleal: true, bethel: true };
    default: {
      const c = type.includes("CHURCH");
      const ba = type.includes("BASSELEAL") || type.includes("HOME") || type.includes("BOTH");
      const be = type.includes("BETHEL") || type.includes("HOME") || type.includes("BOTH");
      return { church: c || (!ba && !be), basseleal: ba, bethel: be };
    }
  }
}

export function venuesToInvitationType(venues: VenueSelection): string {
  if (venues.church && venues.basseleal && venues.bethel) return "CHURCH_AND_BOTH";
  if (venues.church && venues.basseleal && !venues.bethel) return "CHURCH_AND_BASSELEAL";
  if (venues.church && !venues.basseleal && venues.bethel) return "CHURCH_AND_BETHEL";
  if (venues.church && !venues.basseleal && !venues.bethel) return "CHURCH_ONLY";
  if (!venues.church && venues.basseleal && venues.bethel) return "BASSELEAL_AND_BETHEL";
  if (!venues.church && venues.basseleal && !venues.bethel) return "BASSELEAL_ONLY";
  if (!venues.church && !venues.basseleal && venues.bethel) return "BETHEL_ONLY";
  return "CHURCH_ONLY";
}

export function getInvitationTypeLabel(type?: string, isAmharic = false): string {
  const v = parseInvitationVenues(type);
  const labels: string[] = [];
  if (v.church) labels.push(isAmharic ? "ቤተክርስቲያን" : "Church");
  if (v.basseleal) labels.push(isAmharic ? "የባስልኤል ቤት" : "Basseleal's house");
  if (v.bethel) labels.push(isAmharic ? "የቤቴል ቤት" : "Bethel's house");
  return labels.length > 0 ? labels.join(" + ") : (isAmharic ? "ጥሪ" : "Church");
}
