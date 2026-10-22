# ADR-0003: Slot dihitung dinamis, bukan entitas jadwal

Status: Accepted — 2026-10-20

## Konteks
Menyimpan slot sebagai baris database membuat data cepat basi saat jam
operasional, durasi layanan, atau libur berubah.

## Keputusan
Slot dihitung dari `OperatingHours` + `ScheduleException` + `Service.durationMinutes`
+ `bufferMinutes` + booking aktif. Interval default 15 menit, bisa override
per layanan lewat `Service.slotIntervalMin`.

## Konsekuensi
+ Tidak ada data slot basi
+ Perubahan jam langsung berlaku
- Perhitungan slot lebih mahal; perlu cache per (location, date, service)
- Penanganan booking bersamaan butuh constraint DB (unique pada staff+start)