import { RulerIcon, LightbulbIcon } from "@/components/icons";

interface SizeInfoProps {
  paperSize: "a4" | "a7";
}

export default function SizeInfo({ paperSize }: SizeInfoProps) {
  const isA7 = paperSize === "a7";

  return (
    <div className="size-info-section">
      <div className="size-info-card">
        <div className="size-info-title">
          <RulerIcon size={18} /> ຂະໜາດບັດເຊີນ
        </div>
        <div className="size-info-grid">
          <div className="size-info-item">
            <div className="size-info-label">ຂະໜາດເຈ້ຍ</div>
            <div className="size-info-value">
              {isA7 ? "A7 (12.7 × 17.8 ຊມ / 5 × 7 ນິ້ວ)" : "A4 (210 × 297 ມມ)"}
            </div>
          </div>
          <div className="size-info-item">
            <div className="size-info-label">ຈຳນວນໜ້າ</div>
            <div className="size-info-value">2 ໜ້າ (ປົກ + ເນື້ອໃນ)</div>
          </div>
          <div className="size-info-item">
            <div className="size-info-label">ການພິມ</div>
            <div className="size-info-value">ພິມສີ ຫຼື ຂາວ-ດຳ</div>
          </div>
          <div className="size-info-item">
            <div className="size-info-label">ທິດທາງ</div>
            <div className="size-info-value">ຕັ້ງ (Portrait)</div>
          </div>
        </div>
        <div className="size-info-note">
          {isA7 ? (
            <>
              <LightbulbIcon size={16} /> <strong>ຄຳແນະນຳ:</strong> ບັດຂະໜາດ 12.7×17.8 ຊມ (5×7
              ນິ້ວ) ເປັນຂະໜາດບັດເຊີນຄລາສສິກ. ເມື່ອພິມ, ກະລຸນາຕັ້ງຄ່າເຈ້ຍເປັນ
              12.7×17.8 ຊມ (5×7 ນິ້ວ) ແລະ ຂອບໜ້າເຈ້ຍ (margin) 0 ມມ ເພື່ອໃຫ້ໄດ້ບັດຂະໜາດເຕັມ.
            </>
          ) : (
            <>
              <LightbulbIcon size={16} /> <strong>ຄຳແນະນຳ:</strong> ບັດເຊີນຖືກອອກແບບສຳລັບພິມໃສ່ເຈ້ຍ A4
              ແນວຕັ້ງ. ເມື່ອພິມ, ກະລຸນາຕັ້ງຄ່າເຈ້ຍເປັນ A4 ແລະ ກຳນົດຂອບໜ້າເຈ້ຍ
              (margin) ປະມານ 12 ມມ ເພື່ອໃຫ້ໄດ້ຜົນງານທີ່ສວຍງາມທີ່ສຸດ. ຖ້າຕ້ອງການຂະໜາດນ້ອຍກວ່າ
              (ເຊັ່ນ A5), ສາມາດຕັ້ງຄ່າການພິມໃຫ້ຫຼຸດຂະໜາດລົງ 50% ໄດ້.
            </>
          )}
        </div>
      </div>
    </div>
  );
}