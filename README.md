# 💍 ບັດເຊີນງານແຕ່ງງານ (Wedding Invitation Card)

ເວັບແອັບພລິເຄຊັນສຳລັບສ້າງ ແລະ ພິມບັດເຊີນງານແຕ່ງງານເປັນພາສາລາວ ແບບຄລາສສິກ ດ້ວຍສີທອງ-ຄຣີມ — ສ້າງດ້ວຍ **Next.js (App Router) + SQLite (better-sqlite3)**.

---

## ສາລະບານ

1. ຄຸນສົມບັດຫຼັກ
2. ໂຄງສ້າງໄຟລ໌
3. ວິທີເປີດໃຊ້ງານ
4. ຖານຂໍ້ມູນ ແລະ ການຍ້າຍຂໍ້ມູນ
5. ຂະໜາດເຈ້ຍ ແລະ ການພິມ
6. ໄລຍະການພັດທະນາ

---

## 1. ຄຸນສົມບັດຫຼັກ

- **ບັດ 2 ໜ້າ**: ໜ້າປົກ (ຊື່ແຂກ + ຊື່ຄູ່ບ່າວສາວ + ວັນທີ/ສະຖານທີ່) ແລະ ໜ້າເນື້ອໃນ (ກຳນົດເວລາ + ຂໍ້ມູນຕິດຕໍ່ + ລາຍເຊັນ)
- **ຄົ້ນຫາ ແລະ ເລືອກແຂກ**: ພິມຊື່ແຂກເພື່ອຄົ້ນຫາ, ບັດຈະປ່ຽນຊື່ແຂກໃຫ້ອັດຕະໂນມັດ (ແຂກທີ່ພິມແລ້ວຈະຖືກເຊື່ອງ)
- **2 ຂະໜາດເຈ້ຍ**: 📄 A4 (210×297 ມມ) ແລະ 💌 A7 (12.7×17.8 ຊມ / 5×7 ນິ້ວ)
- **ພິມໄດ້ 3 ແບບ**: ພິມໜ້າປົກ, ພິມໜ້າເນື້ອໃນ, ຫຼື ພິມທັງສອງໜ້າ
- **ຂໍ້ມູນຈາກ SQLite**: ຂໍ້ມູນງານແຕ່ງງານ, ລາຍຊື່ແຂກ, ແລະ ກຳນົດເວລາ ເກັບໃນ `data/wedding.db`
- **URL parameters**: ການເລືອກແຂກ ແລະ ຂະໜາດເຈ້ຍ ຖືກບັນທຶກໃສ່ URL (`?guest=1&paper=a7`) ເພື່ອແຊຣ໌ລິ້ງໄດ້
- **ພາສາລາວ 100%**: ຟອນ Noto Sans Lao Looped + Playfair Display (next/font/google)

## 2. ໂຄງສ້າງໄຟລ໌

| ໄຟລ໌ | ລາຍລະອຽດ |
|---|---|
| `app/page.tsx` | ໜ້າຫຼັກ (Server Component) — ອ່ານຂໍ້ມູນຈາກ SQLite ຜ່ານ `lib/data.ts` |
| `app/layout.tsx` | ການຈັດວາງພື້ນຖານ + ຟອນ + metadata ພາສາລາວ |
| `app/globals.css` | ຮູບແບບທັງໝົດ (port ຈາກແອັບເກົ່າ) — ລວມ print CSS A4/A7 |
| `components/card/` | CardViewer, InvitationCard, GuestSearch, SizeInfo |
| `lib/db.ts` | ການເຊື່ອມຕໍ່ SQLite (singleton, WAL) |
| `lib/schema.sql` | ໂຄງສ້າງຕາຕະລາງ (wedding, guests, schedule) |
| `lib/seed.ts` | ສ້າງ schema + ຂໍ້ມູນກຳນົດເວລາເລີ່ມຕົ້ນ |
| `lib/seed-data.ts` | ການໃສ່ຂໍ້ມູນທີ່ປອດໄພສຳລັບ server bundle |
| `lib/migrate.ts` | ການຍ້າຍຂໍ້ມູນຈາກ Excel (ໃຊ້ໂດຍ script ເທົ່ານັ້ນ) |
| `lib/init.ts` | ຮັບປະກັນຖານຂໍ້ມູນພ້ອມໃຊ້ງານ (auto-seed ຈາກ data.json) |
| `lib/data.ts` | ຟັງຊັນອ່ານຂໍ້ມູນ (getWedding, getGuests, getSchedule) |
| `scripts/migrate-data.ts` | ສະຄຣິບຍ້າຍຂໍ້ມູນຈາກ Excel → SQLite (ຮອງຮັບ `--force`) |
| `data/wedding.db` | ຖານຂໍ້ມູນ SQLite (ສ້າງອັດຕະໂນມັດ) |
| `legacy/` | ແອັບເກົ່າ (static HTML) + ແຫຼ່ງຂໍ້ມູນຕົ້ນສະບັບ (Excel, data.json) |

