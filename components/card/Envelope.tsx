import type { Guest, WeddingInfo } from "@/lib/data";
import {
  getTemplate,
  parseDesign,
  resolveColors,
  type TemplateVariant,
} from "@/lib/templates";

/** Ornament glyphs per layout variant (kept as text so print works). */
const ORNAMENTS: Record<TemplateVariant, string> = {
  classic: "❀ ❀ ❀",
  modern: "— ✦ —",
  floral: "❁ ❁ ❁",
  luxury: "◆ ◆ ◆",
};

interface EnvelopeProps {
  wedding: WeddingInfo;
  guest: Guest | null;
  /** Optional prefix so multiple envelopes on one page get unique frame ids. */
  idPrefix?: string;
}

/**
 * Wedding invitation envelope (A4 landscape, 1123×794 px).
 * Front: return address, stamp box, guest name. Back: flap + monogram.
 * Uses the same template palette + layout variants as the invitation card.
 */
export default function Envelope({ wedding, guest, idPrefix }: EnvelopeProps) {
  const brideName = [wedding.bride_first_name, wedding.bride_last_name]
    .filter(Boolean)
    .join(" ");
  const groomName = [wedding.groom_first_name, wedding.groom_last_name]
    .filter(Boolean)
    .join(" ");
  const guestName = guest
    ? [guest.title, guest.first_name, guest.last_name].filter(Boolean).join(" ")
    : "—";

  // Resolve the effective palette (template + per-wedding design overrides)
  // and expose it as CSS variables so the envelope CSS keeps working unchanged.
  const colors = resolveColors(wedding.template, parseDesign(wedding.design));
  const variant = getTemplate(wedding.template).variant;
  const ornament = ORNAMENTS[variant];
  const envelopeStyle = {
    "--gold": colors.gold,
    "--gold-light": colors.goldLight,
    "--gold-dark": colors.goldDark,
    "--cream": colors.cream,
    "--cream-dark": colors.creamDark,
    "--ink": colors.ink,
    "--ink-light": colors.inkLight,
    "--rose": colors.rose,
    "--rose-light": colors.roseLight,
    "--white": colors.white,
  } as React.CSSProperties;

  const frontId = idPrefix ? `${idPrefix}-env-front` : "env-front";
  const backId = idPrefix ? `${idPrefix}-env-back` : "env-back";

  return (
    <div className={`envelope variant-${variant}`} style={envelopeStyle}>
      {/* ===== Front ===== */}
      <div className="envelope-frame" id={frontId}>
        <div className="corner corner-tl"></div>
        <div className="corner corner-tr"></div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br"></div>

        <div className="envelope-return">
          <div className="envelope-return-name">
            {brideName} &amp; {groomName}
          </div>
          <div className="envelope-return-line">{wedding.location || "—"}</div>
        </div>

        <div className="envelope-stamp" aria-hidden="true">
          <span>Stamp</span>
        </div>

        <div className="envelope-guest">
          <div className="envelope-to-label">ເຖິງ</div>
          <div className="envelope-guest-name">{guestName}</div>
          {guest?.position ? (
            <div className="envelope-guest-position">{guest.position}</div>
          ) : null}
        </div>

        <div className="envelope-ornament">{ornament}</div>
      </div>

      {/* ===== Back ===== */}
      <div className="envelope-frame envelope-back" id={backId}>
        <div className="envelope-flap"></div>
        <div className="envelope-back-content">
          <div className="envelope-monogram">
            <span className="envelope-monogram-amp">&amp;</span>
          </div>
          <div className="envelope-back-names">
            {brideName} &amp; {groomName}
          </div>
          <div className="envelope-back-role">ຄູ່ບ່າວສາວ</div>
        </div>
      </div>
    </div>
  );
}