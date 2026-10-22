# ADR-0009: Akses dokter berbasis alokasi booking

Status: Accepted — 2026-10-20

## Keputusan
Dokter hanya bisa mengakses rekam medis pasien yang booking-nya
dialokasikan ke dirinya (`Appointment.doctorId = user.id`). Reassignment
dilakukan admin; dokter pengganti otomatis dapat akses setelah alokasi.
Riwayat akses dicatat di `AuditLog`.

## Konsekuensi
+ Least privilege
+ Reassignment tercatat
- Admin harus disiplin mengalokasikan booking