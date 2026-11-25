# Mari Rawat Bersama

Website sederhana untuk mendata kondisi fasilitas sekolah dan asrama (mesin cuci, bed, dipan, kamar mandi, dan lainnya). Siswa/i bisa menandai fasilitas **Bermasalah** atau **Baik** dengan satu tombol, dan pihak sekolah bisa melihat ringkasannya.

## Struktur file
- `index.html` : kerangka halaman
- `style.css` : tampilan
- `script.js` : logika (data, tombol status, filter, ekspor)
- `README.md` : panduan ini

## Cara menjalankan
Simpan keempat file dalam satu folder, lalu buka `index.html` di browser. Tidak perlu instalasi.

## Fitur
- Tombol tunggal per fasilitas: *Tandai bermasalah* / *Tandai sudah baik*
- Catatan masalah opsional pada fasilitas yang bermasalah
- Ringkasan jumlah fasilitas (total, bermasalah, baik)
- Cari, filter status, dan filter kategori
- Tambah dan hapus fasilitas
- Unduh laporan CSV untuk pihak sekolah (bisa dibuka di Excel/Google Sheets)

## Mengubah data awal
Edit daftar `DATA_AWAL` di `script.js`. Format: `[nama, kategori, lokasi]`. Kategori ada di `KATEGORI`.

## Penting: soal berbagi data
Versi ini menyimpan data di **localStorage**, jadi tersimpan hanya di browser perangkat masing-masing. Perubahan satu siswa belum terlihat di perangkat lain.

Agar semua siswa dan pihak sekolah melihat data yang sama, hubungkan ke penyimpanan online, misalnya:
1. **Firebase Firestore** (gratis untuk skala sekolah), atau
2. **Google Sheets + Apps Script** (paling mudah untuk pemula).

Ganti fungsi `muat()` dan `simpan()` di `script.js` agar membaca dan menulis ke layanan tersebut. Bagian lain tidak perlu diubah.

## Hosting gratis
Unggah folder ke GitHub Pages, Netlify, atau Cloudflare Pages agar bisa diakses lewat tautan.

## Saran
Sebelum dipakai luas, sepakati aturan penggunaan bersama (misalnya tidak menuliskan nama orang di catatan), agar website ini tetap fokus pada perbaikan fasilitas.
