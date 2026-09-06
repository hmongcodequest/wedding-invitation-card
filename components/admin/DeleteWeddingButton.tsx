"use client";

import { useState } from "react";
import { deleteWedding } from "@/app/admin/actions";
import { TrashIcon, SpinnerIcon } from "@/components/icons";

interface DeleteWeddingButtonProps {
  weddingId: number;
  label: string;
}

export default function DeleteWeddingButton({
  weddingId,
  label,
}: DeleteWeddingButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm(
      `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບັດເຊີນ "${label}"?\nແຂກ ແລະ ກຳນົດການງານຂອງບັດນີ້ຈະຖືກລຶບໄປນຳ (ບໍ່ສາມາດກູ້ຄືນໄດ້).`
    );
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteWedding(weddingId);
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <button
      className="admin-btn admin-btn-danger admin-btn-sm"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? <SpinnerIcon size={15} /> : <TrashIcon size={15} />}
      {deleting ? "ກຳລັງລຶບ..." : "ລຶບ"}
    </button>
  );
}