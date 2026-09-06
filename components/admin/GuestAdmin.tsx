"use client";

import { useMemo, useState } from "react";
import type { Guest } from "@/lib/data";
import {
  addGuest,
  updateGuest,
  deleteGuest,
  setGuestPrinted,
} from "@/app/admin/actions";
import type { GuestFormInput } from "@/app/admin/actions";
import {
  PlusIcon,
  EditIcon,
  SaveIcon,
  SpinnerIcon,
  ListIcon,
  SearchIcon,
  CheckIcon,
  SquareIcon,
  TrashIcon,
} from "@/components/icons";

interface GuestAdminProps {
  weddingId: number;
  guests: Guest[];
}

const EMPTY_FORM: GuestFormInput = {
  title: "",
  first_name: "",
  last_name: "",
  position: "",
  ready: "",
};

export default function GuestAdmin({ weddingId, guests }: GuestAdminProps) {
  const [guestList, setGuestList] = useState<Guest[]>(guests);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GuestFormInput>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guestList;
    return guestList.filter((g) =>
      [g.title, g.first_name, g.last_name, g.position, g.ready]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [guestList, search]);

  const startEdit = (g: Guest) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      first_name: g.first_name,
      last_name: g.last_name,
      position: g.position,
      ready: g.ready,
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId === null) {
        const res = await addGuest(weddingId, form);
        if (res?.error) setError(res.error);
        else {
          setForm(EMPTY_FORM);
          // Refresh server data so the table reflects the new guest.
          window.location.reload();
        }
      } else {
        const res = await updateGuest(editingId, form);
        if (res?.error) setError(res.error);
        else {
          cancelEdit();
          window.location.reload();
        }
      }
    } catch (err) {
      console.error(err);
      setError("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (g: Guest) => {
    const ok = window.confirm(
      `ລຶບແຂກ "${g.title} ${g.first_name} ${g.last_name}" ອອກຈາກລາຍຊື່?`
    );
    if (!ok) return;
    try {
      await deleteGuest(g.id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("ບໍ່ສາມາດລຶບແຂກໄດ້ ກະລຸນາລອງໃໝ່");
    }
  };

  const togglePrinted = async (g: Guest) => {
    setSavingId(g.id);
    try {
      await setGuestPrinted(g.id, g.printed === 0);
      setGuestList((list) =>
        list.map((x) =>
          x.id === g.id ? { ...x, printed: g.printed === 0 ? 1 : 0 } : x
        )
      );
    } catch (err) {
      console.error(err);
      alert("ບໍ່ສາມາດບັນທຶກສະຖານະການພິມໄດ້");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      {/* Add / edit form */}
      <form onSubmit={handleSubmit} className="admin-card">
        <div className="admin-card-title">
          {editingId === null ? (
            <>
              <PlusIcon size={18} /> ເພີ່ມແຂກໃໝ່
            </>
          ) : (
            <>
              <EditIcon size={18} /> ແກ້ໄຂແຂກ
            </>
          )}
        </div>
        {error && <div className="admin-form-error">{error}</div>}
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="gTitle">ຄຳນຳໜ້າ</label>
            <input
              id="gTitle"
              className="admin-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="ທ່ານ / ທ່ານນາງ / ທ້າວ"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="gFirst">ຊື່ *</label>
            <input
              id="gFirst"
              className="admin-input"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="ຊື່ແຂກ"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="gLast">ນາມສະກຸນ</label>
            <input
              id="gLast"
              className="admin-input"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="ນາມສະກຸນ"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="gPosition">ຕຳແໜ່ງ</label>
            <input
              id="gPosition"
              className="admin-input"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="ຄອບຄົວ / ດຣ. / ບໍລິຫານ..."
            />
          </div>
          <div className="admin-field">
            <label htmlFor="gReady">ສະຖານະ</label>
            <input
              id="gReady"
              className="admin-input"
              value={form.ready}
              onChange={(e) => setForm({ ...form, ready: e.target.value })}
              placeholder="ຄອບຄົວ / ພັນລະຍາ / ສາມີ..."
            />
          </div>
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? <SpinnerIcon size={18} /> : <SaveIcon size={18} />}
            {saving
              ? "ກຳລັງບັນທຶກ..."
              : editingId === null
                ? "ເພີ່ມແຂກ"
                : "ບັນທຶກ"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={cancelEdit}
            >
              ຍົກເລີກ
            </button>
          )}
        </div>
      </form>

      {/* Guest list */}
      <div className="admin-card">
        <div className="admin-card-title">
          <ListIcon size={18} /> ລາຍຊື່ແຂກ ({guestList.length} ຄົນ)
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ position: "relative", maxWidth: 320 }}>
            <SearchIcon
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--ap-ink-light)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              className="admin-input"
              style={{ paddingLeft: 36 }}
              placeholder="ຄົ້ນຫາ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="ຄົ້ນຫາແຂກ"
            />
          </div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th className="num">#</th>
              <th>ຄຳນຳໜ້າ</th>
              <th>ຊື່</th>
              <th>ນາມສະກຸນ</th>
              <th>ຕຳແໜ່ງ</th>
              <th>ສະຖານະ</th>
              <th>ການພິມ</th>
              <th>ການຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g, i) => (
              <tr key={g.id}>
                <td className="num">{i + 1}</td>
                <td>{g.title}</td>
                <td>{g.first_name}</td>
                <td>{g.last_name}</td>
                <td>{g.position}</td>
                <td>{g.ready}</td>
                <td>
                  <button
                    className={`print-status-btn ${g.printed ? "printed" : "not-printed"}`}
                    onClick={() => togglePrinted(g)}
                    disabled={savingId === g.id}
                    title="ກົດເພື່ອປ່ຽນສະຖານະການພິມ"
                  >
                    {savingId === g.id ? (
                      <SpinnerIcon size={14} />
                    ) : g.printed ? (
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
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => startEdit(g)}
                      aria-label={`ແກ້ໄຂ ${g.first_name}`}
                    >
                      <EditIcon size={15} />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDelete(g)}
                      aria-label={`ລຶບ ${g.first_name}`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 16 }}>
                  ບໍ່ພົບແຂກ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}