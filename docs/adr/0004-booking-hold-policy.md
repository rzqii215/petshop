# ADR-0004: Hold booking, konfirmasi, dan pembatalan

Status: Accepted — 2026-10-20

## Keputusan
- Hold slot: 30 menit (klinik/grooming), 60 menit (boarding). Cron
  `expire-pending` membatalkan otomatis.
- Konfirmasi: manual oleh admin (MVP tanpa pembayaran online).
- Pembatalan customer: sampai H-1 20:00 WIB (klinik/grooming), H-3 (boarding).
- No-show: dicatat admin, tanpa penalti otomatis.

Semua nilai di atas disimpan di `BookingPolicy` per `AppointmentType` dan
bisa diubah dari admin.

## Konsekuensi
+ Operasional bisa sesuaikan kebijakan tanpa deploy
- Perlu cron dan audit perubahan kebijakan