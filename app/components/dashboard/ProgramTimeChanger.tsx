"use client";

import { Icon } from "@/app/components/dashboard/Icon";

export type ProgramTimes = {
  churchEn: string;
  churchAm: string;
  homeEn: string;
  homeAm: string;
};

interface ProgramTimeChangerProps {
  programTimes: ProgramTimes;
  onChange: (updater: (prev: ProgramTimes) => ProgramTimes) => void;
  onSave?: () => void;
  saving?: boolean;
}

const CHURCH_PRESETS = [
  { label: "3:00 PM (9:00 ሰዓት)", en: "3:00 pm", am: "9:00 ሰዓት" },
  { label: "10:30 AM (4:30 ሰዓት)", en: "10:30 am", am: "4:30 ሰዓት" },
  { label: "9:00 AM (3:00 ሰዓት)", en: "9:00 am", am: "3:00 ሰዓት" },
  { label: "4:00 PM (10:00 ሰዓት)", en: "4:00 pm", am: "10:00 ሰዓት" },
];

const HOME_PRESETS = [
  { label: "10:30 AM (4:30 ሰዓት)", en: "10:30 am", am: "4:30 ሰዓት" },
  { label: "4:30 PM (10:30 ሰዓት)", en: "4:30 pm", am: "10:30 ሰዓት" },
  { label: "11:00 AM (5:00 ሰዓት)", en: "11:00 am", am: "5:00 ሰዓት" },
  { label: "2:00 PM (8:00 ሰዓት)", en: "2:00 pm", am: "8:00 ሰዓት" },
];

