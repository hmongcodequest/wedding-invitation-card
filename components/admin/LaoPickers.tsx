"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon, ClockIcon, ChevronDownIcon } from "@/components/icons";

/* ===== Lao calendar data ===== */

const LAO_WEEKDAYS_SHORT = ["ອາ", "ຈ", "ອ", "ພ", "ພຫ", "ສຸ", "ເສ"];
const LAO_MONTHS = [
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

/** Convert a Date to "YYYY-MM-DD" (local). */
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" to a local Date (or null). */
function parseISODate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/* ===== Lao Date Picker ===== */

interface LaoDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  id?: string;
}

export function LaoDatePicker({ value, onChange, id }: LaoDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const d = parseISODate(value) ?? new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = parseISODate(value) ?? new Date();
    return d.getMonth();
  });
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = parseISODate(value);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep the view in sync when the value changes externally.
  useEffect(() => {
    const d = parseISODate(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const displayText = selected
    ? `${selected.getDate()} ${LAO_MONTHS[selected.getMonth()]} ${selected.getFullYear()}`
    : "ເລືອກວັນທີ";

  return (
    <div className="lao-picker" ref={wrapRef}>
      <button
        type="button"
        id={id}
        className="admin-input lao-picker-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={selected ? `ວັນທີ: ${displayText}` : "ເລືອກວັນທີ"}
      >
        <CalendarIcon size={16} />
        <span className="lao-picker-value">{displayText}</span>
        <ChevronDownIcon size={14} />
      </button>

      {open && (
        <div className="lao-picker-popup" role="dialog" aria-label="ເລືອກວັນທີ">
          <div className="lao-calendar-header">
            <button
              type="button"
              className="lao-calendar-nav"
              onClick={prevMonth}
              aria-label="ເດືອນກ່ອນໜ້າ"
            >
              ‹
            </button>
            <div className="lao-calendar-title">
              {LAO_MONTHS[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              className="lao-calendar-nav"
              onClick={nextMonth}
              aria-label="ເດືອນຕໍ່ໄປ"
            >
              ›
            </button>
          </div>

          <div className="lao-calendar-weekdays">
            {LAO_WEEKDAYS_SHORT.map((w) => (
              <div key={w} className="lao-calendar-weekday">
                {w}
              </div>
            ))}
          </div>

          <div className="lao-calendar-grid">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} className="lao-calendar-empty" />;
              const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const isSelected = iso === value;
              const isToday = iso === toISODate(new Date());
              return (
                <button
                  key={iso}
                  type="button"
                  className={`lao-calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Lao Time Picker ===== */

interface LaoTimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  id?: string;
}

export function LaoTimePicker({ value, onChange, id }: LaoTimePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [hour, minute] = useMemo(() => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(value);
    if (m) return [Number(m[1]), Number(m[2])];
    return [12, 0];
  }, [value]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const commit = (h: number, min: number) => {
    onChange(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  };

  const displayText = value
    ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ໂມງ`
    : "ເລືອກເວລາ";

  return (
    <div className="lao-picker" ref={wrapRef}>
      <button
        type="button"
        id={id}
        className="admin-input lao-picker-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={value ? `ເວລາ: ${displayText}` : "ເລືອກເວລາ"}
      >
        <ClockIcon size={16} />
        <span className="lao-picker-value">{displayText}</span>
        <ChevronDownIcon size={14} />
      </button>

      {open && (
        <div className="lao-picker-popup lao-time-popup" role="dialog" aria-label="ເລືອກເວລາ">
          <div className="lao-time-title">ເລືອກເວລາ</div>
          <div className="lao-time-body">
            <div className="lao-time-col">
              <div className="lao-time-col-label">ຊົ່ວໂມງ</div>
              <div className="lao-time-scroll">
                {Array.from({ length: 24 }, (_, h) => (
                  <button
                    key={h}
                    type="button"
                    className={`lao-time-opt ${h === hour ? "selected" : ""}`}
                    onClick={() => commit(h, minute)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div className="lao-time-col">
              <div className="lao-time-col-label">ນາທີ</div>
              <div className="lao-time-scroll">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((min) => (
                  <button
                    key={min}
                    type="button"
                    className={`lao-time-opt ${min === minute ? "selected" : ""}`}
                    onClick={() => commit(hour, min)}
                  >
                    {min}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}