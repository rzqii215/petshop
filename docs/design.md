# Pedoman UI/UX Petshop

## Arah visual
Hangat, ramah, profesional, dan tepercaya untuk layanan kesehatan hewan. Bergaya klinik lokal, bukan produk SaaS generik.
- Design tokens (warna, tipografi, spasi, radius, bayangan) didefinisikan sekali di config Tailwind/CSS variables dan dipakai konsisten.
- Palet: satu warna primer berkarakter (teal-sage atau terracotta), satu aksen, netral hangat (krem, bukan putih kebiruan), warna semantik dengan kontras WCAG AA.
- Tipografi: font heading berkarakter (misalnya Fraunces atau Bricolage Grotesque) dipadukan font body yang mudah dibaca (misalnya Plus Jakarta Sans). Skala 5-6 ukuran.

## Hal yang dihindari
- Gradien ungu-biru, mesh gradient, glow, blob dekoratif
- Glassmorphism dan backdrop-blur berlebihan
- Hero generik (judul besar, subjudul, dua tombol, mockup mengambang)
- Grid tiga kartu identik dengan ikon dalam lingkaran berwarna
- Emoji sebagai ikon (gunakan satu set ikon, misalnya lucide)
- Radius dan shadow yang sama di semua elemen
- Teks dan data karangan: lorem ipsum, testimoni palsu, statistik rekaan, logo mitra palsu
- Copywriting klise ("revolusioner", "seamless", "solusi terbaik untuk sahabat berbulu")
- Animasi berlebihan; animasi hanya untuk umpan balik dan menghormati prefers-reduced-motion
- Foto stok generik; gunakan placeholder bertanda TODO sampai foto asli tersedia

## Tata letak
- Beranda menonjolkan kebutuhan utama: booking dokter, jadwal dokter hari ini, penitipan, kontak WhatsApp, alamat dan jam buka.
- Mobile-first, target sentuh minimal 44px, tanpa scroll horizontal.
- Satu aksi utama per layar, spasi konsisten (grid 4/8px).
- Bahasa Indonesia yang natural dan spesifik, misalnya "Pilih jam kunjungan untuk Mochi".

## Alur kunci
- Slot booking: tanggal sebagai strip yang bisa digeser, slot sebagai chip (tersedia, penuh, dipilih), hari dokter tidak praktik diberi keterangan, ringkasan booking terlihat sebelum konfirmasi.
- Penitipan: pemilih rentang tanggal dengan jumlah malam dan total biaya langsung terbarui, alternatif tanggal atau tipe kamar jika penuh.
- Rekam medis: timeline per hewan, panduan perawatan ditampilkan menonjol, file hasil sebagai kartu dengan pratinjau dan unduh.

## Dashboard
- Admin dan dokter: padat informasi, tabel rapi dengan filter, pencarian, badge status semantik.
- Owner: angka kunci, tren dengan grafik sederhana yang jujur, perbandingan periode, read-only.

## State wajib
Skeleton loading, empty state dengan aksi lanjutan, error state yang bisa dicoba ulang, konfirmasi aksi destruktif, toast, validasi inline, halaman 404 dan 403 yang dirancang.

## Aksesibilitas
Kontras WCAG AA, fokus keyboard terlihat, label form terhubung, alt gambar bermakna, tanpa layout shift. Komponen dipakai ulang: Button, Input, Badge, Card, DataTable, SlotPicker, DateRangePicker, Timeline, EmptyState.