"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWedding, updateWedding } from "@/app/admin/actions";
import type { WeddingFormInput } from "@/app/admin/actions";
import { TEMPLATES } from "@/lib/templates";
import { formatLaoDateShort, formatLaoTime } from "@/lib/lao-format";
import { LaoDatePicker, LaoTimePicker } from "./LaoPickers";
import {
  BrideIcon,
  GroomIcon,
  CalendarIcon,
  PaletteIcon,
  ClockIcon,
  PlusIcon,
  SaveIcon,
  SpinnerIcon,
  XIcon,
  TrashIcon,
  FileIcon,
} from "@/components/icons";

interface ScheduleRow {
  time: string;
  description: string;
}

interface WeddingFormProps {
  mode: "create" | "edit";
  weddingId?: number;
  initial?: {
    bride_title: string;
    bride_first_name: string;
    bride_last_name: string;
    groom_title: string;
    groom_first_name: string;
    groom_last_name: string;
    location: string;
    date: string;
    time: string;
    template: string;
  };
  initialSchedule?: ScheduleRow[];
}

const EMPTY_SCHEDULE: ScheduleRow[] = [
  { time: "", description: "" },
  { time: "", description: "" },
  { time: "", description: "" },
  { time: "", description: "" },
];

export default function WeddingForm({
  mode,
  weddingId,
  initial,
  initialSchedule,
}: WeddingFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [brideTitle, setBrideTitle] = useState(initial?.bride_title ?? "");
  const [brideFirst, setBrideFirst] = useState(initial?.bride_first_name ?? "");
  const [brideLast, setBrideLast] = useState(initial?.bride_last_name ?? "");
  const [groomTitle, setGroomTitle] = useState(initial?.groom_title ?? "");
  const [groomFirst, setGroomFirst] = useState(initial?.groom_first_name ?? "");
  const [groomLast, setGroomLast] = useState(initial?.groom_last_name ?? "");
  const [bridePhoto, setBridePhoto] = useState<string | null>(null);
  const [groomPhoto, setGroomPhoto] = useState<string | null>(null);
  const [bridePhotoPreview, setBridePhotoPreview] = useState<string | null>(null);
  const [groomPhotoPreview, setGroomPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState(initial?.location ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [template, setTemplate] = useState(initial?.template ?? "classic-gold");
  const [schedule, setSchedule] = useState<ScheduleRow[]>(
    initialSchedule && initialSchedule.length > 0
      ? initialSchedule
      : EMPTY_SCHEDULE
  );

  const updateSchedule = (i: number, field: keyof ScheduleRow, value: string) => {
    setSchedule((rows) =>
      rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );
  };

  const addScheduleRow = () => {
    setSchedule((rows) => [...rows, { time: "", description: "" }]);
  };

  const removeScheduleRow = (i: number) => {
    setSchedule((rows) => rows.filter((_, idx) => idx !== i));
  };

  const handleBridePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !weddingId) return;
    
    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setBridePhotoPreview(previewUrl);
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("weddingId", String(weddingId));
      formData.append("type", "bride");
      
      const res = await fetch("/api/photos", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setBridePhoto(data.path);
        setBridePhotoPreview(null); // Clear preview after successful upload
      } else {
        const error = await res.json();
        setError(error.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload photo");
    } finally {
      setSaving(false);
    }
  };

  const handleGroomPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !weddingId) return;
    
    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setGroomPhotoPreview(previewUrl);
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("weddingId", String(weddingId));
      formData.append("type", "groom");
      
      const res = await fetch("/api/photos", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setGroomPhoto(data.path);
        setGroomPhotoPreview(null); // Clear preview after successful upload
      } else {
        const error = await res.json();
        setError(error.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload photo");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const input: WeddingFormInput = {
        bride_title: brideTitle,
        bride_first_name: brideFirst,
        bride_last_name: brideLast,
        groom_title: groomTitle,
        groom_first_name: groomFirst,
        groom_last_name: groomLast,
        location,
        date,
        time,
        template,
        schedule,
        bride_photo_path: bridePhoto,
        groom_photo_path: groomPhoto,
      };
      if (mode === "create") {
        const res = await createWedding(input);
        if (res?.error) setError(res.error);
      } else {
        const res = await updateWedding(weddingId!, input);
        if (res?.error) setError(res.error);
        else router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      {error && <div className="admin-form-error">{error}</div>}

      <div className="admin-card-title">
        <BrideIcon size={18} /> ຂໍ້ມູນເຈົ້າສາວ
      </div>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="brideTitle">ຄຳນຳໜ້າ</label>
          <input
            id="brideTitle"
            className="admin-input"
            value={brideTitle}
            onChange={(e) => setBrideTitle(e.target.value)}
            placeholder="ທ່ານນາງ"
          />
        </div>
        <div className="admin-field">
          <label htmlFor="brideFirst">ຊື່</label>
          <input
            id="brideFirst"
            className="admin-input"
            value={brideFirst}
            onChange={(e) => setBrideFirst(e.target.value)}
            placeholder="ຊື່ເຈົ້າສາວ"
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="brideLast">ນາມສະກຸນ</label>
          <input
            id="brideLast"
            className="admin-input"
            value={brideLast}
            onChange={(e) => setBrideLast(e.target.value)}
            placeholder="ນາມສະກຸນ"
          />
        </div>
      </div>

      <div className="admin-card-title" style={{ marginTop: 20 }}>
        <GroomIcon size={18} /> ຂໍ້ມູນເຈົ້າບ່າວ
      </div>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="groomTitle">ຄຳນຳໜ້າ</label>
          <input
            id="groomTitle"
            className="admin-input"
            value={groomTitle}
            onChange={(e) => setGroomTitle(e.target.value)}
            placeholder="ທ້າວ"
          />
        </div>
        <div className="admin-field">
          <label htmlFor="groomFirst">ຊື່</label>
          <input
            id="groomFirst"
            className="admin-input"
            value={groomFirst}
            onChange={(e) => setGroomFirst(e.target.value)}
            placeholder="ຊື່ເຈົ້າບ່າວ"
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="groomLast">ນາມສະກຸນ</label>
          <input
            id="groomLast"
            className="admin-input"
            value={groomLast}
            onChange={(e) => setGroomLast(e.target.value)}
            placeholder="ນາມສະກຸນ"
          />
        </div>
      </div>

      <div className="admin-card-title" style={{ marginTop: 20 }}>
        <FileIcon size={18} /> ຮູບພາບຄູ່ບ່າວສາວ
      </div>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="bridePhoto">ຮູບຂອງເຈົ້າສາວ</label>
          <div className="admin-photo-upload">
            {bridePhoto ? (
              <div className="admin-photo-preview">
                <img
                  src={`/uploads/weddings/${weddingId}-${bridePhoto}`}
                  alt="ຮູບເຈົ້າສາວ"
                  className="admin-photo-img"
                />
                <button
                  type="button"
                  className="admin-photo-remove"
                  onClick={() => setBridePhoto(null)}
                  aria-label="ລຶບຮູບ"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ) : bridePhotoPreview ? (
              <div className="admin-photo-preview">
                <img
                  src={bridePhotoPreview}
                  alt="ຮູບເຈົ້າສາວ (ພີວ)"
                  className="admin-photo-img"
                />
                <button
                  type="button"
                  className="admin-photo-remove"
                  onClick={() => {
                    setBridePhotoPreview(null);
                    // Reset file input
                    const input = document.getElementById('bridePhoto') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  aria-label="ຍົກເລີກ"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <label htmlFor="bridePhoto" className="admin-photo-label-wrapper">
                <span className="admin-photo-label">ເລືອກຮູບພາບຄູ່ບ່າວສາວ</span>
                <input
                  id="bridePhoto"
                  type="file"
                  accept="image/*"
                  className="admin-photo-input"
                  onChange={handleBridePhotoChange}
                  disabled={saving}
                />
              </label>
            )}
            <p className="admin-photo-help">ຈາກ 200KB - 5MB (JPG, PNG)</p>
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="groomPhoto">ຮູບຂອງເຈົ້າບ່າວ</label>
          <div className="admin-photo-upload">
            {groomPhoto ? (
              <div className="admin-photo-preview">
                <img
                  src={`/uploads/weddings/${weddingId}-${groomPhoto}`}
                  alt="ຮູບເຈົ້າບ່າວ"
                  className="admin-photo-img"
                />
                <button
                  type="button"
                  className="admin-photo-remove"
                  onClick={() => setGroomPhoto(null)}
                  aria-label="ລຶບຮູບ"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ) : groomPhotoPreview ? (
              <div className="admin-photo-preview">
                <img
                  src={groomPhotoPreview}
                  alt="ຮູບເຈົ້າບ່າວ (ພີວ)"
                  className="admin-photo-img"
                />
                <button
                  type="button"
                  className="admin-photo-remove"
                  onClick={() => {
                    setGroomPhotoPreview(null);
                    // Reset file input
                    const input = document.getElementById('groomPhoto') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  aria-label="ຍົກເລີກ"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <label htmlFor="groomPhoto" className="admin-photo-label-wrapper">
                <span className="admin-photo-label">ເລືອກຮູບພາບຄູ່ບ່າວ</span>
                <input
                  id="groomPhoto"
                  type="file"
                  accept="image/*"
                  className="admin-photo-input"
                  onChange={handleGroomPhotoChange}
                  disabled={saving}
                />
              </label>
            )}
            <p className="admin-photo-help">ຈາກ 200KB - 5MB (JPG, PNG)</p>
          </div>
        </div>
      </div>

      <div className="admin-card-title" style={{ marginTop: 20 }}>
        <CalendarIcon size={18} /> ງານແຕ່ງງານ
      </div>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="date">ວັນທີ</label>
          <LaoDatePicker id="date" value={date} onChange={setDate} />
          {date && (
            <div className="admin-lao-preview">
              {formatLaoDateShort(date)}
            </div>
          )}
        </div>
        <div className="admin-field">
          <label htmlFor="time">ເວລາ</label>
          <LaoTimePicker id="time" value={time} onChange={setTime} />
          {time && (
            <div className="admin-lao-preview">{formatLaoTime(time)}</div>
          )}
        </div>
        <div className="admin-field">
          <label htmlFor="location">ສະຖານທີ່</label>
          <input
            id="location"
            className="admin-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ຊື່ສະຖານທີ່ຈັດງານ"
          />
        </div>
      </div>

      <div className="admin-card-title" style={{ marginTop: 20 }}>
        <PaletteIcon size={18} /> ແບບບັດເຊີນ
      </div>
      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className={`template-card ${template === t.id ? "selected" : ""}`}
            onClick={() => setTemplate(t.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setTemplate(t.id);
            }}
          >
            <div className="template-swatches">
              {[t.colors.gold, t.colors.cream, t.colors.ink, t.colors.rose].map(
                (c) => (
                  <span
                    key={c}
                    className="template-swatch"
                    style={{ background: c }}
                  />
                )
              )}
            </div>
            <div className="template-variant">{t.variant}</div>
            <div className="template-name">{t.name}</div>
            <div className="template-desc">{t.description}</div>
          </div>
        ))}
      </div>

      <div className="admin-card-title" style={{ marginTop: 20 }}>
        <ClockIcon size={18} /> ກຳນົດການງານ
      </div>
      {schedule.map((row, i) => (
        <div className="schedule-row" key={i}>
          <input
            className="admin-input"
            type="time"
            value={row.time}
            onChange={(e) => updateSchedule(i, "time", e.target.value)}
            aria-label={`ເວລາລາຍການທີ່ ${i + 1}`}
          />
          <input
            className="admin-input"
            value={row.description}
            onChange={(e) => updateSchedule(i, "description", e.target.value)}
            placeholder={`ລາຍການທີ່ ${i + 1} (ເຊັ່ນ: ພິທີຕັກບາດ)`}
            aria-label={`ລາຍລະອຽດລາຍການທີ່ ${i + 1}`}
          />
          <button
            type="button"
            className="schedule-remove-btn"
            onClick={() => removeScheduleRow(i)}
            aria-label={`ລຶບລາຍການທີ່ ${i + 1}`}
            title="ລຶບລາຍການ"
          >
            <XIcon size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn-secondary admin-btn-sm"
        onClick={addScheduleRow}
      >
        <PlusIcon size={15} /> ເພີ່ມລາຍການ
      </button>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? <SpinnerIcon size={18} /> : <SaveIcon size={18} />}
          {saving
            ? "ກຳລັງບັນທຶກ..."
            : mode === "create"
              ? "ສ້າງບັດເຊີນ"
              : "ບັນທຶກການແກ້ໄຂ"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => router.back()}
        >
          ຍົກເລີກ
        </button>
      </div>
    </form>
  );
}