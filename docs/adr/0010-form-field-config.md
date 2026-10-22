# ADR-0010: Field profil hewan dikonfigurasi via FormFieldConfig

Status: Accepted — 2026-10-20

## Keputusan
- Wajib default: nama, spesies.
- Opsional: ras, tanggal lahir, berat, foto, alergi, catatan.
- Berat disimpan sebagai `weightGrams` (integer), ditampilkan dalam kg
  dengan 1 desimal.
- Wajib/opsional/tampil per field diatur di `FormFieldConfig`, bukan
  hardcode di komponen.

## Konsekuensi
+ Admin bisa ubah field wajib tanpa deploy
+ Satuan konsisten di DB
- Validasi harus baca config, bukan statis