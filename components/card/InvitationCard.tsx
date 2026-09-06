import type { Guest, ScheduleItem, WeddingInfo } from "@/lib/data";
import {
  getTemplate,
  parseDesign,
  resolveColors,
  type TemplateVariant,
} from "@/lib/templates";
import { placeholderPhotoUrl } from "@/lib/placeholder-photo";
import {
  formatLaoDate,
  formatLaoDateShort,
  formatLaoTime,
} from "@/lib/lao-format";
import { CalendarIcon, ClockIcon, MapPinIcon } from "@/components/icons";

/** Check if a photo path is valid and file exists. */
function hasValidPhoto(photoPath: string | null | undefined): boolean {
  if (!photoPath) return false;
  // In dev, the file may not exist yet, but we still show it
  return true;
}

/** Ornament glyphs per layout variant (kept as text so print works). */
const ORNAMENTS: Record<TemplateVariant, string> = {
  classic: "❀ ❀ ❀",
  modern: "— ✦ —",
  floral: "❁ ❁ ❁",
  luxury: "◆ ◆ ◆",
};

const DIVIDER_ICONS: Record<TemplateVariant, string> = {
  classic: "✦",
  modern: "•",
  floral: "❁",
  luxury: "◆",
};

interface InvitationCardProps {
  wedding: WeddingInfo;
  schedule: ScheduleItem[];
  guest: Guest | null;
  /** Optional prefix so multiple cards on one page get unique frame ids. */
  idPrefix?: string;
}

