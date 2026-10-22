# ADR-0007: Retry reminder 3x otomatis, manual oleh admin/owner

Status: Accepted — 2026-10-20

## Keputusan
- Retry otomatis: 3x dengan backoff 5 menit, 30 menit, 2 jam.
- Setelah batas, status `failed`.
- Retry manual: hanya `admin` dan `owner`. Setiap percobaan dicatat di
  `ReminderAttempt`.

Nilai `maxAttempts` dan `backoffMinutes` ada di `ReminderPolicy`.

## Konsekuensi
+ Kegagalan sementara tertangani otomatis
+ Retry manual terkontrol dan tercatat
- Perlu monitoring antrean reminder