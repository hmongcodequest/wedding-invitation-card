"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES, getTemplate, type TemplateColors } from "@/lib/templates";
import { updateDesign, resetDesign } from "@/app/admin/actions";
import type { Guest, ScheduleItem, WeddingInfo } from "@/lib/data";
import InvitationCard from "@/components/card/InvitationCard";
import {
  PaletteIcon,
  BrushIcon,
  SaveIcon,
  SpinnerIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
} from "@/components/icons";

interface DesignEditorProps {
  wedding: WeddingInfo;
  schedule: ScheduleItem[];
  initialTemplate: string;
  initialColors: Partial<TemplateColors>;
}

const COLOR_KEYS: Array<{ key: keyof TemplateColors; label: string }> = [
  { key: "gold", label: "ສີທອງ" },
  { key: "goldLight", label: "ສີທອງອ່ອນ" },
  { key: "goldDark", label: "ສີທອງເຂັ້ມ" },
  { key: "cream", label: "ສີຄຣີມ" },
  { key: "creamDark", label: "ສີຄຣີມເຂັ້ມ" },
  { key: "ink", label: "ສີຕົວໜັງສື" },
  { key: "inkLight", label: "ສີຕົວໜັງສືອ່ອນ" },
  { key: "rose", label: "ສີກຸຫຼາບ" },
  { key: "roseLight", label: "ສີກຸຫຼາບອ່ອນ" },
  { key: "white", label: "ສີຂາວ" },
];

export default function DesignEditor({
  wedding,
  schedule,
  initialTemplate,
  initialColors,
}: DesignEditorProps) {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate);
  const [colors, setColors] = useState<Partial<TemplateColors>>(initialColors);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Effective palette for the live preview.
  const base = getTemplate(template).colors;
  const effective: TemplateColors = { ...base, ...colors };

  const previewWedding: WeddingInfo = {
    ...wedding,
    template,
    design: JSON.stringify({ colors }),
  };

  const setColor = (key: keyof TemplateColors, value: string) => {
    setColors((c) => ({ ...c, [key]: value }));
  };

  const resetToTemplate = () => {
    setColors({});
    setMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await updateDesign(wedding.id, template, colors);
      if (res?.error) setMessage(`ເກີດຂໍ້ຜິດພາດ: ${res.error}`);
      else {
        setMessage("ບັນທຶກການອອກແບບສຳເລັດ");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setMessage("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const ok = window.confirm(
      "ລຶບການປັບສີທັງໝົດ ແລະ ກັບໄປໃຊ້ສີຕາມ template ບໍ?"
    );
    if (!ok) return;
    setSaving(true);
    try {
      await resetDesign(wedding.id);
      setTemplate(initialTemplate);
      setColors({});
      setMessage("ຣີເຊັດການອອກແບບສຳເລັດ");
      router.refresh();
    } catch (err) {
      console.error(err);
      setMessage("ເກີດຂໍ້ຜິດພາດ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-title">
          <PaletteIcon size={18} /> ເລືອກແບບບັດ (Template)
        </div>
        <div className="template-grid">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className={`template-card ${template === t.id ? "selected" : ""}`}
              onClick={() => {
                setTemplate(t.id);
                setColors({});
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setTemplate(t.id);
                  setColors({});
                }
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

        <div className="admin-card-title">
          <BrushIcon size={18} /> ປັບສີເອງ (ບໍ່ບັງຄັບ)
        </div>
        <div className="color-grid">
          {COLOR_KEYS.map(({ key, label }) => (
            <div className="color-field" key={key}>
              <input
                type="color"
                value={effective[key]}
                onChange={(e) => setColor(key, e.target.value)}
                aria-label={label}
              />
              <span className="color-name">{label}</span>
              <span className="color-hex">{effective[key]}</span>
            </div>
          ))}
        </div>
        <div className="admin-form-actions">
          <button
            className="admin-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <SpinnerIcon size={18} /> : <SaveIcon size={18} />}
            {saving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກການອອກແບບ"}
          </button>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={resetToTemplate}
            disabled={saving}
          >
            ຣີເຊັດສີ
          </button>
          <button
            className="admin-btn admin-btn-danger"
            onClick={handleReset}
            disabled={saving}
          >
            ຣີເຊັດທັງໝົດ
          </button>
          {message && (
            <span
              className={
                message.startsWith("ເກີດຂໍ້ຜິດພາດ")
                  ? "admin-form-error"
                  : "admin-form-success"
              }
              style={{ marginBottom: 0 }}
              role="status"
            >
              {message}
            </span>
          )}
        </div>
      </div>

      <div className="admin-card design-preview">
        <div className="admin-card-title">
          <EyeIcon size={18} /> ຕົວຢ່າງບັດ
        </div>
        <div className="design-preview-wrap">
          <InvitationCard
            wedding={previewWedding}
            schedule={schedule}
            guest={null}
          />
        </div>
      </div>
    </div>
  );
}