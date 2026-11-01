/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, type Model } from "mongoose";

export type InvitationType =
  | "CHURCH_ONLY"
  | "CHURCH_AND_HOME"
  | "CHURCH_AND_BASSELEAL"
  | "CHURCH_AND_BETHEL"
  | "CHURCH_AND_BOTH"
  | "BASSELEAL_ONLY"
  | "BETHEL_ONLY"
  | "BASSELEAL_AND_BETHEL"
  | string;

export type AttendanceStatus = "ATTENDING" | "NOT_ATTENDING" | "PENDING";

const guestSchema = new Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, trim: true, lowercase: true, maxlength: 180 },
  phone: { type: String, trim: true, maxlength: 40 },
}, { timestamps: true });

const invitationSchema = new Schema({
  guestId: { type: Schema.Types.ObjectId, ref: "Guest", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  shareUrl: { type: String, maxlength: 200 },
  invitationType: {
    type: String,
    enum: [
      "CHURCH_ONLY",
      "CHURCH_AND_HOME",
      "CHURCH_AND_BASSELEAL",
      "CHURCH_AND_BETHEL",
      "CHURCH_AND_BOTH",
      "BASSELEAL_ONLY",
      "BETHEL_ONLY",
      "BASSELEAL_AND_BETHEL",
    ],
    required: true,
  },
  status: { type: String, enum: ["ACTIVE", "REVOKED", "EXPIRED"], default: "ACTIVE", index: true },
  expiresAt: { type: Date },
  note: { type: String, maxlength: 500 },
}, { timestamps: true });

const rsvpSchema = new Schema({
  guestId: { type: Schema.Types.ObjectId, ref: "Guest", required: true, index: true },
  invitationId: { type: Schema.Types.ObjectId, ref: "Invitation", index: true },
  attendanceStatus: { type: String, enum: ["ATTENDING", "NOT_ATTENDING", "PENDING"], required: true, index: true },
  attendeeCount: { type: Number, min: 0, max: 20, default: 0 },
  churchAttendance: { type: Boolean },
  homeAttendance: { type: Boolean },
  wish: { type: String, maxlength: 2000 },
}, { timestamps: true });
rsvpSchema.index({ guestId: 1, invitationId: 1 }, { unique: true });

const wishSchema = new Schema({
  guestId: { type: Schema.Types.ObjectId, ref: "Guest", index: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  source: { type: String, enum: ["GUESTBOOK", "RSVP"], default: "GUESTBOOK", index: true },
}, { timestamps: true });

const auditSchema = new Schema({
  action: { type: String, required: true, maxlength: 80 },
  actor: { type: String, required: true, maxlength: 180 },
  targetId: { type: String, maxlength: 80 },
}, { timestamps: true });

const venueLocationSchema = new Schema({
  label: { type: String, default: "" },
  labelAm: { type: String, default: "" },
  address: { type: String, default: "" },
  addressAm: { type: String, default: "" },
  mapsQuery: { type: String, default: "" },
  directionsUrl: { type: String, default: "" },
  note: { type: String, default: "" },
  noteAm: { type: String, default: "" },
  timeEn: { type: String, default: "" },
  timeAm: { type: String, default: "" },
}, { _id: false });

const locationSettingSchema = new Schema({
  church: { type: venueLocationSchema, default: () => ({}) },
  basselealHome: { type: venueLocationSchema, default: () => ({}) },
  bethelHome: { type: venueLocationSchema, default: () => ({}) },
  programTimes: {
    churchEn: { type: String, default: "3:00 pm" },
    churchAm: { type: String, default: "9:00 ሰዓት" },
    homeEn: { type: String, default: "10:30 am" },
    homeAm: { type: String, default: "4:30 ሰዓት" },
  },
}, { timestamps: true });

export const Guest = (mongoose.models.Guest || mongoose.model("Guest", guestSchema)) as Model<any>;
export const Invitation = (mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema)) as Model<any>;
export const RSVP = (mongoose.models.RSVP || mongoose.model("RSVP", rsvpSchema)) as Model<any>;
export const GuestWish = (mongoose.models.GuestWish || mongoose.model("GuestWish", wishSchema)) as Model<any>;
export const AuditLog = (mongoose.models.AuditLog || mongoose.model("AuditLog", auditSchema)) as Model<any>;
export const LocationSetting = (mongoose.models.LocationSetting || mongoose.model("LocationSetting", locationSettingSchema)) as Model<any>;
