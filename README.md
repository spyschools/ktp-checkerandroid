# KTP Checker Android

Aplikasi Android untuk memeriksa **pola dasar** NIK Indonesia secara lokal di perangkat. Versi sumber ini dimodernisasi dari arsip proyek KTP Checker yang diberikan, menggunakan NativeScript 9 dan target Android 16/API 36.

> **Penting:** aplikasi ini bukan layanan Dukcapil dan tidak mengakses atau memverifikasi NIK terhadap basis data pemerintah. Status “struktur NIK sesuai pola” hanya berarti format dan bagian tanggal lolos pemeriksaan lokal. Itu **bukan bukti** bahwa identitas, NIK, atau KTP asli, terdaftar, atau aktif.

## Informasi versi

| Metadata | Nilai |
| --- | --- |
| Nama aplikasi | KTP Checker |
| Versi sumber | `2.0.0` |
| Tanggal metadata rilis sumber | 15 Oktober 2026 |
| Pengembang versi ini | Fariz Azhari |
| Profil GitHub | <https://github.com/spyschools> |
| Repository | <https://github.com/spyschools/ktp-checkerandroid> |
| NativeScript Core | 9.0.x |
| Target Android | Android 16 / API 36 |
| Minimum Android API | 23 |
| Lisensi | MIT; lihat `LICENSE` dan kredit proyek asal |

Tanggal tersebut adalah metadata versi sumber, bukan bukti bahwa APK sudah dibangun, diuji pada semua perangkat, atau diterbitkan sebagai GitHub Release. Repository ini belum menyertakan APK yang telah dikompilasi dan ditandatangani.

## Fitur

- Memeriksa panjang dan format digit NIK serta bagian tanggal lahir yang dikodekan dalam polanya.
- Menguraikan jenis kelamin menurut konvensi angka tanggal dan menghitung perkiraan usia.
- Menampilkan enam digit kode wilayah sebagai kode saja; aplikasi tidak menebak nama provinsi/kabupaten/kecamatan dari kode tersebut.
- Menyimpan riwayat lokal maksimal 30 entri serta menyediakan opsi untuk menghapusnya.
- Pemeriksaan pola NIK dilakukan di perangkat. Kode parser tidak mengirim NIK ke server atau memanggil API.
- Menyediakan unit test untuk fungsi pemeriksaan pola NIK dan workflow GitHub Actions untuk menjalankannya.

## Batasan dan privasi

- Tidak ada integrasi API atau basis data Dukcapil, sehingga keaslian dan status administrasi kependudukan tidak dapat diverifikasi.
- Riwayat disimpan di penyimpanan privat aplikasi pada perangkat, tetapi tidak dienkripsi secara terpisah. Hapus riwayat saat tidak lagi diperlukan atau sebelum menyerahkan perangkat kepada orang lain.
- Nama/alias bersifat opsional. Gunakan data uji dan jangan memasukkan data pribadi pihak lain tanpa izin.
- Penafsiran tahun dua digit merupakan perkiraan, bukan sumber tanggal lahir resmi.

## Persiapan pengembangan

Pasang alat berikut di komputer:

1. **Node.js 22 LTS** dan npm.
2. **JDK 17**.
3. **Android Studio** beserta Android SDK Platform 36, Android SDK Build-Tools 36, dan Android SDK Command-line Tools.
4. NativeScript CLI 9.x.

Pasang NativeScript CLI dan periksa lingkungan Android:

```bash
npm install --global nativescript@9.0.6
ns --version
ns doctor android
```

Versi CLI lain dapat digunakan bila kompatibel dengan dependensi yang dideklarasikan di `package.json`.

## Instalasi dan menjalankan aplikasi

Jika repository sudah tersedia di GitHub:

```bash
git clone https://github.com/spyschools/ktp-checkerandroid.git
cd ktp-checkerandroid
npm install
npm test
ns run android
```

Pastikan emulator Android sudah berjalan atau aktifkan **Developer options** dan **USB debugging** pada perangkat Android, lalu sambungkan ke komputer.

## Menjalankan unit test

