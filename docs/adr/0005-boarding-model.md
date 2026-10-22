# ADR-0005: Model boarding 1 hewan per unit

Status: Accepted — 2026-10-20

## Keputusan
- 1 `BoardingUnit` menampung 1 hewan (`capacity = 1`).
- `RoomType` (small/medium/large) punya `pricePerNightIdr`.
- Layanan tambahan (mandi, makan premium) lewat `BoardingAddOn` terpisah.
- Pajak PB1 10% disimpan di `SiteSetting:tax.rate` dan ditampilkan sebagai
  baris terpisah di total.

## Konsekuensi
+ Kapasitas jelas dan mudah dihitung
+ Pajak transparan ke customer
- Jika nanti butuh multi-hewan per unit, perlu migrasi skema