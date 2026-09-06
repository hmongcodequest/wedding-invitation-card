"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatLaoDateShort, formatLaoTime } from "@/lib/lao-format";

import "./couple.css";

interface WeddingData {
  id: number;
  bride_title: string;
  bride_first_name: string;
  bride_last_name: string;
  groom_title: string;
  groom_first_name: string;
  groom_last_name: string;
  location: string;
  date: string;
  time: string;
  bride_photo_path: string | null;
  groom_photo_path: string | null;
}

export default function CouplePage() {
  const router = useRouter();
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bridePhotoPreview, setBridePhotoPreview] = useState<string | null>(null);
  const [groomPhotoPreview, setGroomPhotoPreview] = useState<string | null>(null);
  const [bridePhotoFile, setBridePhotoFile] = useState<File | null>(null);
  const [groomPhotoFile, setGroomPhotoFile] = useState<File | null>(null);

  const fetchWedding = async () => {
    try {
      const res = await fetch("/api/couple/wedding");
      if (res.ok) {
        const data = await res.json();
        setWedding(data);
      } else {
        setError("ບໍ່ພົບຂໍ້ມູນງານ");
      }
    } catch {
      setError("ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ");
    } finally {
      setLoading(false);
    }
  };

  const handleBridePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError("ໄຟລ໌ໃຫຍ່ເກີນ 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("ເປັນໄຟລ໌ຮູບພາບທີ່ຖືກຕ້ອງ (JPG, PNG)");
      return;
    }
    
    setError("");
    const previewUrl = URL.createObjectURL(file);
    setBridePhotoPreview(previewUrl);
    setBridePhotoFile(file);
  };

  const handleGroomPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError("ໄຟລ໌ໃຫຍ່ເກີນ 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("ເປັນໄຟລ໌ຮູບພາບທີ່ຖືກຕ້ອງ (JPG, PNG)");
      return;
    }
    
    setError("");
    const previewUrl = URL.createObjectURL(file);
    setGroomPhotoPreview(previewUrl);
    setGroomPhotoFile(file);
  };

  const handleRemoveBridePreview = () => {
    setBridePhotoPreview(null);
    setBridePhotoFile(null);
    const input = document.getElementById('bridePhoto') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleRemoveGroomPreview = () => {
    setGroomPhotoPreview(null);
    setGroomPhotoFile(null);
    const input = document.getElementById('groomPhoto') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSave = async () => {
    if (!bridePhotoFile && !groomPhotoFile) {
      setError("ກະລຸນາເລືອກຮູບພາບພາຍໃນພາຍໃນພາຍນອນ");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      if (bridePhotoFile) {
        formData.append("bridePhoto", bridePhotoFile);
      }
      if (groomPhotoFile) {
        formData.append("groomPhoto", groomPhotoFile);
      }

      const res = await fetch("/api/couple/photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess("ອັບໂຫຼດຮູບພາບສຳເລັດ!");
        // Refresh wedding data
        const weddingRes = await fetch("/api/couple/wedding");
        if (weddingRes.ok) {
          const weddingData = await weddingRes.json();
          setWedding(weddingData);
        }
        // Clear previews
        setBridePhotoPreview(null);
        setGroomPhotoPreview(null);
        setBridePhotoFile(null);
        setGroomPhotoFile(null);
      } else {
        const error = await res.json();
        setError(error.error || "ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
      }
    } catch {
      setError("ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດ");
    } finally {
      setSaving(false);
    }
  };

  // Load wedding data on mount
  useEffect(() => {
    fetchWedding();
  }, []);

  if (loading) {
    return (
      <div className="couple-page">
        <div className="couple-loading">
          <div className="couple-spinner"></div>
          <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="couple-page">
        <div className="couple-error">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ color: "var(--ap-primary)" }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2>ບໍ່ພົບຂໍ້ມູນງານ</h2>
          <p>ບໍ່ພົບຂໍ້ມູນງານງານແຕ່ງງານ</p>
        </div>
      </div>
    );
  }

  const brideName = [wedding.bride_first_name, wedding.bride_last_name].filter(Boolean).join(" ");
  const groomName = [wedding.groom_first_name, wedding.groom_last_name].filter(Boolean).join(" ");

  return (
    <div className="couple-page">
      <header className="couple-header">
        <div className="couple-header-content">
          <h1>ອັບໂຫຼດຮູບພາບຄູ່ບ່າວສາວ</h1>
          <p className="couple-subtitle">ອັບໂຫຼດຮູບພາບສຳລັບບັດເຊີນງານຂອງທ່ານ</p>
        </div>
      </header>

      <main className="couple-main">
        <div className="couple-card">
          {/* Couple Info */}
          <div className="couple-info-section">
            <div className="couple-names">
              <div className="couple-person bride">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "var(--ap-primary)" }}
                >
                  <path d="M12 5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
                  <path d="M12 3v2" />
                  <path d="M12 21v-2" />
                  <path d="M3 12h2" />
                  <path d="M21 12h-2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M18.36 18.36l1.41 1.41" />
                  <path d="M4.93 19.07l1.41-1.41" />
                  <path d="M18.36 5.64l1.41-1.41" />
                </svg>
                <div className="couple-person-info">
                  <span className="couple-person-title">ຄູ່ບ່າວສາວ</span>
                  <span className="couple-person-name">{brideName || "ຍັງບໍ່ມີຊື່"}</span>
                </div>
              </div>
              <span className="couple-amp">&</span>
              <div className="couple-person groom">
                <div className="couple-person-info">
                  <span className="couple-person-title">ຄູ່ບ່າວ</span>
                  <span className="couple-person-name">{groomName || "ຍັງບໍ່ມີຊື່"}</span>
                </div>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "var(--ap-primary)" }}
                >
                  <path d="M12 5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
                  <path d="M12 3v2" />
                  <path d="M12 21v-2" />
                  <path d="M3 12h2" />
                  <path d="M21 12h-2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M18.36 18.36l1.41 1.41" />
                  <path d="M4.93 19.07l1.41-1.41" />
                  <path d="M18.36 5.64l1.41-1.41" />
                </svg>
              </div>
            </div>

            {wedding.date && (
              <div className="couple-wedding-info">
                <div className="couple-info-item">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ color: "var(--ap-primary)" }}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{formatLaoDateShort(wedding.date)}</span>
                </div>
                {wedding.time && (
                  <div className="couple-info-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ color: "var(--ap-primary)" }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{formatLaoTime(wedding.time)}</span>
                  </div>
                )}
                {wedding.location && (
                  <div className="couple-info-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ color: "var(--ap-primary)" }}
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{wedding.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo Upload Sections */}
          <div className="couple-photos-section">
            <div className="couple-photo-upload">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "var(--ap-primary)" }}
                >
                  <path d="M12 5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
                  <path d="M12 3v2" />
                  <path d="M12 21v-2" />
                  <path d="M3 12h2" />
                  <path d="M21 12h-2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M18.36 18.36l1.41 1.41" />
                  <path d="M4.93 19.07l1.41-1.41" />
                  <path d="M18.36 5.64l1.41-1.41" />
                </svg>
                ຮູບພາບຄູ່ບ່າວສາວ
              </h3>
              {wedding.bride_photo_path ? (
                <div className="couple-photo-preview">
                  <img
                    src={`/uploads/weddings/${wedding.id}-${wedding.bride_photo_path}`}
                    alt={`ຮູບພາບຂອງ ${brideName}`}
                    className="couple-photo-img"
                  />
                  <p className="couple-photo-status">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ color: "var(--ap-primary)" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    ອັບໂຫຼດແລ້ວ
                  </p>
                </div>
              ) : (
                <div className="couple-photo-upload-area">
                  {bridePhotoPreview ? (
                    <div className="couple-photo-preview">
                      <img
                        src={bridePhotoPreview}
                        alt="ຮູບພາບຄູ່ບ່າວສາວ (ພີວ)"
                        className="couple-photo-img"
                      />
                      <button
                        type="button"
                        className="couple-photo-remove"
                        onClick={handleRemoveBridePreview}
                        aria-label="ຍົກເລີກ"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="bridePhoto" className="couple-photo-label">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ color: "var(--ap-primary)" }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span>ເລືອກຮູບພາບຄູ່ບ່າວສາວ</span>
                      <span className="couple-photo-hint">ຈາກ 200KB - 5MB (JPG, PNG)</span>
                      <input
                        id="bridePhoto"
                        type="file"
                        accept="image/*"
                        className="couple-photo-input"
                        onChange={handleBridePhotoChange}
                        disabled={saving}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            <div className="couple-photo-upload">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "var(--ap-primary)" }}
                >
                  <path d="M12 5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
                  <path d="M12 3v2" />
                  <path d="M12 21v-2" />
                  <path d="M3 12h2" />
                  <path d="M21 12h-2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M18.36 18.36l1.41 1.41" />
                  <path d="M4.93 19.07l1.41-1.41" />
                  <path d="M18.36 5.64l1.41-1.41" />
                </svg>
                ຮູບພາບຄູ່ບ່າວ
              </h3>
              {wedding.groom_photo_path ? (
                <div className="couple-photo-preview">
                  <img
                    src={`/uploads/weddings/${wedding.id}-${wedding.groom_photo_path}`}
                    alt={`ຮູບພາບຂອງ ${groomName}`}
                    className="couple-photo-img"
                  />
                  <p className="couple-photo-status">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ color: "var(--ap-primary)" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    ອັບໂຫຼດແລ້ວ
                  </p>
                </div>
              ) : (
                <div className="couple-photo-upload-area">
                  {groomPhotoPreview ? (
                    <div className="couple-photo-preview">
                      <img
                        src={groomPhotoPreview}
                        alt="ຮູບພາບຄູ່ບ່າວ (ພີວ)"
                        className="couple-photo-img"
                      />
                      <button
                        type="button"
                        className="couple-photo-remove"
                        onClick={handleRemoveGroomPreview}
                        aria-label="ຍົກເລີກ"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="groomPhoto" className="couple-photo-label">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ color: "var(--ap-primary)" }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span>ເລືອກຮູບພາບຄູ່ບ່າວ</span>
                      <span className="couple-photo-hint">ຈາກ 200KB - 5MB (JPG, PNG)</span>
                      <input
                        id="groomPhoto"
                        type="file"
                        accept="image/*"
                        className="couple-photo-input"
                        onChange={handleGroomPhotoChange}
                        disabled={saving}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="couple-actions">
            <button
              type="button"
              className="couple-btn couple-btn-primary"
              onClick={handleSave}
              disabled={saving || (!bridePhotoFile && !groomPhotoFile && !wedding.bride_photo_path && !wedding.groom_photo_path)}
            >
              {saving ? (
                <>
                  <span className="couple-spinner-small"></span>
                  ກຳລັງບັນທຶກ...
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  ບັນທຶກຮູບພາບ
                </>
              )}
            </button>
            <button
              type="button"
              className="couple-btn couple-btn-secondary"
              onClick={() => router.push("/")}
            >
              ຍົກເລີກ
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="couple-message couple-message-error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="couple-message couple-message-success">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{success}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}