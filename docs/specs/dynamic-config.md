# Spesifikasi Konfigurasi Dinamis — Petshop Terpadu

Status: Draft
Terakhir diperbarui: 2026-10-20

## 1. Tujuan

Semua nilai bisnis yang berubah karena operasional (jam buka, harga, hold
booking, pajak, retensi, template email) harus bisa diubah dari admin tanpa
deploy ulang. Hanya hal yang menyangkut keamanan, skema, dan auth flow yang
tetap di kode/env.

## 2. Tiga Lapis Konfigurasi

| Lapis | Isi | Contoh |
|---|---|---|
| Tier 1: SiteSetting | Key-value bertipe, satu nilai | site.name, tax.rate, retention.medicalYears |
| Tier 2: Tabel domain | Relasi dan koleksi | Location, OperatingHours, Service, BookingPolicy |
| Tier 3: FeatureFlag | Toggle fitur | MULTI_LOCATION, REMINDER_H3, DEPOSIT |

Prinsip:
- Default hanya di `docs/data/config-defaults.json`, bukan di kode.
- Kode membaca lewat `ConfigService`, tidak pernah query langsung.
- Setiap perubahan dicatat di `AuditLog` (before/after).
- Cache per group, invalidasi via tag saat admin menyimpan.

## 3. Model Data yang Diperlukan

Model Prisma berikut wajib ada di Fase 1. Detail field ada di ADR terkait.

- `SiteSetting` (key, value Json, type, group, isPublic, updatedAt)
- `Location` (name, address, phone, whatsapp, timezone, isDefault, isActive)
- `OperatingHours` (locationId, dayOfWeek, openMinute, closeMinute, isClosed)
- `ScheduleException` (locationId, date, reason, isClosed, open/close override)
- `Service` (locationId?, type, name, durationMinutes, bufferMinutes, slotIntervalMin, priceIdr)
- `BookingPolicy` (type, holdMinutes, cancelWindowHours, noShowPenaltyIdr, requiresConfirmation)
- `ReminderPolicy` (kind, offsetHours, channel, maxAttempts, backoffMinutes, isActive)
- `AccessPolicy` (role, resource, canRead, canWrite, requiresConsent)
- `FormFieldConfig` (entity, field, label, isRequired, isVisible, order, validation)
- `FeatureFlag` (key, enabled, description)
- `AuditLog` (actorId, action, entity, entityId, before, after, createdAt)

## 4. Peta 13 Area Dinamis

| # | Area | Sumber | Ubah dari Admin |
|---|---|---|---|
| 1 | Identitas petshop | SiteSetting (identity) + Location | Nama, logo, WA, alamat, jam |
| 2 | Multi-cabang | Location + flag MULTI_LOCATION | Tambah/ubah cabang |
| 3 | Jadwal layanan | OperatingHours, ScheduleException, Service | Jam, libur, durasi, buffer |
| 4 | Hold/konfirmasi/batal | BookingPolicy | Hold, cancel window, no-show |
| 5 | Boarding | RoomType, BoardingUnit, BoardingAddOn, tax.rate | Tarif, add-on, pajak |
| 6 | Email/verifikasi/reminder | SiteSetting (email) + ReminderPolicy | Pengirim, wajib verifikasi, H-1/H-3 |
| 7 | Retry reminder | ReminderPolicy.maxAttempts/backoff | Jumlah retry, backoff |
| 8 | Akses diagnosis | AccessPolicy | Matrix role x resource |
| 9 | Alokasi dokter | Appointment.doctorId | Reassign dari admin |
| 10 | Field profil hewan | FormFieldConfig | Wajib/opsional per field |
| 11 | Retensi rekam medis | SiteSetting (retention, file) | Tahun retensi, batas file |
| 12 | Infra publik | SiteSetting (ops) | Domain publik, email pengirim |
| 13 | Varian produk | Product -> ProductVariant | Varian, harga, SKU |

## 5. Alur Baca & Invalidasi

```
Admin ubah setting
  -> validasi Zod per type
  -> tulis DB + AuditLog
  -> invalidateCache(tag: config:${group})
  -> revalidateTag di Next.js
  -> request berikutnya baca versi baru
```

Aturan implementasi:
- Komponen tidak boleh query `SiteSetting` langsung. Selalu lewat service.
- Service layer menyediakan `get<T>(key)`, `getByGroup(group)`, `getPolicy(type)`.
- Cache memakai tag `config:${group}`; saat admin menyimpan, tag di-invalidate.
- TTL default 300 detik sebagai jaring pengaman jika invalidasi gagal.
- Nilai `isPublic: false` tidak boleh dikirim ke client.

## 6. Yang Tetap Statis

| Hal | Alasan |
|---|---|
| Skema DB (kolom, enum) | Migrasi bukan operasi runtime |
| Kredensial (DB URL, R2 key, Resend key) | Di env, tidak di DB |
| Auth flow (Better Auth config) | Di kode |
| Enum Role, AppointmentType, BookingStatus | Ubah butuh migrasi |
| Strategi cache | Di kode |
| Endpoint cron + secret | Di kode + env |

Aturan: yang diubah operasional -> dinamis. Yang diubah developer -> kode.

## 7. Admin UI yang Wajib Ada (Fase 2)

- Settings -> Identity (nama, logo, alamat, WA, jam)
- Settings -> Locations (+ jam operasional, kalender libur)
- Settings -> Services (durasi, buffer, harga, slot interval)
- Settings -> Policies (hold, cancel window, no-show, retry, pajak, retensi)
- Settings -> Form Builder (field profil hewan)
- Settings -> Feature Flags (MULTI_LOCATION, REMINDER_H3, DEPOSIT)
- Settings -> Access Matrix (role x resource)
- Audit Log viewer (filter by entity, tampilkan diff before/after)

Setiap form validasi dengan Zod yang sama dengan service layer.

## 8. Sumber Default

Nilai default untuk semua tier ada di `docs/data/config-defaults.json`.
File itu adalah **data referensi**, bukan kode. Saat Fase 1 dimulai, file
tersebut dikonversi menjadi seeder (`prisma/seed.ts`) yang meng-upsert ke DB.

Aturan:
- Tidak ada nilai bisnis yang di-hardcode di service atau komponen.
- Jika butuh nilai baru, tambahkan ke `config-defaults.json` dulu, baru
  tambahkan pembacaan di service.
- Seeder bersifat idempoten: jalankan berulang kali aman.
- Seeder hanya meng-insert key yang belum ada; tidak menimpa nilai yang
  sudah diubah admin.