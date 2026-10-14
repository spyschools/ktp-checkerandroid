# KTP Checker Android

Aplikasi Android untuk memeriksa **pola dasar** NIK Indonesia secara lokal di perangkat. Kode sumber versi ini dimodernisasi dari arsip proyek KTP Checker yang diberikan, menggunakan NativeScript 9 dan target Android 16/API 36.

> **Penting:** aplikasi ini bukan layanan Dukcapil dan tidak mengakses atau memverifikasi NIK terhadap database pemerintah. Status “struktur NIK sesuai pola” hanya berarti format dan bagian tanggal lolos pemeriksaan lokal; itu **bukan bukti** bahwa identitas, NIK, atau KTP asli, terdaftar, atau aktif.

## Informasi versi

| Metadata | Nilai |
| --- | --- |
| Nama aplikasi | KTP Checker |
| Versi sumber | `2.0.0` |
| Tanggal rilis sumber | 15 Oktober 2026 |
| Pengembang versi ini | Fariz Azhari |
| Profil GitHub | https://github.com/spyschools |
| URL repositori yang disarankan | https://github.com/spyschools/ktp-checkerandroid |
| NativeScript Core | 9.0.x |
| Android target | Android 16 / API 36 |
| Android minimum | API 23 |
| Lisensi | MIT; lihat `LICENSE` dan kredit proyek asal |

Tanggal di atas adalah metadata rilis sumber yang disiapkan pada 15 Oktober 2026. Paket ini tidak membuat GitHub Release, tidak mengunggah repo secara otomatis, dan belum menyertakan APK yang telah dikompilasi atau ditandatangani.

## Fitur

- Memeriksa jumlah digit dan bagian tanggal yang dikodekan dalam pola NIK.
- Menguraikan jenis kelamin menurut konvensi angka tanggal dan menghitung perkiraan usia.
- Menampilkan enam digit kode wilayah sebagai kode saja; aplikasi tidak menebak nama provinsi/kabupaten/kecamatan dari kode tersebut.
- Menyimpan riwayat lokal maksimal 30 entri dan menyediakan tombol untuk menghapusnya.
- Kode pemeriksaan tidak memanggil API atau mengirim NIK ke server; tidak menambahkan izin kontak, lokasi, atau penyimpanan eksternal.
- Menyediakan tes unit untuk fungsi pemeriksaan pola NIK.

### Batasan dan privasi

- Tidak ada integrasi API atau basis data Dukcapil, sehingga keaslian dan status kependudukan tidak dapat disimpulkan.
- Riwayat disimpan di penyimpanan privat aplikasi pada perangkat, tetapi tidak dienkripsi secara terpisah. Hapus riwayat sebelum menyerahkan perangkat kepada orang lain atau bila tidak lagi dibutuhkan.
- Nama/alias bersifat opsional. Sebaiknya gunakan data uji dan jangan memasukkan data pribadi pihak lain tanpa izin.
- Penafsiran tahun dua digit adalah perkiraan, bukan sumber tanggal lahir resmi.

## Persiapan

Install alat berikut di komputer:

1. **Node.js 22 LTS** dan npm.
2. **JDK 17**.
3. **Android Studio** beserta Android SDK Platform 36, Android SDK Build-Tools 36, dan Android SDK Command-line Tools.
4. NativeScript CLI 9.x.

Pasang CLI:

```bash
npm install --global nativescript@9.0.6
ns --version
ns doctor android
```

Versi CLI yang lebih baru dapat digunakan bila kompatibel dengan dependensi yang dideklarasikan di `package.json`.

## Instalasi dan menjalankan aplikasi

```bash
git clone https://github.com/spyschools/ktp-checkerandroid.git
cd ktp-checkerandroid
npm install
npm test
ns run android
```

Pastikan emulator Android sudah berjalan atau aktifkan **Developer options** dan **USB debugging** pada perangkat Android, lalu sambungkan ke komputer. Jika belum memiliki repositori GitHub dengan nama tersebut, buat repositori kosong terlebih dahulu di akun `spyschools`, kemudian jalankan perintah `git clone` setelah URL tersedia.

