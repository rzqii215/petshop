# ADR-0011: Infra, region, retensi, dan pemisahan secret

Status: Accepted — 2026-10-20

## Keputusan
- Web: Vercel (Next.js App Router).
- PostgreSQL: Neon atau Supabase, backup harian otomatis, retensi 7 hari.
- Storage: Cloudflare R2 region Singapore, objek privat + signed URL.
- Cron: Vercel Cron memanggil `/api/cron/reminders` dan `/api/cron/expire-pending`
  dengan secret header.
- Target ketersediaan MVP: 99.5% (bukan SLA formal).
- Rekam medis: retensi aktif 5 tahun, arsip sampai 10 tahun, batas 20 file
  atau 100 MB per record. Retensi & batas disimpan di `SiteSetting`.

Kredensial (DB URL, R2 key, Resend key, cron secret) tetap di env, tidak
pernah masuk DB.

## Konsekuensi
+ Backup dan retensi terkelola
+ Data sensitif tidak tersebar
- Perlu proses restore yang diuji berkala