export function ProgramTimeChanger({
  programTimes,
  onChange,
  onSave,
  saving = false,
}: ProgramTimeChangerProps) {
  const setChurch = (en: string, am: string) => {
    onChange((prev) => ({ ...prev, churchEn: en, churchAm: am }));
  };

  const setHome = (en: string, am: string) => {
    onChange((prev) => ({ ...prev, homeEn: en, homeAm: am }));
  };

  return (
    <section className="rounded-2xl border border-[#D5CDC2] bg-gradient-to-b from-[#FDFCFB] to-white p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F0ECE6] pb-5">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#2B1810] text-[#FAF6F0] shadow-sm">
            <Icon name="clock" className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#1E140E]">Program Times & Schedule</h2>
              <span className="rounded-full bg-[#8C6A3B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B]">
                Live Guest Communication
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B6660] max-w-[68ch]">
              Change the official start times for Church and Home celebrations. Updates save to the database and communicate instantly to guest invitation cards, RSVP sections, and route directions.
            </p>
          </div>
        </div>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start sm:self-auto rounded-xl bg-[#2B1810] px-5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#402916] active:scale-[0.98] disabled:opacity-60 shrink-0"
          >
            <Icon name="check" className="h-4 w-4 text-[#E6C687]" />
            {saving ? "Saving Times..." : "Save Program Times"}
          </button>
        )}
      </div>

      {/* Grid: Church Time vs Home Time */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Church Program Time Box */}
        <div className="rounded-2xl border border-[#EDE8E1] bg-[#FAF8F5] p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#2B1810] text-[#E6C687]">
                <Icon name="church" className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B1810]">
                Church Ceremony Program
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#8C6A3B]">
              {programTimes.churchEn} / {programTimes.churchAm}
            </span>
          </div>

          {/* Quick Presets */}
          <div className="mt-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736C64]">
              Quick Presets:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {CHURCH_PRESETS.map((p) => {
                const isActive = programTimes.churchEn === p.en && programTimes.churchAm === p.am;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setChurch(p.en, p.am)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition active:scale-[0.97] ${
                      isActive
                        ? "bg-[#2B1810] text-white shadow-xs font-semibold"
                        : "bg-white border border-[#DDD6CC] text-[#554F48] hover:border-[#8C6A3B] hover:text-[#1E140E]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Time Inputs */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#554F48] mb-1">
                English Time Display:
              </label>
              <input
                type="text"
                value={programTimes.churchEn}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, churchEn: e.target.value }))
                }
                placeholder="e.g. 3:00 pm"
                className="w-full h-11 rounded-xl border border-[#D5CDC2] bg-white px-3.5 text-sm text-[#1E140E] outline-none transition focus:border-[#8C6A3B] focus:ring-2 focus:ring-[#8C6A3B]/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#554F48] mb-1">
                Amharic (Ethiopian LT):
              </label>
              <input
                type="text"
                value={programTimes.churchAm}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, churchAm: e.target.value }))
                }
                placeholder="e.g. 9:00 ሰዓት"
                className="w-full h-11 rounded-xl border border-[#D5CDC2] bg-white px-3.5 text-sm text-[#1E140E] outline-none transition focus:border-[#8C6A3B] focus:ring-2 focus:ring-[#8C6A3B]/20"
              />
            </div>
          </div>
        </div>

        {/* Home Reception Program Time Box */}
        <div className="rounded-2xl border border-[#EDE8E1] bg-[#FAF8F5] p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#2B1810] text-[#E6C687]">
                <Icon name="home" className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B1810]">
                Home Receptions Program
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#8C6A3B]">
              {programTimes.homeEn} / {programTimes.homeAm}
            </span>
          </div>

          {/* Quick Presets */}
          <div className="mt-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736C64]">
              Quick Presets:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {HOME_PRESETS.map((p) => {
                const isActive = programTimes.homeEn === p.en && programTimes.homeAm === p.am;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setHome(p.en, p.am)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition active:scale-[0.97] ${
                      isActive
                        ? "bg-[#2B1810] text-white shadow-xs font-semibold"
                        : "bg-white border border-[#DDD6CC] text-[#554F48] hover:border-[#8C6A3B] hover:text-[#1E140E]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Time Inputs */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#554F48] mb-1">
                English Time Display:
              </label>
              <input
                type="text"
                value={programTimes.homeEn}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, homeEn: e.target.value }))
                }
                placeholder="e.g. 10:30 am"
                className="w-full h-11 rounded-xl border border-[#D5CDC2] bg-white px-3.5 text-sm text-[#1E140E] outline-none transition focus:border-[#8C6A3B] focus:ring-2 focus:ring-[#8C6A3B]/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#554F48] mb-1">
                Amharic (Ethiopian LT):
              </label>
              <input
                type="text"
                value={programTimes.homeAm}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, homeAm: e.target.value }))
                }
                placeholder="e.g. 4:30 ሰዓት"
                className="w-full h-11 rounded-xl border border-[#D5CDC2] bg-white px-3.5 text-sm text-[#1E140E] outline-none transition focus:border-[#8C6A3B] focus:ring-2 focus:ring-[#8C6A3B]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Guest Communication Preview Bar */}
      <div className="mt-5 rounded-xl border border-[#E5DECE] bg-[#F7F3EC] p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E8E0D2] pb-2.5">
          <div className="flex items-center gap-2">
            <Icon name="megaphone" className="h-3.5 w-3.5 text-[#8C6A3B]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#634838]">
              Live Guest Communication Preview
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-[#7C5A32]">Church:</span>
            <span className="font-bold text-[#1E140E]">{programTimes.churchEn} ({programTimes.churchAm})</span>
            <span className="text-[#8C6A3B]">|</span>
            <span className="font-semibold text-[#7C5A32]">Home:</span>
            <span className="font-bold text-[#1E140E]">{programTimes.homeEn} ({programTimes.homeAm})</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-[#4A3527]">
          <div className="rounded-lg bg-white/80 p-2.5 border border-[#E8E1D5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B] block mb-1">
              English Invitation Statement:
            </span>
            <p className="italic">
              &ldquo;Together with our families, we warmly invite you to join us at Halwot Emmanuel United Church at <strong className="text-[#1E140E] font-bold underline decoration-[#8C6A3B]">{programTimes.churchEn}</strong> and home celebrations at <strong className="text-[#1E140E] font-bold underline decoration-[#8C6A3B]">{programTimes.homeEn}</strong> as we exchange our vows and begin our life together.&rdquo;
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-2.5 border border-[#E8E1D5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A3B] block mb-1">
              Amharic Invitation Statement:
            </span>
            <p>
              &ldquo;ከቤተሰቦቻችን ጋር በመሆን፣ ቃል ኪዳን የምንገባበትን የሰርግ ስነ-ስርዓት በሀልዎት አማኑኤል ህብረት ቤተክርስቲያን ከቀኑ <strong className="text-[#1E140E] font-bold underline decoration-[#8C6A3B]">{programTimes.churchAm}</strong>፣ በመቀጠልም በቤት አቀባበል ከጠዋቱ <strong className="text-[#1E140E] font-bold underline decoration-[#8C6A3B]">{programTimes.homeAm}</strong> ጀምሮ በሚደረገው ደማቅ ዝግጅት ላይ አብረውን እንዲያከብሩ በአክብሮትና በታላቅ ደስታ ጋብዘንዎታል።&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