## 3. ວິທີເປີດໃຊ້ງານ

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build production
npm start          # ຮັບໃຊ້ production build
```

## 4. ຖານຂໍ້ມູນ ແລະ ການຍ້າຍຂໍ້ມູນ

- ຖານຂໍ້ມູນ `data/wedding.db` ຈະຖືກສ້າງ ແລະ ໃສ່ຂໍ້ມູນອັດຕະໂນມັດເມື່ອແລ່ນແອັບຄັ້ງທຳອິດ (schema + ກຳນົດເວລາ + ຂໍ້ມູນຈາກ `legacy/data.json`)
- ການຍ້າຍຂໍ້ມູນຈາກ Excel (`legacy/wedding-invitation-card.xlsx`):

```bash
npx tsx scripts/migrate-data.ts          # ຍ້າຍຄັ້ງທຳອິດ
npx tsx scripts/migrate-data.ts --force  # ຍ້າຍໃໝ່ (ລຶບຂໍ້ມູນເກົ່າ)
```

> ⚠️ ຖ້າແລ່ນ `--force` ສະຖານະ `printed` ຂອງແຂກຈະຖືກຣີເຊັດເປັນ 0.

## 5. ຂະໜາດເຈ້ຍ ແລະ ການພິມ

| ຂະໜາດ | ຕັ້ງຄ່າເຈ້ຍໃນກ່ອງພິມ | ຂອບ (Margin) |
|---|---|---|
| A4 | A4 (210×297 ມມ) | 12 ມມ |
| A7 | 12.7×17.8 ຊມ (5×7 ນິ້ວ) | **0 ມມ** |

- ກົດ **🖨️ ພິມໜ້າປົກ** ຫຼື **🖨️ ພິມໜ້າເນື້ອໃນ** ເພື່ອພິມແຕ່ລະໜ້າ
- ກົດ **🖨️ ພິມທັງສອງໜ້າ** ເພື່ອພິມຄົບທັງສອງໜ້າ
- ເປີດ "Background graphics" ໃນກ່ອງພິມ ເພື່ອໃຫ້ສີພື້ນຫຼັງ ແລະ ສີທອງອອກຄົບ

## 6. ໄລຍະການພັດທະນາ

- ✅ ໄລຍະທີ 1: ຖານ SQLite + ຍ້າຍຂໍ້ມູນ (Excel + data.json)
- ✅ ໄລຍະທີ 2: ໜ້າບັດເຊີນ (React) — ກວດສອບການສະແດງຜົນ ແລະ ການພິມ
- ⏳ ໄລຍະທີ 3: ໜ້າຈັດການລາຍຊື່ແຂກ (`/guests`)
- ⏳ ໄລຍະທີ 4: API routes
- ⏳ ໄລຍະທີ 5: ກວດ print CSS A4/A7
- ⏳ ໄລຍະທີ 6: ການ deploy

---

*ສ້າງດ້ວຍ Next.js 16 (App Router) + better-sqlite3 — ຂໍ້ມູນທັງໝົດເກັບໃນ SQLite ທ້ອງຖິ່ນ.*