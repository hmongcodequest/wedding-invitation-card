"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Guest, ScheduleItem, WeddingInfo } from "@/lib/data";
import GuestSearch from "./GuestSearch";
import InvitationCard from "./InvitationCard";
import SizeInfo from "./SizeInfo";
import BatchPrint from "./BatchPrint";
import Envelope from "./Envelope";
import BatchEnvelope from "./BatchEnvelope";
import {
  RingIcon,
  ListIcon,
  FileIcon,
  MailIcon,
  PrinterIcon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  SpinnerIcon,
} from "@/components/icons";

type PaperSize = "a4" | "a7";
type PrintMode = "all" | "page1" | "page2";
type BatchMode = "none" | "covers" | "full";
type EnvelopeMode = "none" | "single" | "batch";

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
  const router = useRouter();
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [printMode, setPrintMode] = useState<PrintMode>("all");
  const [batchMode, setBatchMode] = useState<BatchMode>("none");
  const [envelopeMode, setEnvelopeMode] = useState<EnvelopeMode>("none");
  const [batchMenuOpen, setBatchMenuOpen] = useState(false);
  const [marking, setMarking] = useState(false);
  const batchMenuRef = useRef<HTMLDivElement>(null);

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
    // Deep-link to the envelope preview (no print dialog).
    if (params.get("envelope") === "1") {
      setEnvelopeMode("single");
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

  // Close the batch menu when clicking outside.
  useEffect(() => {
    if (!batchMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        batchMenuRef.current &&
        !batchMenuRef.current.contains(e.target as Node)
      ) {
        setBatchMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [batchMenuOpen]);

  const selectedGuest = useMemo(
    () => guests.find((g) => g.id === selectedGuestId) ?? null,
    [guests, selectedGuestId]
  );

  const unprintedGuests = useMemo(
    () => guests.filter((g) => g.printed === 0),
    [guests]
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

  const handleBatchPrint = (mode: "covers" | "full") => {
    setBatchMenuOpen(false);
    setBatchMode(mode);
    // Let the batch-active class take effect, then open the print dialog.
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleEnvelopePrint = () => {
    setEnvelopeMode("single");
    // Let the envelope-active class take effect, then print, then clean up.
    setTimeout(() => {
      window.print();
      setTimeout(() => setEnvelopeMode("none"), 100);
    }, 100);
  };

  const handleBatchEnvelopePrint = () => {
    setBatchMenuOpen(false);
    setEnvelopeMode("batch");
    // Let the envelope-batch class take effect, then open the print dialog.
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const markAllPrinted = async () => {
    setMarking(true);
    try {
      const res = await fetch("/api/guests/batch-printed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weddingId: wedding.id, printed: 1 }),
      });
      if (res.ok) {
        setBatchMode("none");
        setEnvelopeMode("none");
        router.refresh();
      }
    } finally {
      setMarking(false);
    }
  };

  const rootClass = [
    "app-shell",
    paperSize === "a7" ? "paper-a7" : "",
    printMode === "page1" ? "print-page1" : "",
    printMode === "page2" ? "print-page2" : "",
    batchMode !== "none" ? "batch-active" : "",
    batchMode === "covers" ? "batch-covers" : "",
    envelopeMode === "single" ? "envelope-active" : "",
    envelopeMode === "batch" ? "envelope-batch" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className="toolbar">
        <div className="toolbar-title">
          <RingIcon size={18} /> ບັດເຊີນງານແຕ່ງງານ
        </div>
        <div className="toolbar-actions">
          <Link href={`/w/${wedding.id}/guests`} className="btn">
            <ListIcon size={16} /> ລາຍຊື່ແຂກ
          </Link>
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
            <option value="a4">A4 (210×297 ມມ)</option>
            <option value="a7">A7 (12.7×17.8 ຊມ / 5×7 ນິ້ວ)</option>
          </select>
          <button className="btn" onClick={() => handlePrint("page1")}>
            <PrinterIcon size={16} /> ພິມໜ້າປົກ
          </button>
          <button className="btn" onClick={() => handlePrint("page2")}>
            <PrinterIcon size={16} /> ພິມໜ້າເນື້ອໃນ
          </button>
          <button className="btn btn-primary" onClick={() => handlePrint("all")}>
            <PrinterIcon size={16} /> ພິມທັງສອງໜ້າ
          </button>
          <button className="btn" onClick={handleEnvelopePrint}>
            <MailIcon size={16} /> ພິມຊອງ
          </button>
          <div className="batch-menu" ref={batchMenuRef}>
            <button
              className="btn btn-primary"
              onClick={() => setBatchMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={batchMenuOpen}
              disabled={unprintedGuests.length === 0}
            >
              <PrinterIcon size={16} /> ພິມທັງໝົດ ({unprintedGuests.length})
              <ChevronDownIcon size={14} />
            </button>
            {batchMenuOpen && (
              <div className="batch-menu-popup" role="menu">
                <button
                  role="menuitem"
                  onClick={() => handleBatchPrint("covers")}
                >
                  <FileIcon size={16} /> ພິມປົກທັງໝົດ
                </button>
                <button role="menuitem" onClick={() => handleBatchPrint("full")}>
                  <PrinterIcon size={16} /> ພິມທັງສອງໜ້າທັງໝົດ
                </button>
                <button role="menuitem" onClick={handleBatchEnvelopePrint}>
                  <MailIcon size={16} /> ພິມຊອງທັງໝົດ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-container">
        {envelopeMode === "none" ? (
          <InvitationCard
            wedding={wedding}
            schedule={schedule}
            guest={selectedGuest}
          />
        ) : (
          <div className="envelope-preview">
            <Envelope wedding={wedding} guest={selectedGuest} />
          </div>
        )}
      </div>

      <BatchPrint
        wedding={wedding}
        guests={unprintedGuests}
        schedule={schedule}
      />

      <BatchEnvelope wedding={wedding} guests={unprintedGuests} />

      <SizeInfo paperSize={paperSize} />

      {(batchMode !== "none" || envelopeMode === "batch") && (
        <div className="batch-done-banner" role="status">
          <span className="batch-done-text">
            {envelopeMode === "batch"
              ? `ພິມຊອງ ${unprintedGuests.length} ຊອງ — ໝາຍວ່າພິມແລ້ວບໍ?`
              : `ພິມບັດເຊີນ ${unprintedGuests.length} ບັດ — ໝາຍວ່າພິມແລ້ວບໍ?`}
          </span>
          <button
            className="btn btn-primary"
            onClick={markAllPrinted}
            disabled={marking}
          >
            {marking ? (
              <SpinnerIcon size={16} />
            ) : (
              <CheckIcon size={16} />
            )}{" "}
            ໝາຍພິມແລ້ວ
          </button>
          <button
            className="btn"
            onClick={() => {
              setBatchMode("none");
              setEnvelopeMode("none");
            }}
          >
            <XIcon size={16} /> ປິດ
          </button>
        </div>
      )}
    </div>
  );
}