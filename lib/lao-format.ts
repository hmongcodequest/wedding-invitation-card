/**
 * Lao date & time formatting helpers.
 *
 * Converts ISO dates ("2026-09-14") and times ("11:30") into Lao-language
 * strings with international (Arabic) numerals, weekday and month names, and
 * the Buddhist era (ພ.ສ.) alongside the Christian era (ຄ.ສ.). Legacy Lao
 * strings (e.g. "ວັນທີ່ 14 ເດືອນ 9 ປີ 2026") are parsed too, so old data
 * keeps working until it is re-saved from the admin form.
 */

const WEEKDAYS = [
  "ວັນອາທິດ",
  "ວັນຈັນ",
  "ວັນອັງຄານ",
  "ວັນພຸດ",
  "ວັນພະຫັດ",
  "ວັນສຸກ",
  "ວັນເສົາ",
];

const MONTHS = [
  "ມັງກອນ",
  "ກຸມພາ",
  "ມີນາ",
  "ເມສາ",
  "ພຶດສະພາ",
  "ມິຖຸນາ",
  "ກໍລະກົດ",
  "ສິງຫາ",
  "ກັນຍາ",
  "ຕຸລາ",
  "ພະຈິກ",
  "ທັນວາ",
];

export interface LaoDateParts {
  /** Lao weekday name, e.g. "ວັນອາທິດ" */
  weekday: string;
  /** Day, e.g. "14" */
  day: string;
  /** Lao month name, e.g. "ກັນຍາ" */
  month: string;
  /** Christian era year, e.g. "2026" */
  yearCE: string;
  /** Buddhist era year, e.g. "2569" */
  yearBE: string;
}

/**
 * Parse a date string into Lao parts. Accepts ISO "YYYY-MM-DD" and the
 * legacy Lao format "ວັນທີ່ 14 ເດືອນ 9 ປີ 2026". Returns null when the
 * string cannot be parsed (caller falls back to showing it as-is).
 */
export function formatLaoDate(dateStr: string): LaoDateParts | null {
  const trimmed = dateStr.trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const d = new Date(year, month - 1, day);
      if (!Number.isNaN(d.getTime())) {
        return {
          weekday: WEEKDAYS[d.getDay()],
          day: String(day),
          month: MONTHS[month - 1],
          yearCE: String(year),
          yearBE: String(year + 543),
        };
      }
    }
  }
  // Legacy Lao: "ວັນທີ່ 14 ເດືອນ 9 ປີ 2026"
  const legacy = /ວັນທີ່\s+(\d{1,2})\s+ເດືອນ\s+(\d{1,2})\s+ປີ\s+(\d{4})/.exec(
    trimmed
  );
  if (legacy) {
    const year = Number(legacy[3]);
    const month = Number(legacy[2]);
    const day = Number(legacy[1]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const d = new Date(year, month - 1, day);
      if (!Number.isNaN(d.getTime())) {
        return {
          weekday: WEEKDAYS[d.getDay()],
          day: String(day),
          month: MONTHS[month - 1],
          yearCE: String(year),
          yearBE: String(year + 543),
        };
      }
    }
  }
  return null;
}

/**
 * Format a time string ("HH:MM") in Lao, e.g. "11:30" → "11:30 ໂມງ".
 * Non-ISO strings (e.g. legacy Lao text) are returned trimmed as-is.
 */
export function formatLaoTime(timeStr: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
  if (m) {
    return `${m[1]}:${m[2]} ໂມງ`;
  }
  return timeStr.trim();
}

/**
 * Compact Lao date for info cards / lists:
 * "ວັນອາທິດ ທີ່ 14 ກັນຍາ ພ.ສ. 2569". Falls back to the raw string.
 */
export function formatLaoDateShort(dateStr: string): string {
  const parts = formatLaoDate(dateStr);
  if (!parts) return dateStr;
  return `${parts.weekday} ທີ່ ${parts.day} ${parts.month} ພ.ສ. ${parts.yearBE}`;
}