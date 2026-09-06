import type { Guest, ScheduleItem, WeddingInfo } from "@/lib/data";

interface InvitationCardProps {
  wedding: WeddingInfo;
  schedule: ScheduleItem[];
  guest: Guest | null;
}

export default function InvitationCard({
  wedding,
  schedule,
  guest,
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

  return (
    <div className="invitation-card">
      {/* SVG clip path for the heart-shaped photo */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.95 C0.2,0.7 0,0.5 0,0.3 C0,0.12 0.12,0 0.3,0 C0.4,0 0.48,0.05 0.5,0.12 C0.52,0.05 0.6,0 0.7,0 C0.88,0 1,0.12 1,0.3 C1,0.5 0.8,0.7 0.5,0.95 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ===== Page 1: Cover ===== */}
      <div className="card-frame" id="page1">
        <div className="corner corner-tl"></div>
        <div className="corner corner-tr"></div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br"></div>

        <div className="card-content">
          <div className="ornament-top">❀ ❀ ❀</div>
          <div className="invite-label">ຂໍເຊີນທ່ານ</div>
          <div className="guest-name">{guestName}</div>
          <div className="guest-position">{guest?.position ?? ""}</div>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-icon">✦</div>
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
              <img src="/placeholder-photo.svg" alt="ຮູບຄູ່ບ່າວສາວ" />
            </div>
          </div>

          <div className="wedding-date">
            <div className="date-label">ວັນທີ່ຈັດງານ</div>
            <div className="date-value">{wedding.date || "—"}</div>
            <div className="time-value">{wedding.time}</div>
          </div>

          <div className="venue">
            <div className="venue-label">ສະຖານທີ່ຈັດງານ</div>
            <div className="venue-name">{wedding.location || "—"}</div>
          </div>

          <div className="closing">
            ຂໍຂອບໃຈທີ່ກະລຸນາມາຮ່ວມງານໃນຄັ້ງນີ້
          </div>

          <div className="ornament-bottom">❀ ❀ ❀</div>
        </div>
      </div>

      {/* ===== Page 2: Content ===== */}
      <div className="card-frame content-page" id="page2">
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
                  <div className="info-icon">📍</div>
                  <div className="info-label">ສະຖານທີ່</div>
                  <div className="info-value">{wedding.location || "—"}</div>
                </div>
                <div className="info-card">
                  <div className="info-icon">📅</div>
                  <div className="info-label">ວັນທີ</div>
                  <div className="info-value">{wedding.date || "—"}</div>
                </div>
                <div className="info-card">
                  <div className="info-icon">🕐</div>
                  <div className="info-label">ເວລາ</div>
                  <div className="info-value">{wedding.time || "—"}</div>
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

          <div className="ornament-bottom">❀ ❀ ❀</div>
        </div>
      </div>
    </div>
  );
}