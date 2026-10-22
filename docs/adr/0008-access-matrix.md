# ADR-0008: Akses diagnosis lewat AccessPolicy

Status: Accepted — 2026-10-20

## Keputusan
- Owner (pemilik hewan): hanya ringkasan diagnosis + catatan umum.
- Admin: read-only metadata rekam medis (tanggal, dokter, jenis), tidak
  boleh mengubah diagnosis.
- Dokter: satu-satunya role yang boleh menulis/mengubah diagnosis, hanya
  untuk pasien yang ditanganinya.

Matrix disimpan di `AccessPolicy` (role x resource x canRead/canWrite).

## Konsekuensi
+ Kebijakan akses bisa diubah admin tanpa deploy
+ Setiap perubahan matrix tercatat di AuditLog
- Perlu UI matrix yang jelas agar tidak salah konfigurasi