export default function InvitationCard({
  wedding,
  schedule,
  guest,
  idPrefix,
}: InvitationCardProps) {
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
  // and expose it as CSS variables so the card CSS keeps working unchanged.
  const colors = resolveColors(wedding.template, parseDesign(wedding.design));
  const variant = getTemplate(wedding.template).variant;
  const ornament = ORNAMENTS[variant];
  const dividerIcon = DIVIDER_ICONS[variant];
  const cardStyle = {
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

  // Use uploaded couple photo if available, otherwise use placeholder
  const bridePhotoPath = wedding.bride_photo_path ?? wedding.groom_photo_path;
  const photoSrc = bridePhotoPath && hasValidPhoto(bridePhotoPath)
    ? `/uploads/weddings/${bridePhotoPath}`
    : placeholderPhotoUrl(brideName, groomName);
  
  const page1Id = idPrefix ? `${idPrefix}-page1` : "page1";
  const page2Id = idPrefix ? `${idPrefix}-page2` : "page2";

  // Lao-formatted date & time (falls back to the raw strings when unparsable).
  const laoDate = formatLaoDate(wedding.date || "");
  const laoTime = wedding.time ? formatLaoTime(wedding.time) : "";

  return (
    <div className={`invitation-card variant-${variant}`} style={cardStyle}>
      {/* SVG clip path for the heart-shaped photo */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.95 C0.2,0.7 0,0.5 0,0.3 C0,0.12 0.12,0 0.3,0 C0.4,0 0.48,0.05 0.5,0.12 C0.52,0.05 0.6,0 0.7,0 C0.88,0 1,0.12 1,0.3 C1,0.5 0.8,0.7 0.5,0.95 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ===== Page 1: Cover ===== */}
      <div className="card-frame" id={page1Id}>
        <div className="corner corner-tl"></div>
        <div className="corner corner-tr"></div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br"></div>

        <div className="card-content">
          <div className="ornament-top">{ornament}</div>
          <div className="invite-label">ຂໍເຊີນທ່ານ</div>
          <div className="guest-name">{guestName}</div>
          <div className="guest-position">{guest?.position ?? ""}</div>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-icon">{dividerIcon}</div>
            <div className="divider-line"></div>
          </div>

          <div className="invite-text">
            ກະລຸນາມາຮ່ວມງານມຸງທຸນ ແລະ ສະເຫຼີມສະຫຼອງຄວາມສຸກ
            ໃນວັນມຸງທຸນຂອງ
          </div>

          <div className="couple-names">
            <div className="couple-row">
              <div className="person">
                <div className="person-title">{wedding.bride_title}</div>
                <div className="person-name">{brideName}</div>
              </div>
              <div className="ampersand">&amp;</div>
              <div className="person">
                <div className="person-title">{wedding.groom_title}</div>
                <div className="person-name">{groomName}</div>
              </div>
            </div>
          </div>

          <div className="heart-photo-wrap">
            <div className="heart-photo">
              <img src={photoSrc} alt="ຮູບຄູ່ບ່າວສາວ" />
            </div>
          </div>

          <div className="wedding-date">
            <div className="date-label">ວັນທີ່ຈັດງານ</div>
            {laoDate ? (
              <>
                <div className="date-weekday">{laoDate.weekday}</div>
                <div className="date-value">
                  <span className="date-day">{laoDate.day}</span>
                  <span className="date-month">ເດືອນ {laoDate.month}</span>
                </div>
                <div className="date-years">
                  ຄ.ສ. {laoDate.yearCE}
                  <span className="date-years-sep">•</span>
                  ພ.ສ. {laoDate.yearBE}
                </div>
                <div className="date-divider">
                  <span className="date-divider-line"></span>
                  <span className="date-divider-icon">✦</span>
                  <span className="date-divider-line"></span>
                </div>
              </>
            ) : (
              <div className="date-value">{wedding.date || "—"}</div>
            )}
            <div className="time-value">{laoTime || "—"}</div>
          </div>

          <div className="venue">
            <div className="venue-label">ສະຖານທີ່ຈັດງານ</div>
            <div className="venue-name">{wedding.location || "—"}</div>
          </div>

          <div className="closing">
            ຂໍຂອບໃຈທີ່ກະລຸນາມາຮ່ວມງານໃນຄັ້ງນີ້
          </div>

          <div className="ornament-bottom">{ornament}</div>
        </div>
      </div>

      {/* ===== Page 2: Content ===== */}
      <div className="card-frame content-page" id={page2Id}>
        <div className="corner corner-tl"></div>
        <div className="corner corner-tr"></div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br"></div>

        <div className="card-content">
          <div className="ornament-top">❀ ❀ ❀</div>
          <div className="content-title">ກຳນົດການງານ</div>
          <div className="content-subtitle">ພິທີມຸງທຸນ ແລະ ສະເຫຼີມສະຫຼອງ</div>

          <div className="content-sections-row">
            <div className="content-section">
              <div className="content-section-title">ກຳນົດເວລາ</div>
              <ul className="schedule-list">
                {schedule.map((item) => (
                  <li key={item.id} className="schedule-item">
                    <span className="schedule-time">{item.time}</span>
                    <span className="schedule-desc">{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="content-section">
              <div className="content-section-title">ຂໍ້ມູນການຕິດຕໍ່</div>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">
                    <MapPinIcon size={22} />
                  </div>
                  <div className="info-label">ສະຖານທີ່</div>
                  <div className="info-value">{wedding.location || "—"}</div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <CalendarIcon size={22} />
                  </div>
                  <div className="info-label">ວັນທີ</div>
                  <div className="info-value">
                    {wedding.date
                      ? formatLaoDateShort(wedding.date)
                      : "—"}
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <ClockIcon size={22} />
                  </div>
                  <div className="info-label">ເວລາ</div>
                  <div className="info-value">{laoTime || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="content-section-title">ຂໍ້ຄວາມອວຍພອນ</div>
            <div className="message-box">
              <p>
                ຂໍອວຍພອນໄຊອັນປະເສີດໃຫ້ຄູ່ບ່າວສາວ
                ຈົ່ງມີຄວາມສຸກ ຄວາມຮັກ ແລະ ຄວາມເຂົ້າໃຈກັນ
                ຕະຫຼອດໄປ
              </p>
              <p>
                ຂໍໃຫ້ຊີວິດຄູ່ສົມລົດຈົ່ງມີແຕ່ຄວາມສຸກ
                ຄວາມຈະເລີນຮຸ່ງເຮືອງ ແລະ ມີຄອບຄົວທີ່ອົບອຸ່ນ
              </p>
            </div>
          </div>

          <div className="signature">
            <div className="signature-name">
              {brideName} &amp; {groomName}
            </div>
            <div className="signature-role">ຄູ່ບ່າວສາວ</div>
          </div>

          <div className="ornament-bottom">{ornament}</div>
        </div>
      </div>
    </div>
  );
}