Parser NIK menggunakan modul bawaan Node.js, sehingga pengujian unit tidak memerlukan Android SDK:

```bash
npm test
```

Tes mencakup panjang NIK, digit, tanggal laki-laki/perempuan, tanggal kalender, dan tahun kabisat. Tes ini memeriksa logika pola lokal, bukan validitas data administrasi kependudukan.

Workflow `.github/workflows/test.yml` menjalankan `npm test` ketika ada push ke cabang `main`, pull request, atau pemicu manual melalui tab **Actions**. Workflow ini hanya menjalankan unit test JavaScript; workflow tersebut **tidak membangun atau menguji APK Android**.

## Build APK debug

Dengan JDK, NativeScript CLI, dan Android SDK yang sudah disiapkan:

```bash
npm install
npm test
ns build android
```

Lokasi APK debug yang umum adalah:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Lokasi keluaran bisa berubah mengikuti versi tooling. APK debug ditujukan untuk pengujian. Untuk distribusi publik, buat build release dan tanda tangani dengan keystore milik Anda. **Jangan** mengunggah keystore atau kata sandinya ke GitHub. Untuk Google Play, periksa kembali persyaratan Play Console, pengujian perangkat, kebijakan privasi, dan penandatanganan AAB sebelum mengirimkan aplikasi.

## Mengunggah perubahan secara manual lewat situs GitHub

Untuk memperbarui repository <https://github.com/spyschools/ktp-checkerandroid> melalui browser:

1. Ekstrak ZIP perubahan yang disiapkan dan pertahankan struktur foldernya.
2. Pada halaman repository, pilih **Add file → Upload files** untuk mengunggah `README.md` dan `nativescript.config.ts` ke root repository. Unggah `.gitignore` juga jika browser menampilkan berkas tersembunyi; jika tidak, buat berkas baru bernama `.gitignore` dari menu **Add file → Create new file** lalu salin isinya.
3. Buat `.github/workflows/test.yml` melalui **Add file → Create new file**. Masukkan nama jalur lengkap itu sebagai nama berkas, lalu salin isi workflow dari paket perubahan.
4. Periksa pratinjau perubahan, masukkan pesan commit, misalnya `Perbaiki konfigurasi resource dan workflow test`, lalu klik **Commit changes**.
5. Buka tab **Actions** untuk melihat hasil workflow. Status hijau berarti unit test JavaScript berhasil; itu bukan bukti bahwa APK telah berhasil dibangun atau diuji pada perangkat Android.

Jika mengunggah folder tersembunyi melalui browser tidak berjalan dengan baik, buat file `.gitignore` dan `.github/workflows/test.yml` satu per satu seperti langkah di atas.

## Struktur utama repository

```text
ktp-checkerandroid/
├── .github/
│   └── workflows/
│       └── test.yml
├── app/
│   ├── App_Resources/Android/   # Resource dan konfigurasi native Android
│   ├── home/                    # Antarmuka utama dan riwayat
│   ├── app-root.xml             # Entry point UI
│   ├── app.css                  # Gaya aplikasi
│   ├── app.js                   # Bootstrap NativeScript
│   └── nik-parser.js            # Pemeriksaan pola NIK lokal
├── tests/                       # Unit test Node.js
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── nativescript.config.ts
└── package.json
```

`nativescript.config.ts` menunjuk `appResourcesPath` ke `app/App_Resources` karena resource proyek berada di jalur tersebut relatif terhadap root repository.

## Kredit dan lisensi

Versi ini merupakan refaktor/pemeliharaan atas kode proyek KTP Checker yang diarsipkan dari proyek asal [`dyazincahya/ktp-checker-android`](https://github.com/dyazincahya/ktp-checker-android). Pengembangan versi ini dilakukan oleh **Fariz Azhari**. Pemberitahuan hak cipta dan lisensi MIT proyek asal dipertahankan dalam `LICENSE` sesuai ketentuannya. Parser pada versi ini memeriksa pola dasar dan tidak menyertakan basis data resmi wilayah.

Proyek ini tidak berafiliasi dengan Kementerian Dalam Negeri atau Dukcapil.
