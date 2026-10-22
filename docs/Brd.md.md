PERAN
Kamu adalah senior full-stack engineer sekaligus product designer. Kamu akan merancang dan membangun sistem informasi petshop terpadu (toko, klinik dokter hewan, grooming, penitipan hewan) untuk pasar Indonesia.

MODE KERJA
Sekarang tahap PLANNING. Jangan menulis kode aplikasi dulu. Hasilkan rencana implementasi yang detail, bisa direview, dan dibagi per fase. Jika ada hal ambigu yang mengubah arsitektur, tuliskan sebagai "Pertanyaan Terbuka" di akhir rencana. Jangan menebak diam-diam dan jangan menambah fitur di luar lingkup.

========================================
1. TUJUAN PRODUK
========================================
Satu platform web untuk:
- Pelanggan (pet owner): booking online klinik, grooming, dan penitipan; menyimpan data hewan; melihat riwayat diagnosis, panduan perawatan, dan hasil pemeriksaan (foto/PDF); menerima pengingat otomatis.
- Admin: mengelola seluruh data operasional.
- Dokter: melihat jadwal dan pasien, menulis diagnosis, panduan, tanggal kontrol, dan mengunggah hasil pemeriksaan.
- Owner: memantau kondisi bisnis secara menyeluruh (read-only).

========================================
2. TECH STACK (WAJIB DIIKUTI)
========================================
- Next.js (App Router) full-stack, TypeScript strict. Tanpa backend Node terpisah.
- Tailwind CSS + shadcn/ui (dikustomisasi, lihat bagian Desain).
- PostgreSQL + Prisma (migrasi dan seed).
- Auth: Auth.js atau Better Auth (pilih satu, jelaskan alasannya). Email+password dan Google. Role disimpan di tabel users.
- Validasi: Zod di server untuk semua input. React Hook Form di client.
- Penyimpanan file: object storage PRIVATE (Cloudflare R2 / S3 / Supabase Storage) dengan signed URL berumur pendek.
- Email: Resend atau Nodemailer (SMTP). Abstraksikan di balik interface agar WhatsApp bisa ditambah kemudian.
- Pengingat: cron job memanggil endpoint terproteksi (secret header).
- Tanggal dan waktu: simpan UTC di database, tampilkan Asia/Jakarta (WIB). Gunakan satu library tanggal secara konsisten.

========================================
3. ROLE DAN HAK AKSES
========================================
- customer: kelola profil dan hewan miliknya, booking, lihat rekam medis hewan miliknya saja.
- admin: CRUD produk, dokter, jadwal, layanan, kamar, booking, pelanggan; lihat status pengingat.
- doctor: lihat jadwal dan pasien yang ditangani, buat/ubah rekam medis, unggah file hasil.
- owner: dashboard ringkasan read-only. Tidak bisa mengubah data apa pun. Secara default TIDAK melihat isi diagnosis, hanya agregat (ini masih pertanyaan terbuka untuk client, jadikan konfigurasi).

Aturan keamanan:
- Proteksi halaman lewat middleware, DAN verifikasi ulang role serta kepemilikan data di setiap Server Action / Route Handler / query. Middleware saja tidak cukup.
- Setiap query rekam medis dan file wajib difilter berdasarkan kepemilikan hewan (pet.ownerId = session.user.id) kecuali role staf berwenang.
- Pelanggan tidak boleh bisa mengakses data hewan lain dengan mengganti ID di URL (cegah IDOR).

========================================
4. MODUL DAN KEBUTUHAN FUNGSIONAL
========================================
4.1 Akun dan hewan
- Satu akun punya banyak hewan. Data hewan: nama, jenis, ras, tanggal lahir, jenis kelamin, berat, alergi/catatan khusus, foto.
- Semua booking dan rekam medis terhubung ke hewan, bukan hanya ke akun.

