"use client";

import { useEffect, useMemo, useState } from "react";
import type { Guest } from "@/lib/data";
import {
  ListIcon,
  SearchIcon,
  CheckIcon,
  SquareIcon,
  XIcon,
  SpinnerIcon,
} from "@/components/icons";

interface GuestManagerProps {
  guests: Guest[];
}

const PAGE_SIZES = [5, 10, 20, 0] as const;

export default function GuestManager({ guests }: GuestManagerProps) {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("");
  const [ready, setReady] = useState("");
  const [printed, setPrinted] = useState("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [guestList, setGuestList] = useState<Guest[]>(guests);
  const [savingId, setSavingId] = useState<number | null>(null);

  // Restore state from URL params (client-only, after mount).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if (searchParam !== null) setSearch(searchParam);
    const positionParam = params.get("position");
    if (positionParam !== null) setPosition(positionParam);
    const readyParam = params.get("ready");
    if (readyParam !== null) setReady(readyParam);
    const printedParam = params.get("printed");
    if (printedParam === "printed" || printedParam === "not-printed") {
      setPrinted(printedParam);
    }
    const limitParam = params.get("limit");
    if (
      limitParam !== null &&
      PAGE_SIZES.some((s) => String(s) === limitParam)
    ) {
      setPageSize(parseInt(limitParam, 10));
    }
    const pageParam = params.get("page");
    if (pageParam !== null && parseInt(pageParam, 10) > 0) {
      setCurrentPage(parseInt(pageParam, 10));
    }
  }, []);

  // Keep the URL in sync, like the old app.
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (position) params.set("position", position);
    if (ready) params.set("ready", ready);
    if (printed) params.set("printed", printed);
    if (pageSize !== 5) params.set("limit", String(pageSize));
    if (currentPage > 1) params.set("page", String(currentPage));
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    );
  }, [search, position, ready, printed, pageSize, currentPage]);

  // Unique positions and ready statuses for the filter dropdowns.
  const positions = useMemo(
    () =>
      [...new Set(guestList.map((g) => g.position).filter(Boolean))].sort(),
    [guestList]
  );
  const readyStatuses = useMemo(
    () => [...new Set(guestList.map((g) => g.ready).filter(Boolean))].sort(),
    [guestList]
  );

  // Apply filters.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guestList.filter((g) => {
      const fullName = [g.title, g.first_name, g.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !q || fullName.includes(q);
      const matchesPosition = !position || g.position === position;
      const matchesReady = !ready || g.ready === ready;
      const matchesPrinted =
        !printed ||
        (printed === "printed" && g.printed === 1) ||
        (printed === "not-printed" && g.printed === 0);
      return (
        matchesSearch && matchesPosition && matchesReady && matchesPrinted
      );
    });
  }, [guestList, search, position, ready, printed]);

  const totalPages =
    pageSize === 0 ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const pageRows = useMemo(() => {
    if (pageSize === 0) return filtered;
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSize, safePage]);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setPosition("");
    setReady("");
    setPrinted("");
    setCurrentPage(1);
  };

  const togglePrinted = async (guest: Guest) => {
    const next = guest.printed === 1 ? 0 : 1;
    setSavingId(guest.id);
    try {
      const res = await fetch(`/api/guests/${guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printed: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = (await res.json()) as Guest;
      setGuestList((list) =>
        list.map((g) => (g.id === updated.id ? updated : g))
      );
    } catch (err) {
      console.error("Failed to update print status:", err);
      alert("ບໍ່ສາມາດບັນທຶກສະຖານະການພິມໄດ້ ກະລຸນາລອງໃໝ່");
    } finally {
      setSavingId(null);
    }
  };

  const start = filtered.length === 0 ? 0 : pageSize === 0 ? 1 : (safePage - 1) * pageSize + 1;
  const end = filtered.length === 0 ? 0 : pageSize === 0 ? filtered.length : Math.min(safePage * pageSize, filtered.length);

  return (
    <div className="guest-list-section">
      <div className="guest-list-card">
        <div className="guest-list-title">
          <ListIcon size={20} /> ລາຍຊື່ແຂກທີ່ເຊີນ
        </div>

        {/* Filters */}
        <div className="guest-filters">
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <SearchIcon
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--ink-light)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              className="filter-input"
              style={{ paddingLeft: 36, width: "100%" }}
              placeholder="ຄົ້ນຫາຊື່ ຫຼື ນາມສະກຸນ..."
              aria-label="ຄົ້ນຫາແຂກ"
              value={search}
              onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            aria-label="ກັ່ນຕອງຕາມຕຳແໜ່ງ"
            value={position}
            onChange={(e) => handleFilterChange(setPosition)(e.target.value)}
          >
            <option value="">ຕຳແໜ່ງທັງໝົດ</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            aria-label="ກັ່ນຕອງຕາມສະຖານະ"
            value={ready}
            onChange={(e) => handleFilterChange(setReady)(e.target.value)}
          >
            <option value="">ສະຖານະທັງໝົດ</option>
            {readyStatuses.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            aria-label="ກັ່ນຕອງຕາມສະຖານະການພິມ"
            value={printed}
            onChange={(e) => handleFilterChange(setPrinted)(e.target.value)}
          >
            <option value="">ສະຖານະການພິມທັງໝົດ</option>
            <option value="printed">ພິມແລ້ວ</option>
            <option value="not-printed">ຍັງບໍ່ທັນພິມ</option>
          </select>
          <button className="filter-clear" onClick={clearFilters}>
            <XIcon size={14} /> ລ້າງການກັ່ນຕອງ
          </button>
        </div>

        <div className="guest-count">
          ພົບແຂກ <strong>{filtered.length}</strong> ຄົນ ຈາກທັງໝົດ{" "}
          <strong>{guestList.length}</strong> ຄົນ
        </div>

        <table className="guest-table">
          <thead>
            <tr>
              <th className="num">#</th>
              <th>ຄຳນຳໜ້າ</th>
              <th>ຊື່</th>
              <th>ນາມສະກຸນ</th>
              <th>ຕຳແໜ່ງ</th>
              <th>ສະຖານະ</th>
              <th>ສະຖານະການພິມ</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((guest, i) => (
              <tr key={guest.id}>
                <td className="num">{pageSize === 0 ? guest.id : (safePage - 1) * pageSize + i + 1}</td>
                <td>{guest.title}</td>
                <td>{guest.first_name}</td>
                <td>{guest.last_name}</td>
                <td>{guest.position}</td>
                <td>{guest.ready}</td>
                <td>
                  <button
                    className={`print-status-btn ${guest.printed ? "printed" : "not-printed"}`}
                    onClick={() => togglePrinted(guest)}
                    disabled={savingId === guest.id}
                    title="ກົດເພື່ອປ່ຽນສະຖານະການພິມ"
                  >
                    {savingId === guest.id ? (
                      <SpinnerIcon size={14} />
                    ) : guest.printed ? (
                      <>
                        <CheckIcon size={14} /> ພິມແລ້ວ
                      </>
                    ) : (
                      <>
                        <SquareIcon size={14} /> ຍັງບໍ່ທັນ
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "16px" }}>
                  ບໍ່ພົບແຂກທີ່ກົງກັບການກັ່ນຕອງ
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="guest-table-footer">
          <div className="pagination">
            <span className="page-info">
              ໜ້າ {safePage}/{totalPages} · ສະແດງ {start}-{end} ຈາກ{" "}
              {filtered.length}
            </span>
            <button
              className="page-btn"
              onClick={() => setCurrentPage(safePage - 1)}
              disabled={safePage <= 1}
              aria-label="ໜ້າກ່ອນ"
            >
              ‹
            </button>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${p === safePage ? "active" : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="page-btn"
              onClick={() => setCurrentPage(safePage + 1)}
              disabled={safePage >= totalPages}
              aria-label="ໜ້າຕໍ່ໄປ"
            >
              ›
            </button>
          </div>
          <div>
            <label className="page-info" htmlFor="limitSelect">
              ສະແດງ:
            </label>
            <select
              id="limitSelect"
              className="limit-select"
              aria-label="ຈຳນວນແຖວຕໍ່ໜ້າ"
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
            >
              <option value="5">5 ຄົນ/ໜ້າ</option>
              <option value="10">10 ຄົນ/ໜ້າ</option>
              <option value="20">20 ຄົນ/ໜ້າ</option>
              <option value="0">ທັງໝົດ</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}