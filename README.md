# WP Sass

WP Sass adalah sebuah modul node.js yang digunakan untuk mempercepat proses pengembangan tema wordpress yang dilengkapi dengan compiler sass.

## Memulai

- Instalasi

```
npm install git+https://repository.wajek.id/mochrira/wp-sass.git
```

- Buat file gulpfile.js dengan konten sebagai berikut

```
require('wp-sass').setup(<direktori kode sumber>, '<direktori destinasi>');
```

## Menjalankan

Untuk compile semua kode, jalankan perintah berikut

```
$ gulp build
```

Untuk compile semua kode disertai dengan deteksi perubahan, jalankan perintah berikut

```
$ gulp watch
```