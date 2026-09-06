"use client";

import { useEffect, useMemo, useState } from "react";
import type { Guest, ScheduleItem, WeddingInfo } from "@/lib/data";
import GuestSearch from "./GuestSearch";
import InvitationCard from "./InvitationCard";
import SizeInfo from "./SizeInfo";

type PaperSize = "a4" | "a7";
type PrintMode = "all" | "page1" | "page2";

interface CardViewerProps {
  wedding: WeddingInfo;
  guests: Guest[];
  schedule: ScheduleItem[];
}

export default function CardViewer({
  wedding,
  guests,
  schedule,
}: CardViewerProps) {
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [printMode, setPrintMode] = useState<PrintMode>("all");

  // Restore state from URL params + localStorage (client-only, after mount).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get("guest");
    if (guestParam !== null) {
      const id = parseInt(guestParam, 10);
      if (!Number.isNaN(id) && guests.some((g) => g.id === id)) {
        setSelectedGuestId(id);
      }
    }
    const saved = localStorage.getItem("weddingPaperSize");
    if (
      params.get("paper") === "a7" ||
      (params.get("paper") === null && saved === "a7")
    ) {
      setPaperSize("a7");
    }
  }, [guests]);

  // Keep the URL in sync (guest + paper), like the old app.
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGuestId !== null) params.set("guest", String(selectedGuestId));
    if (paperSize === "a7") params.set("paper", "a7");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname
    );
  }, [selectedGuestId, paperSize]);

  const selectedGuest = useMemo(
    () => guests.find((g) => g.id === selectedGuestId) ?? null,
    [guests, selectedGuestId]
  );

  const handlePaperChange = (size: PaperSize) => {
    setPaperSize(size);
    localStorage.setItem("weddingPaperSize", size);
  };

  const handlePrint = (page: PrintMode) => {
    setPrintMode(page);
    // Let the class take effect, then print, then clean up.
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintMode("all"), 100);
    }, 100);
  };

  const rootClass = [
    "app-shell",
    paperSize === "a7" ? "paper-a7" : "",
    printMode === "page1" ? "print-page1" : "",
    printMode === "page2" ? "print-page2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className="toolbar">
        <div className="toolbar-title">💍 ບັດເຊີນງານແຕ່ງງານ</div>
        <div className="toolbar-actions">
          <GuestSearch
            guests={guests}
            selectedGuestId={selectedGuestId}
            onSelect={setSelectedGuestId}
          />
          <select
            className="paper-select"
            value={paperSize}
            onChange={(e) => handlePaperChange(e.target.value as PaperSize)}
            aria-label="ຂະໜາດເຈ້ຍ"
          >
            <option value="a4">📄 A4 (210×297 ມມ)</option>
            <option value="a7">💌 A7 (12.7×17.8 ຊມ / 5×7 ນິ້ວ)</option>
          </select>
          <button className="btn" onClick={() => handlePrint("page1")}>
            🖨️ ພິມໜ້າປົກ
          </button>
          <button className="btn" onClick={() => handlePrint("page2")}>
            🖨️ ພິມໜ້າເນື້ອໃນ
          </button>
          <button className="btn btn-primary" onClick={() => handlePrint("all")}>
            🖨️ ພິມທັງສອງໜ້າ
          </button>
        </div>
      </div>

      <div className="card-container">
        <InvitationCard
          wedding={wedding}
          schedule={schedule}
          guest={selectedGuest}
        />
      </div>

      <SizeInfo paperSize={paperSize} />
    </div>
  );
}