## Build APK debug

```bash
npm install
npm test
ns build android --env.production
```

NativeScript biasanya menaruh APK debug di bawah:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Lokasi keluaran dapat berubah sesuai versi tooling. APK debug cocok untuk pengujian; untuk distribusi publik, buat build release dan tanda tangani dengan keystore milik Anda. **Jangan** commit keystore atau kata sandinya ke GitHub. Untuk rilis Google Play, periksa kembali persyaratan Play Console, pengujian perangkat, kebijakan privasi, dan penandatanganan AAB terbaru sebelum mengirimkan aplikasi.

## Tes

Fungsi parser tidak memerlukan Android SDK untuk dites:

```bash
npm test
```

Tes meliputi panjang NIK, digit, tanggal laki-laki/perempuan, tanggal kalender, dan tahun kabisat. Tes tersebut memeriksa logika lokal, bukan validitas data administrasi kependudukan.

## Upload kode sumber ke GitHub

1. Buka [https://github.com/new](https://github.com/new) dan pastikan akun yang aktif adalah `spyschools`.
2. Isi **Repository name** dengan `ktp-checkerandroid`, pilih **Public** atau **Private** sesuai kebutuhan, lalu klik **Create repository**. Untuk mengunggah manual, jangan centang opsi untuk membuat README, `.gitignore`, atau lisensi karena semuanya sudah tersedia dalam paket sumber.
3. Ekstrak ZIP di komputer Anda. Buka repository kosong di GitHub, klik **Add file → Upload files**, lalu seret isi folder proyek (bukan file ZIP-nya) ke area unggah. Pastikan struktur seperti `app/`, `tests/`, dan file `README.md` tetap di root repository.
4. Jika browser tidak mengikutsertakan file/folder tersembunyi, unggah `.gitignore` dan `.editorconfig` secara terpisah. Untuk workflow, gunakan **Add file → Create new file** dan buat `.github/workflows/test.yml`, lalu salin konten dari berkas yang sama pada paket sumber.
5. Isi pesan commit, misalnya `Modernisasi KTP Checker Android 2.0.0`, lalu klik **Commit changes**. GitHub mendukung hingga 100 file sekali unggah dan batas 25 MiB per file lewat browser; bila perlu, unggah dalam beberapa bagian.
6. Setelah berkas terlihat di [https://github.com/spyschools/ktp-checkerandroid](https://github.com/spyschools/ktp-checkerandroid), buka **Releases → Draft a new release**, buat tag `v2.0.0`, dan gunakan catatan dari `CHANGELOG.md` jika memang siap diterbitkan. Upload kode sumber tidak otomatis menerbitkan APK atau GitHub Release.

## Struktur folder

```text
ktp-checkerandroid/
├── app/
│   ├── App_Resources/Android/   # Pengaturan Android, manifest, ikon, dan versi
│   ├── home/                    # Halaman utama, form, hasil, dan riwayat
│   ├── app-root.xml             # Entry point UI
│   ├── app.css                  # Gaya UI
│   ├── app.js                   # Bootstrap NativeScript
│   └── nik-parser.js            # Pemeriksaan struktur NIK lokal
├── tests/                       # Unit test Node.js
├── CHANGELOG.md
├── LICENSE
├── README.md
├── nativescript.config.ts
└── package.json
```

## Kredit dan lisensi

Versi ini merupakan refaktor/pemeliharaan atas kode proyek KTP Checker yang diarsipkan dari proyek asal `dyazincahya/ktp-checker-android`. Pengembangan versi ini dilakukan oleh **Fariz Azhari**. Lisensi MIT proyek asal mewajibkan penyertaan pemberitahuan hak cipta dan lisensinya; pemberitahuan tersebut dipertahankan di `LICENSE`. Parser pada versi ini ditulis ulang untuk memeriksa pola dasar dan tidak menyertakan basis data resmi wilayah.

Proyek tidak berafiliasi dengan Kementerian Dalam Negeri atau Dukcapil.
