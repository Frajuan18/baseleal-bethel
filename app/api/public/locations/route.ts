import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { LocationSetting } from "@/app/lib/models";
import { wedding, type VenueLocation } from "@/config/wedding";

type LocationPayload = {
  church?: Partial<VenueLocation>;
  basselealHome?: Partial<VenueLocation>;
  bethelHome?: Partial<VenueLocation>;
};

function getMergedLocations(stored?: LocationPayload | null) {
  const def = wedding.locations;
  return {
    church: {
      label: stored?.church?.label?.trim() || def.church.label,
      labelAm: stored?.church?.labelAm?.trim() || def.church.labelAm,
      address: stored?.church?.address?.trim() || def.church.address,
      addressAm: stored?.church?.addressAm?.trim() || def.church.addressAm,
      mapsQuery: stored?.church?.mapsQuery?.trim() || def.church.mapsQuery,
      directionsUrl: stored?.church?.directionsUrl?.trim() || def.church.directionsUrl || "",
    },
    basselealHome: {
      label: stored?.basselealHome?.label?.trim() || def.basselealHome.label,
      labelAm: stored?.basselealHome?.labelAm?.trim() || def.basselealHome.labelAm,
      address: stored?.basselealHome?.address?.trim() || def.basselealHome.address,
      addressAm: stored?.basselealHome?.addressAm?.trim() || def.basselealHome.addressAm,
      mapsQuery: stored?.basselealHome?.mapsQuery?.trim() || def.basselealHome.mapsQuery,
      directionsUrl: stored?.basselealHome?.directionsUrl?.trim() || def.basselealHome.directionsUrl || "",
    },
    bethelHome: {
      label: stored?.bethelHome?.label?.trim() || def.bethelHome.label,
      labelAm: stored?.bethelHome?.labelAm?.trim() || def.bethelHome.labelAm,
      address: stored?.bethelHome?.address?.trim() || def.bethelHome.address,
      addressAm: stored?.bethelHome?.addressAm?.trim() || def.bethelHome.addressAm,
      mapsQuery: stored?.bethelHome?.mapsQuery?.trim() || def.bethelHome.mapsQuery,
      directionsUrl: stored?.bethelHome?.directionsUrl?.trim() || def.bethelHome.directionsUrl || "",
    },
  };
}

export async function GET() {
  try {
    await connectMongo();
    const stored = (await LocationSetting.findOne().sort({ updatedAt: -1 }).lean()) as LocationPayload | null;
    return NextResponse.json({ locations: getMergedLocations(stored) });
  } catch {
    return NextResponse.json({ locations: getMergedLocations(null) });
  }
}