4.2 Booking klinik dan grooming
- Tampilkan daftar dokter beserta hari dan jam praktik.
- Alur: pilih hewan, pilih layanan, pilih dokter (atau "siapa saja yang tersedia"), pilih tanggal, pilih slot, konfirmasi.
- Slot dihitung saat dibuka, TIDAK disimpan: jadwal mingguan dokter dikurangi pengecualian (cuti/libur) dikurangi booking aktif. Jelaskan algoritmenya di rencana.
- Cegah double booking di level database (unique constraint dan/atau transaksi dengan locking), bukan hanya pengecekan di UI.
- Grooming: slot berdasarkan durasi layanan dan jumlah groomer yang tersedia.
- Status: pending, confirmed, completed, cancelled, no_show. Pending kedaluwarsa otomatis setelah batas waktu yang bisa dikonfigurasi.
- Admin bisa membuat booking untuk pelanggan walk-in.

4.3 Penitipan hewan
- Tipe kamar (kapasitas, harga per malam, fasilitas) dan unit kamar.
- Cek ketersediaan berdasarkan rentang tanggal dengan logika overlap: bentrok jika existing.checkIn < newCheckOut DAN existing.checkOut > newCheckIn. Perjelas aturan hari check-out (malam, bukan hari).
- Catatan khusus (makanan, obat, alergi, kebiasaan), layanan tambahan (mis. grooming), total biaya otomatis.
- Status: pending, confirmed, checked_in, checked_out, cancelled.

4.4 Rekam medis
- Dokter mengisi: keluhan, diagnosis, tindakan, resep, panduan perawatan untuk pemilik (obat, makanan, larangan, tanda bahaya), tanggal kontrol berikutnya.
- Lampiran: foto (JPG/PNG) dan PDF, maks 10 MB per file, validasi tipe berdasarkan isi file (magic bytes), bukan hanya ekstensi.
- Pelanggan melihat riwayat per hewan dalam bentuk timeline, termasuk panduan dan file.
- Perubahan rekam medis dicatat di audit log (siapa, kapan, apa).

4.5 Pengingat otomatis
- Saat follow_up_date disimpan, sistem otomatis membuat baris reminders (default H-3 dan H-1, bisa dikonfigurasi).
- Pengingat juga dibuat untuk booking klinik, grooming, dan penitipan.
- Cron harian: ambil reminders pending yang jatuh tempo, kirim email, tandai sent/failed, retry untuk yang gagal.
- Idempoten: pengingat yang sama tidak boleh terkirim dua kali. Tidak mengirim untuk booking yang dibatalkan.
- Admin bisa melihat daftar pengingat beserta statusnya.

4.6 Katalog produk
- Produk: nama, kategori (anjing, kucing, dll.), merek, ukuran/varian, harga, foto, status tersedia.
- Pencarian dan filter. Pemesanan MVP lewat tautan WhatsApp ke toko (pesan sudah terisi nama produk). Tanpa keranjang dan payment gateway di MVP.

4.7 Dashboard
- Admin: kelola semua modul, tabel dengan pencarian, filter, dan pagination server-side.
- Owner: ringkasan kunjungan klinik, booking grooming, okupansi penitipan, tren booking, pelanggan baru; filter harian/mingguan/bulanan. Read-only.

========================================
5. DI LUAR LINGKUP MVP
========================================
Checkout online dan payment gateway, WhatsApp otomatis, template panduan per penyakit, laporan keuangan lanjutan, manajemen stok otomatis, aplikasi mobile. Rancang kode agar ini bisa ditambah tanpa merombak (service layer terpisah, channel notifikasi berbasis interface).

========================================
6. ARSITEKTUR KODE
========================================
- Route groups: (public), (auth), (customer), (dashboard) dengan layout masing-masing.
- Semua logika bisnis di src/server/services (appointment, boarding, medical-record, reminder, product, notification). Server Actions dan Route Handlers hanya memanggil service.
- Skema Zod terpusat di src/lib/validations dan dipakai ulang di client dan server.
- Prisma client singleton. Hindari N+1 query.
- Error handling konsisten: error domain yang jelas (mis. SlotAlreadyTaken) dipetakan ke pesan yang ramah pengguna.
- Environment variable divalidasi saat startup. Sediakan .env.example. Jangan pernah commit secret.
- Tulis test untuk logika yang rawan bug: perhitungan slot, overlap kamar, pembuatan reminder, otorisasi akses rekam medis.

========================================
7. DESAIN UI/UX (BAGIAN PALING PENTING, IKUTI KETAT)
========================================
Tujuan: antarmuka yang terasa dirancang oleh desainer manusia untuk klinik hewan lokal yang hangat dan tepercaya, BUKAN template generik buatan AI.

