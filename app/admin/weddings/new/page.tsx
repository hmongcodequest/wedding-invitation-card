import Link from "next/link";
import WeddingForm from "@/components/admin/WeddingForm";
import { ArrowLeftIcon, PlusIcon } from "@/components/icons";

export default function NewWeddingPage() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/admin/weddings"
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <ArrowLeftIcon size={15} /> ກັບໄປລາຍຊື່ບັດເຊີນ
        </Link>
      </div>
      <h1 className="admin-page-title">
        <PlusIcon size={22} /> ສ້າງບັດເຊີນໃໝ່
      </h1>
      <p className="admin-page-subtitle">
        ປ້ອນຂໍ້ມູນຄູ່ບ່າວສາວ ແລະ ລາຍລະອຽດງານແຕ່ງງານ
      </p>
      <WeddingForm mode="create" />
    </div>
  );
}