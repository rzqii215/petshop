# ADR-0002: Satu lokasi untuk MVP, locationId disiapkan

Status: Accepted — 2026-10-20

## Konteks
BRD belum mengonfirmasi kebutuhan multi-cabang. Menambah cabang setelah
rilis mahal jika skema belum menyiapkan scope.

## Keputusan
MVP berjalan dengan satu `Location` default. Semua model yang relevan
(`Service`, `Appointment`, `Boarding`, staff `User`) memiliki `locationId`
opsional. Multi-cabang di balik flag `MULTI_LOCATION` default mati.

## Konsekuensi
+ Tidak perlu migrasi besar saat ekspansi
+ Query tetap sederhana untuk satu lokasi
- Ada field `locationId` yang belum terpakai sampai flag dinyalakan