7.1 Arah visual
- Kesan: hangat, ramah, profesional, bisa dipercaya untuk urusan kesehatan hewan. Bukan "startup SaaS".
- Tentukan dan dokumentasikan design tokens di awal (warna, tipografi, spasi, radius, bayangan) di tailwind config / CSS variables, lalu pakai konsisten. Tidak ada warna atau ukuran "asal" di komponen.
- Palet: satu warna primer yang berkarakter (usulan: hijau teal-sage atau terracotta hangat), satu aksen, netral hangat (off-white krem, bukan putih biru-dingin), plus warna semantik (sukses, peringatan, bahaya) yang kontrasnya lolos WCAG AA. Maksimal 1 primer + 1 aksen.
- Tipografi: pasangkan satu font heading dengan karakter (mis. Fraunces, Bricolage Grotesque, atau serupa) dengan satu font body yang sangat terbaca (mis. Plus Jakarta Sans). Jangan memakai satu font default untuk semuanya. Skala tipografi jelas (maks 5-6 ukuran), line-height nyaman untuk bahasa Indonesia.

7.2 DILARANG (ciri "AI slop")
- Gradien ungu-biru, gradien mesh, glow, dan blob dekoratif tanpa fungsi.
- Glassmorphism dan backdrop-blur di mana-mana.
- Hero generik: judul besar + subjudul + dua tombol + mockup mengambang.
- Grid tiga kartu identik dengan ikon di dalam lingkaran berwarna untuk semua bagian.
- Emoji sebagai ikon atau dekorasi. Gunakan satu set ikon konsisten (lucide, stroke seragam).
- rounded-2xl + shadow-lg pada semua elemen. Variasikan radius dan elevasi dengan alasan fungsional (kartu, input, tombol punya aturan sendiri).
- Teks placeholder seperti "Lorem ipsum", "Feature One", "Your Company", testimoni palsu, statistik karangan ("10.000+ pelanggan"), logo mitra palsu.
- Copywriting klise AI: "Revolusioner", "Seamless", "Elevate", "Unleash", "Solusi terbaik untuk sahabat berbulu Anda".
- Animasi berlebihan: fade-in semua section, hover scale di semua kartu, efek parallax. Animasi hanya untuk memberi umpan balik (tombol, transisi slot, loading) dan hormati prefers-reduced-motion.
- Gambar stok generik. Jika foto belum ada, pakai placeholder netral yang jelas (blok warna dengan label) dan tandai TODO untuk diganti foto asli petshop. Jangan hotlink gambar acak.

7.3 Prinsip tata letak
- Komposisi berbasis konten, bukan template: halaman beranda menonjolkan tiga hal yang dicari pelanggan (booking dokter, jadwal dokter hari ini, penitipan), dengan jalur cepat ke WhatsApp dan alamat/jam buka toko.
- Hirarki visual jelas: satu aksi utama per layar. Spasi lega dan konsisten (grid 4/8px). Hindari semua elemen berbobot sama.
- Mobile-first. Mayoritas pelanggan Indonesia memakai ponsel. Target sentuh minimal 44px, tombol aksi utama mudah dijangkau, tidak ada scroll horizontal.
- Bahasa antarmuka: Bahasa Indonesia yang natural dan ringkas. Tulis microcopy asli (label, pesan error, empty state, konfirmasi) yang spesifik, bukan generik. Contoh baik: "Pilih jam kunjungan untuk Mochi", bukan "Select a time slot".

7.4 Alur kunci yang harus terasa matang
- Pemilih slot booking: tampilkan tanggal sebagai strip yang bisa digeser, slot sebagai chip dengan status jelas (tersedia, penuh, dipilih), tampilkan hari dokter tidak praktik dengan keterangan, bukan sekadar disabled tanpa penjelasan. Ringkasan booking tetap terlihat sebelum konfirmasi.
- Pemilih tanggal penitipan: rentang check-in/check-out dengan jumlah malam dan total biaya yang langsung diperbarui, plus pesan jelas jika kamar penuh beserta alternatif tanggal/tipe kamar terdekat.
- Riwayat rekam medis: timeline per hewan, panduan perawatan ditampilkan menonjol dan mudah dibaca (bukan dinding teks), file hasil tampil sebagai kartu dengan pratinjau dan tombol unduh.
- Pilih hewan: kartu hewan dengan foto/inisial, mudah berganti jika punya lebih dari satu.

