# ADR-0006: Verifikasi email wajib, reminder H-1 default

Status: Accepted — 2026-10-20

## Keputusan
- Pengirim email dari `SiteSetting:email.from`, default `noreply@petshop.example`
  via Resend.
- Verifikasi email wajib untuk customer. Reset password wajib via email.
- Reminder H-1 untuk appointment dan boarding. H-3 hanya untuk boarding,
  di balik flag `REMINDER_H3` default mati.
- Konfigurasi per jenis ada di `ReminderPolicy`.

## Konsekuensi
+ Kebijakan reminder bisa diubah admin
+ Verifikasi email menekan spam dan akun palsu
- Alur registrasi sedikit lebih panjang