import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { AuditLog, LocationSetting } from "@/app/lib/models";
import { requireAdmin } from "@/app/lib/admin-api";
import { wedding, type VenueLocation } from "@/config/wedding";

type LocationPayload = {
  church?: Partial<VenueLocation>;
  basselealHome?: Partial<VenueLocation>;
  bethelHome?: Partial<VenueLocation>;
  programTimes?: {
    churchEn?: string;
    churchAm?: string;
    homeEn?: string;
    homeAm?: string;
  };
};

function getMergedLocations(stored?: LocationPayload | null) {
  const def = wedding.locations;
  const defTimes = wedding.programTimes;

  const programTimes = {
    churchEn: stored?.programTimes?.churchEn?.trim() || stored?.church?.timeEn?.trim() || defTimes.churchEn,
    churchAm: stored?.programTimes?.churchAm?.trim() || stored?.church?.timeAm?.trim() || defTimes.churchAm,
    homeEn: stored?.programTimes?.homeEn?.trim() || stored?.basselealHome?.timeEn?.trim() || defTimes.homeEn,
    homeAm: stored?.programTimes?.homeAm?.trim() || stored?.basselealHome?.timeAm?.trim() || defTimes.homeAm,
  };

  return {
    programTimes,
    church: {
      label: stored?.church?.label?.trim() || def.church.label,
      labelAm: stored?.church?.labelAm?.trim() || def.church.labelAm,
      address: stored?.church?.address?.trim() || def.church.address,
      addressAm: stored?.church?.addressAm?.trim() || def.church.addressAm,
      mapsQuery: stored?.church?.mapsQuery?.trim() || def.church.mapsQuery,
      directionsUrl: stored?.church?.directionsUrl?.trim() || def.church.directionsUrl || "",
      note: stored?.church?.note?.trim() ?? def.church.note ?? "",
      noteAm: stored?.church?.noteAm?.trim() ?? def.church.noteAm ?? "",
      timeEn: programTimes.churchEn,
      timeAm: programTimes.churchAm,
    },
    basselealHome: {
      label: stored?.basselealHome?.label?.trim() || def.basselealHome.label,
      labelAm: stored?.basselealHome?.labelAm?.trim() || def.basselealHome.labelAm,
      address: stored?.basselealHome?.address?.trim() || def.basselealHome.address,
      addressAm: stored?.basselealHome?.addressAm?.trim() || def.basselealHome.addressAm,
      mapsQuery: stored?.basselealHome?.mapsQuery?.trim() || def.basselealHome.mapsQuery,
      directionsUrl: stored?.basselealHome?.directionsUrl?.trim() || def.basselealHome.directionsUrl || "",
      note: stored?.basselealHome?.note?.trim() ?? def.basselealHome.note ?? "",
      noteAm: stored?.basselealHome?.noteAm?.trim() ?? def.basselealHome.noteAm ?? "",
      timeEn: stored?.basselealHome?.timeEn?.trim() || programTimes.homeEn,
      timeAm: stored?.basselealHome?.timeAm?.trim() || programTimes.homeAm,
    },
    bethelHome: {
      label: stored?.bethelHome?.label?.trim() || def.bethelHome.label,
      labelAm: stored?.bethelHome?.labelAm?.trim() || def.bethelHome.labelAm,
      address: stored?.bethelHome?.address?.trim() || def.bethelHome.address,
      addressAm: stored?.bethelHome?.addressAm?.trim() || def.bethelHome.addressAm,
      mapsQuery: stored?.bethelHome?.mapsQuery?.trim() || def.bethelHome.mapsQuery,
      directionsUrl: stored?.bethelHome?.directionsUrl?.trim() || def.bethelHome.directionsUrl || "",
      note: stored?.bethelHome?.note?.trim() ?? def.bethelHome.note ?? "",
      noteAm: stored?.bethelHome?.noteAm?.trim() ?? def.bethelHome.noteAm ?? "",
      timeEn: stored?.bethelHome?.timeEn?.trim() || programTimes.homeEn,
      timeAm: stored?.bethelHome?.timeAm?.trim() || programTimes.homeAm,
    },
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    await connectMongo();
    const stored = await LocationSetting.findOne().sort({ updatedAt: -1 }).lean() as LocationPayload | null;
    const merged = getMergedLocations(stored);
    return NextResponse.json({ locations: merged, programTimes: merged.programTimes });
  } catch {
    // If DB is unavailable, return hardcoded defaults gracefully
    const merged = getMergedLocations(null);
    return NextResponse.json({ locations: merged, programTimes: merged.programTimes });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = (await request.json()) as LocationPayload;
    await connectMongo();

    const merged = getMergedLocations(body);
    const updated = await LocationSetting.findOneAndUpdate(
      {},
      { $set: merged },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await AuditLog.create({
      action: "LOCATIONS_UPDATED",
      actor: auth.email,
      targetId: String(updated._id),
    });

    return NextResponse.json({ ok: true, locations: merged });
  } catch {
    return NextResponse.json({ error: "Could not save locations." }, { status: 503 });
  }
}