7.5 Dashboard (admin, dokter, owner)
- Prioritaskan fungsi dan kepadatan informasi: tabel yang rapi, filter, pencarian, status berbadge dengan warna semantik konsisten, aksi massal bila perlu. Bukan kartu dekoratif.
- Dashboard owner: angka kunci di atas, tren dengan grafik sederhana yang jujur (sumbu jelas, tanpa 3D, tanpa dekorasi), perbandingan periode. Setiap angka punya label dan periode yang tegas.
- Dashboard dokter: "pasien hari ini" sebagai pusat, akses cepat ke form rekam medis.

7.6 Status UI yang wajib ada (sering terlupa)
- Loading (skeleton, bukan spinner kosong), empty state yang membantu dengan aksi lanjutan, error state yang ramah dan bisa dicoba ulang, konfirmasi untuk aksi destruktif, toast untuk umpan balik singkat, state disabled/validasi inline pada form.
- Halaman 404 dan 403 yang dirancang, bukan bawaan.

7.7 Aksesibilitas dan kualitas
- Kontras WCAG AA, fokus keyboard terlihat, label form terhubung, aria untuk komponen interaktif, urutan tab logis. Gambar punya alt yang bermakna.
- Tidak ada layout shift saat memuat (tentukan dimensi gambar). Gunakan next/image dan font loading yang benar.
- Satu sistem komponen: buat dan pakai ulang komponen (Button, Input, Badge, Card, DataTable, SlotPicker, DateRangePicker, Timeline, EmptyState). Hindari menyalin kelas Tailwind panjang berulang-ulang.

========================================
8. FORMAT OUTPUT RENCANA YANG DIMINTA
========================================
Susun rencana dengan urutan berikut:
1. Ringkasan pemahaman dan asumsi.
2. Keputusan teknis dan alasannya (auth library, storage, email, cron, library tanggal).
3. Skema database lengkap (Prisma) beserta relasi, index, dan constraint untuk mencegah double booking.
4. Struktur folder final.
5. Algoritma slot dokter, overlap kamar, dan pembuatan/pengiriman reminder (langkah demi langkah).
6. Matriks hak akses (role x resource x aksi) dan strategi pencegahan IDOR.
7. Design system: token warna, tipografi, spasi, radius, daftar komponen, dan wireframe tekstual untuk halaman kunci (beranda, booking klinik, booking penitipan, riwayat rekam medis, dashboard admin, dashboard owner).
8. Rencana fase dengan urutan: (1) fondasi, auth, data hewan; (2) jadwal dokter dan booking klinik/grooming; (3) rekam medis, upload, riwayat; (4) penitipan; (5) pengingat, katalog, dashboard admin dan owner; (6) pengujian dan rilis. Setiap fase memuat daftar tugas, file yang dibuat, dan kriteria selesai yang bisa diuji.
9. Strategi pengujian dan daftar test case kritis.
10. Risiko teknis dan mitigasinya.
11. Pertanyaan Terbuka untuk client.

========================================
9. KRITERIA PENERIMAAN
========================================
- Pelanggan bisa daftar, menambah hewan, dan booking klinik, grooming, dan penitipan tanpa bantuan staf.
- Tidak ada dua booking aktif pada slot atau kamar yang sama, termasuk saat dua permintaan masuk bersamaan.
- Dokter bisa menyimpan diagnosis, panduan, tanggal kontrol, dan file; pemilik hewan melihatnya di akunnya dan tidak bisa melihat data hewan lain.
- Pengingat terkirim otomatis sesuai tanggal kontrol, tanpa duplikat.
- Admin mengelola seluruh data; owner hanya bisa melihat.
- UI lolos pemeriksaan bagian 7: tidak ada elemen terlarang di 7.2, semua state di 7.6 tersedia, dan nyaman dipakai di layar ponsel.

Setelah rencana disetujui, kerjakan satu fase pada satu waktu, dan berhenti untuk review di akhir setiap fase.