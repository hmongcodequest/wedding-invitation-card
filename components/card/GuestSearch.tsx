"use client";

import { useEffect, useMemo, useState } from "react";
import type { Guest } from "@/lib/data";
import { SearchIcon } from "@/components/icons";

interface GuestSearchProps {
  guests: Guest[];
  selectedGuestId: number | null;
  onSelect: (id: number | null) => void;
}

function fullName(g: Guest): string {
  return [g.title, g.first_name, g.last_name].filter(Boolean).join(" ");
}

export default function GuestSearch({
  guests,
  selectedGuestId,
  onSelect,
}: GuestSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Only guests NOT yet printed appear in the searchable selector.
  const unprinted = useMemo(() => guests.filter((g) => g.printed === 0), [guests]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return unprinted.filter((g) => {
      const name = fullName(g);
      return !q || name.toLowerCase().includes(q);
    });
  }, [unprinted, query]);

  // Sync the input when a guest is selected from outside (e.g. URL param on load).
  useEffect(() => {
    if (selectedGuestId !== null) {
      const g = guests.find((x) => x.id === selectedGuestId);
      if (g) setQuery(fullName(g));
    }
  }, [selectedGuestId, guests]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    setActiveIndex(-1);
    // If typed text no longer matches the selected guest, clear the selection.
    if (selectedGuestId !== null) {
      const g = guests.find((x) => x.id === selectedGuestId);
      const name = g ? fullName(g) : "";
      if (value.trim().toLowerCase() !== name.toLowerCase()) {
        onSelect(null);
      }
    }
  };

  const handleSelect = (id: number) => {
    const g = guests.find((x) => x.id === id);
    if (g) setQuery(fullName(g));
    setOpen(false);
    setActiveIndex(-1);
    onSelect(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex >= 0 && matches[activeIndex]) {
        handleSelect(matches[activeIndex].id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="guest-search">
      <div style={{ position: "relative" }}>
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
          className="guest-search-input"
          style={{ paddingLeft: 36 }}
          placeholder="ຄົ້ນຫາ ແລະ ເລືອກແຂກ..."
          autoComplete="off"
          aria-label="ຄົ້ນຫາ ແລະ ເລືອກແຂກ"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(-1);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {open && (
        <div className="guest-search-dropdown">
          {matches.length === 0 ? (
            <div className="guest-search-empty">
              {query.trim()
                ? "ບໍ່ພົບແຂກທີ່ກົງກັບການຄົ້ນຫາ"
                : "ບໍ່ມີແຂກທີ່ຍັງບໍ່ທັນພິມ"}
            </div>
          ) : (
            matches.map((g, i) => (
              <div
                key={g.id}
                className={`guest-search-item${i === activeIndex ? " active" : ""}`}
                ref={(el) => {
                  if (i === activeIndex && el) {
                    el.scrollIntoView({ block: "nearest" });
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep focus so blur doesn't close first
                  handleSelect(g.id);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {fullName(g)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}