
---

## 📄 Bagian 2 — `docs/adr/0001-…` s/d `0011-…`

**Lokasi:** `petshop/docs/adr/` (buat folder `adr/` di dalam `docs/`)

### `docs/adr/0001-config-in-db.md`

```markdown
# ADR-0001: Konfigurasi bisnis disimpan di database

Status: Accepted — 2026-10-20

## Konteks
Nilai bisnis (jam buka, hold time, pajak, retensi, template email) sering
berubah dan tidak boleh butuh deploy ulang.

## Keputusan
Semua setting bisnis disimpan di `SiteSetting` dan tabel domain terstruktur
(`BookingPolicy`, `ReminderPolicy`, `AccessPolicy`, `FormFieldConfig`,
`FeatureFlag`). Kode hanya membaca lewat `ConfigService`. Kredensial tetap
di env.

## Konsekuensi
+ Operasional bisa ubah tanpa deploy
+ Perubahan tercatat di AuditLog
- Perlu admin UI untuk setiap setting
- Perlu strategi cache & invalidasi